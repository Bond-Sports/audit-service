import { BaseDal } from './base.dal';
import { IAuditSubCategory } from '../types/interfaces';
import { SubCategoryModel } from '../models/sub-category';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubCategoryDal extends BaseDal<IAuditSubCategory> {
	constructor() {
		super(SubCategoryModel);
	}
}
