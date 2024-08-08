import { IDal } from './types/intefaces';
import { IBaseAudit } from '../types/interfaces';
import { ItemArray, ModelType } from 'dynamoose/dist/General';
import { Query, QueryResponse } from 'dynamoose/dist/ItemRetriever';
import { PaginationQueryDto, PaginationResultDto } from '../types/dtos/general.dto';
import { BadRequestException } from '@nestjs/common';
import { OrderEnum } from '../types/enums';
import * as uuid from 'uuid';

export abstract class BaseDal<T extends IBaseAudit> implements IDal<T> {
	protected constructor(private model: ModelType<T>) {}

	async paginatedFind(organizationId: number, pagination: PaginationQueryDto): Promise<PaginationResultDto<T>> {
		const queryBuilder: Query<T> = this.model.query({ organizationId }).limit(pagination.limit);

		if (pagination.lastId) {
			queryBuilder.startAt({ id: pagination.lastId, organizationId });
		}

		queryBuilder.filter('deletedAt').not().exists();

		const response: QueryResponse<T> = await queryBuilder.exec();

		const entities: T[] = await response.populate();

		return {
			lastId: response.lastKey?.id ?? null,
			data: entities,
		};
	}
	async find(organizationId: number): Promise<T[]> {
		const response: QueryResponse<T> = await this.model
			.query('organizationId')
			.eq(organizationId)
			.filter('deletedAt')
			.eq(null)
			.sort('ascending')
			.exec();

		const entities: ItemArray<T> = await response.populate();

		return [...entities];
	}

	async findById(id: string): Promise<T> {
		const response: QueryResponse<T> = await this.model.query('id').eq(id).limit(1).exec();
		return [...response].at(0);
	}

	async create(data: T): Promise<T> {
		const entity: T = new this.model({ ...data, id: uuid.v4() });
		await entity.save();
		return entity;
	}

	async update(id: string, data: Partial<T>): Promise<T> {
		const entity: T = await this.findById(id);

		if (!entity) {
			throw new BadRequestException(`Entity of type "${this.model.Model.name}" with ID "${id}" not found`);
		}

		Object.assign(entity, data);

		await this.model.update(entity);

		return entity;
	}

	async delete(id: string): Promise<boolean> {
		await this.update(id, { deletedAt: new Date() } as Partial<T>);
		return true;
	}
}
