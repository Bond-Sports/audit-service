import { FilterQuery, Model, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { promiseAllSettled } from '@bondsports/general';
import { IDal } from '../types/intefaces';
import { PaginationQuery, PaginationResultDto } from '@bondsports/types';
import { Logger } from '../../../config/logger';
import { IBaseDocument } from '../../models/mongodb/types/audit.interfaces';

export abstract class AuditBaseDal<T extends IBaseDocument> implements IDal<T> {
	protected constructor(protected model: Model<T>) {}

	async paginatedFind(organizationId: number, pagination: PaginationQuery): Promise<PaginationResultDto<T>> {
		const [entities, count] = await promiseAllSettled(
			this.model
				.find({ organizationId: { $eq: organizationId }, deletedAt: { $eq: null } } as FilterQuery<T>)
				.skip(pagination.itemsPerPage * (pagination.page - 1))
				.limit(pagination.itemsPerPage)
				.exec(),
			this.model.countDocuments().exec()
		);

		return {
			meta: {
				totalPages: Math.ceil(count / pagination.itemsPerPage),
				currentPage: pagination.page,
				totalItems: count,
				itemsPerPage: pagination.itemsPerPage,
			},
			data: entities,
		};
	}

	async create(organizationId: number, entity: T): Promise<T> {
		const document = new this.model({ ...entity, organizationId });
		return await document.save();
	}

	async find(organizationId: number): Promise<T[]> {
		return await this.model
			.find({ organizationId: { $eq: organizationId }, deletedAt: { $eq: null } } as FilterQuery<T>)
			.exec();
	}

	async findById(id: string): Promise<T> {
		return await this.model.findOne({ _id: { $eq: id }, deletedAt: { $eq: null } } as FilterQuery<T>).exec();
	}

	async update(id: string, entity: Partial<T>): Promise<T> {
		const doc: T = await this.model.findOne({ _id: { $eq: id } } as FilterQuery<T>).exec();

		if (!doc) {
			Logger.warning(`${this.model.baseModelName} with ID "${id}" not found`);
			return null;
		}

		entity.updatedAt = new Date();
		const result: UpdateWriteOpResult = await this.model
			.updateOne({ _id: { $eq: id } } as FilterQuery<T>, entity as UpdateQuery<T>)
			.exec();

		if (result.modifiedCount > 0) {
			Logger.info(`Updated ${this.model.baseModelName} with ID "${id}"`);
			return Object.assign(doc, entity);
		}

		Logger.warning(`Failed to update ${this.model.baseModelName} with ID "${id}"`);
		return doc;
	}

	async delete(id: string): Promise<boolean> {
		const entity: T = await this.findById(id);

		if (!entity) {
			Logger.warning(`Failed to delete ${this.model.baseModelName}: entity not found`);
			return false;
		}

		const result: UpdateWriteOpResult = await this.model
			.updateOne({ _id: { $eq: entity.id } } as FilterQuery<T>, { deletedAt: new Date() } as UpdateQuery<T>)
			.exec();

		return result.modifiedCount > 0;
	}
}
