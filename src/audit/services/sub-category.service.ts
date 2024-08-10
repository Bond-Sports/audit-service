import { Injectable } from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { SubCategoryDal } from '../dal/mongodb/sub-category.dal';
import { PaginationQuery, PaginationResultDto } from '@bondsports/types';
import { SubCategoryDto } from '../types/dto/audit.dto';
import { SubCategory } from '../models/mongodb/sub-category';

@Injectable()
export class SubCategoryService {
	constructor(
		private subCategoryDal: SubCategoryDal,
		@InjectMapper() private mapper: Mapper
	) {}

	/**
	 * Returns a paginated list of sub-categories for a category
	 * @param categoryId {number} The category id
	 * @param pagination {PaginationQuery} The pagination query
	 * @returns {Promise<PaginationResultDto<SubCategoryDto>>} A paginated list of sub-categories
	 */
	async getOrganizationSubCategories(
		categoryId: number,
		pagination: PaginationQuery
	): Promise<PaginationResultDto<SubCategoryDto>> {
		const { meta, data } = await this.subCategoryDal.paginatedFind(categoryId, pagination);
		return {
			meta,
			data: this.mapper.mapArray(data, SubCategory, SubCategoryDto),
		};
	}
}
