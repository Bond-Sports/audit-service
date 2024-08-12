import { Category } from '../../models/mongodb/category';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AUDIT_CATEGORIES_COLLECTION } from '../../models/mongodb/constants';
import { Model } from 'mongoose';
import { AuditBaseDal } from './base.dal';
import { IFindByNameDal } from '../types/interfaces';

@Injectable()
export class CategoryDal extends AuditBaseDal<Category> implements IFindByNameDal<Category> {
	constructor(@InjectModel(AUDIT_CATEGORIES_COLLECTION) model: Model<Category>) {
		super(model as any);
	}

	async findOneByName(organizationId: number, name: string): Promise<Category> {
		return await this.model.findOne({ organizationId: { $eq: organizationId }, name: { $eq: name } }).exec();
	}
}
