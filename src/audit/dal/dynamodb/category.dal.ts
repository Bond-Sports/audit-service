import { BaseDal } from './base.dal';
import { IAuditCategory } from '../../models/dynamodb/types/audit.dynamodb.interfaces';
import { CategoryModel } from '../../models/dynamodb/category';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryDal extends BaseDal<IAuditCategory> {
	constructor() {
		super(CategoryModel);
	}
}
