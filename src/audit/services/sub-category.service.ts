import { BadRequestException, Injectable } from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { SubCategoryDal } from '../dal/mongodb/sub-category.dal';
import { PaginationQuery, PaginationResultDto } from '@bondsports/types';
import { CreateSubCategoryDto, SubCategoryDto } from '../types/dto/audit.dto';
import { SubCategory } from '../models/mongodb/sub-category';
import { i18n } from '../../i18n';
import { Logger } from '../../config/logger';

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

	/**
	 * Create a sub-category
	 * @param organizationId {number} The organization ID
	 * @param createSubCategoryDto {CreateSubCategoryDto} The sub-category DTO
	 * @returns {Promise<SubCategoryDto>} The created sub-category
	 */
	async createSubCategory(organizationId: number, createSubCategoryDto: CreateSubCategoryDto): Promise<SubCategoryDto> {
		const existingSubCategory: SubCategory = await this.subCategoryDal.findOneByName(
			organizationId,
			createSubCategoryDto.name
		);

		if (existingSubCategory) {
			throw new BadRequestException(
				i18n.subCategories.errors.subCategoryAlreadyExists(organizationId, createSubCategoryDto.name)
			);
		}

		const createdSubCategory: SubCategory = await this.subCategoryDal.create(
			organizationId,
			this.mapper.map(createSubCategoryDto, SubCategoryDto, SubCategory)
		);

		const subCategory: SubCategoryDto = this.mapper.map(createdSubCategory, SubCategory, SubCategoryDto);

		Logger.info(`createSubCategory - Successfully created sub-category with ID "${subCategory.id}"`);

		return subCategory;
	}
}
