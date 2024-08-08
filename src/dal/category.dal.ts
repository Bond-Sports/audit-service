import { BaseDal } from './base.dal';
import { IAuditCategory } from '../types/interfaces';
import { CategoryModel } from '../models/category';

export class CategoryDal extends BaseDal<IAuditCategory> {
	constructor() {
		super(CategoryModel);
	}
}
