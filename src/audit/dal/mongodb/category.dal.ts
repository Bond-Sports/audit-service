import { Category } from '../../models/mongodb/category';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AUDIT_CATEGORIES_COLLECTION } from '../../models/mongodb/constants';
import { Model } from 'mongoose';
import { AuditBaseDal } from './base.dal';

@Injectable()
export class CategoryDal extends AuditBaseDal<Category> {
	constructor(@InjectModel(AUDIT_CATEGORIES_COLLECTION) model: Model<Category>) {
		super(model as any);
	}
}
