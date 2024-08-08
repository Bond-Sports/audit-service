import { IDal } from './types/intefaces';
import { IBaseAudit } from '../types/interfaces';
import { ItemArray, ModelType } from 'dynamoose/dist/General';
import { Query, QueryResponse } from 'dynamoose/dist/ItemRetriever';
import { PaginationQueryDto, PaginationResultDto } from '../types/dtos/general.dto';
import { BadRequestException } from '@nestjs/common';
import * as uuid from 'uuid';

export abstract class BaseDal<T extends IBaseAudit> implements IDal<T> {
	protected constructor(private model: ModelType<T>) {}

	/**
	 * Returns a paginated result for a given organization
	 * @param organizationId {number} - The organization ID
	 * @param pagination {PaginationQueryDto} - The pagination query
	 * @returns {Promise<PaginationResultDto<T>>} - The paginated result
	 */
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

	/**
	 * Find all entities for a given organization
	 * @param organizationId {number} - The organization ID
	 * @returns {Promise<T[]>} - The entities
	 */
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

	/**
	 * Find an entity by its ID
	 * @param id {string} - The entity ID
	 * @returns {Promise<T>} - The entity
	 */
	async findById(id: string): Promise<T> {
		const response: QueryResponse<T> = await this.model.query('id').eq(id).limit(1).exec();
		return [...response].at(0);
	}

	/**
	 * Create a new entity
	 * @param data {T} - The entity data
	 * @returns {Promise<T>} - The created entity
	 */
	async create(data: T): Promise<T> {
		const entity: T = new this.model({ ...data, id: uuid.v4() });
		await entity.save();
		return entity;
	}

	/**
	 * Update an entity by its ID
	 * @param id {string} - The entity ID
	 * @param data {Partial<T>} - The data to update
	 * @returns {Promise<T>} - The updated entity
	 */
	async update(id: string, data: Partial<T>): Promise<T> {
		const entity: T = await this.findById(id);

		if (!entity) {
			throw new BadRequestException(`Entity of type "${this.model.Model.name}" with ID "${id}" not found`);
		}

		await this.model.update(entity, { $SET: data });

		Object.assign(entity, data);

		return entity;
	}

	/**
	 * Delete an entity by its ID
	 * @param id {string} - The entity ID
	 * @returns {Promise<boolean>} - True if the entity was deleted, false otherwise
	 */
	async delete(id: string): Promise<boolean> {
		await this.update(id, { deletedAt: Date.now() } as Partial<T>);
		return true;
	}
}
