import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ByOrganizationIdDto, GenericResponseDto, PaginationQuery, PaginationResultDto } from '@bondsports/types';
import { AuditService } from './audit/services/audit.service';
import { AuditLogDto, CategoryDto, CreateCategoryDto, DeleteByIdDto } from './audit/types/dto/audit.dto';
import { CategoryService } from './audit/services/category.service';
import { SubCategoryService } from './audit/services/sub-category.service';
import { ActionTypeService } from './audit/services/action-type.service';

// Todo - more structure - break the audit controller to multiple controllers

@ApiTags('Audit')
// Todo - @Controller('organization/:organizationId/audit')
@Controller('audit/organization/:organizationId')
export class AuditController {
	constructor(
		private auditService: AuditService,
		// Todo - we need to to talk about the CategoryService, SubCategoryService, I think it is the same service
		private categoryService: CategoryService,
		private subCategoryService: SubCategoryService,
		private actionTypeService: ActionTypeService
	) {}

	@Get()
	@ApiParam({ name: 'organizationId', type: 'integer' })
	@ApiQuery({ name: 'pagination', type: PaginationQuery }) // Todo - veriy me but I think you'll have a duplicaiton in the query params in the swagger
	@ApiOperation({ description: 'Get organization audit logs', operationId: 'getOrganizationAuditLogs' })
	getOrganizationAuditLogs(
		@Param() { organizationId }: ByOrganizationIdDto,
		@Query() pagination: PaginationQuery // Todo - we need to extent the query - we will want to get the audit log base Category, SubCategory, ActionType and also by date range, and user & user role
	): Promise<PaginationResultDto<AuditLogDto>> {
		return this.auditService.getOrganizationAuditLogs(organizationId, pagination);
	}

	// Todo - the category, sub-category api are swaged check the name of the api and the service 
	@Get('categories')
	@ApiParam({ name: 'organizationId', type: 'integer' })
	@ApiQuery({ name: 'pagination', type: PaginationQuery })
	@ApiOperation({ description: 'Get organization categories', operationId: 'getOrganizationCategories' })
	getOrganizationCategories(
		@Param() { organizationId }: ByOrganizationIdDto,
		@Query() pagination: PaginationQuery
	): Promise<PaginationResultDto<CategoryDto>> {
		return this.subCategoryService.getOrganizationSubCategories(organizationId, pagination);
	}

	@Get('sub-categories')
	@ApiParam({ name: 'organizationId', type: 'integer' })
	@ApiQuery({ name: 'pagination', type: PaginationQuery })
	@ApiOperation({ description: 'Get organization sub-categories', operationId: 'getOrganizationSubCategories' })
	getOrganizationSubCategories(
		@Param() { organizationId }: ByOrganizationIdDto,
		@Query() pagination: PaginationQuery
	): Promise<PaginationResultDto<CategoryDto>> {
		return this.categoryService.getOrganizationCategories(organizationId, pagination);
	}

	@Get('actions')
	@ApiParam({ name: 'organizationId', type: 'integer' })
	@ApiQuery({ name: 'pagination', type: PaginationQuery })
	@ApiOperation({ description: 'Get organization action-types', operationId: 'getOrganizationActionTypes' })
	getOrganizationActionTypes(
		@Param() { organizationId }: ByOrganizationIdDto,
		@Query() pagination: PaginationQuery
	): Promise<PaginationResultDto<CategoryDto>> {
		return this.actionTypeService.getOrganizationActionTypes(organizationId, pagination);
	}

	@Post('categories')
	@ApiParam({ name: 'organizationId', type: 'integer' })
	@ApiOperation({ description: 'Create organization category', operationId: 'createOrganizationCategory' })
	async createOrganizationCategory(
		@Param() { organizationId }: ByOrganizationIdDto,
		@Body() category: CreateCategoryDto
	): Promise<CategoryDto> {
		return await this.categoryService.createCategory(organizationId, category);
	}

	@Post('sub-categories')
	@ApiParam({ name: 'organizationId', type: 'integer' })
	@ApiOperation({ description: 'Create organization sub-category', operationId: 'createOrganizationSubCategory' })
	async createOrganizationSubCategory(
		@Param() { organizationId }: ByOrganizationIdDto,
		@Body() category: CreateCategoryDto
	): Promise<CategoryDto> {
		return await this.subCategoryService.createSubCategory(organizationId, category);
	}

	@Post('actions')
	@ApiParam({ name: 'organizationId', type: 'integer' })
	@ApiOperation({ description: 'Create organization action-type', operationId: 'createOrganizationActionType' })
	async createOrganizationActionType(
		@Param() { organizationId }: ByOrganizationIdDto,
		@Body() category: CreateCategoryDto
	): Promise<CategoryDto> {
		return await this.actionTypeService.createActionType(organizationId, category);
	}

	@Delete('categories/:categoryId')
	@ApiParam({ name: 'organizationId', type: 'integer' })
	@ApiParam({ name: 'categoryId', type: 'integer' })
	@ApiOperation({ description: 'Delete organization category', operationId: 'deleteOrganizationCategory' })
	async deleteOrganizationCategory(
		@Param() { organizationId, id, includeAuditLogs }: DeleteByIdDto
	): Promise<GenericResponseDto> {
		const success: boolean = await this.categoryService.deleteCategory(organizationId, id, includeAuditLogs);
		return { succeeded: success };
	}
}
