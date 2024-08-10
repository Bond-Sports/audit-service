import { Injectable } from '@nestjs/common';
import { CategoryDal } from '../dal/mongodb/category.dal';
import { PaginationQuery, PaginationResultDto } from '@bondsports/types';
import { CategoryDto } from '../types/dto/audit.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Category } from '../models/mongodb/category';

@Injectable()
export class CategoryService {
	constructor(
		private categoryDal: CategoryDal,
		@InjectMapper() private mapper: Mapper
	) {}

	/**
	 * Returns a pagianted list of categories for an organization
	 * @param organizationId {number} The organization id
	 * @returns {Promise<PaginationResultDto<CategoryDto>>} A paginated list of categories
	 */
	async getOrganizationCategories(
		organizationId: number,
		pagination: PaginationQuery
	): Promise<PaginationResultDto<CategoryDto>> {
		const { meta, data } = await this.categoryDal.paginatedFind(organizationId, pagination);
		return {
			meta,
			data: this.mapper.mapArray(data, Category, CategoryDto),
		};
	}
}
