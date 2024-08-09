import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AUDIT_SUB_CATEGORIES_COLLECTION } from '../../models/mongodb/constants';
import { Model } from 'mongoose';
import { SubCategory } from '../../models/mongodb/sub-category';
import { AuditBaseDal } from './base.dal';

@Injectable()
export class SubCategoryDal extends AuditBaseDal<SubCategory> {
	constructor(@InjectModel(AUDIT_SUB_CATEGORIES_COLLECTION) model: Model<SubCategory>) {
		super(model as any);
	}
}
