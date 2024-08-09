import { BaseDal } from './base.dal';
import { IAuditSubCategory } from '../../models/dynamodb/types/audit.dynamodb.interfaces';
import { SubCategoryModel } from '../../models/dynamodb/sub-category';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubCategoryDal extends BaseDal<IAuditSubCategory> {
	constructor() {
		super(SubCategoryModel);
	}
}
