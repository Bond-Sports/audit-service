import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryDal } from '../dal/mongodb/category.dal';
import { PaginationQuery, PaginationResultDto } from '@bondsports/types';
import { CategoryDto, CreateCategoryDto } from '../types/dto/audit.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Category } from '../models/mongodb/category';
import { i18n } from '../../i18n';
import { Logger } from '../../config/logger';
import { AuditLogDal } from '../dal/mongodb/audit-log.dal';

@Injectable()
export class CategoryService {
	constructor(
		private categoryDal: CategoryDal,
		private auditLogDal: AuditLogDal,
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

	/**
	 * Create a category
	 * @param organizationId {number} The organization ID
	 * @param createCategoryDto {CreateCategoryDto} The category DTO
	 * @returns {Promise<CategoryDto>} The created category
	 */
	async createCategory(organizationId: number, createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
		const existingCategory: Category = await this.categoryDal.findOneByName(organizationId, createCategoryDto.name);

		if (existingCategory) {
			throw new BadRequestException(
				i18n.categories.errors.categoryAlreadyExists(organizationId, createCategoryDto.name)
			);
		}

		const createdCategory: Category = await this.categoryDal.create(
			organizationId,
			this.mapper.map(createCategoryDto, CreateCategoryDto, Category)
		);

		const category: CategoryDto = this.mapper.map(createdCategory, Category, CategoryDto);

		Logger.info(`createCategory - Successfully created category with ID "${category.id}"`);

		return category;
	}

	/**
	 * Delete a category
	 * @param organizationId {number} The organization ID
	 * @param categoryId {number} The category ID
	 * @param includeAudits {boolean} Whether to include audits
	 */
	async deleteCategory(organizationId: number, categoryId: string, includeAudits = false): Promise<boolean> {
		const success: boolean = await this.categoryDal.delete(organizationId, categoryId);

		if (includeAudits && success) {
			await this.auditLogDal.deleteBy(organizationId, { categoryId: categoryId });
		}

		return success;
	}
}
