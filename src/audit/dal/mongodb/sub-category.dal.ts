import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AUDIT_SUB_CATEGORIES_COLLECTION } from '../../models/mongodb/constants';
import { Model } from 'mongoose';
import { SubCategory } from '../../models/mongodb/sub-category';
import { AuditBaseDal } from './base.dal';
import { IFindByNameDal } from '../types/interfaces';

@Injectable()
export class SubCategoryDal extends AuditBaseDal<SubCategory> implements IFindByNameDal<SubCategory> {
	constructor(@InjectModel(AUDIT_SUB_CATEGORIES_COLLECTION) model: Model<SubCategory>) {
		super(model as any);
	}

	/**
	 * Find a sub-category by name
	 * @param organizationId {number} The organization ID
	 * @param name {string} The name of the sub-category
	 * @returns {Promise<SubCategory>} The sub-category
	 */
	async findOneByName(organizationId: number, name: string): Promise<SubCategory> {
		return await this.model.findOne({ organizationId: { $eq: organizationId }, name: { $eq: name } }).exec();
	}
}
