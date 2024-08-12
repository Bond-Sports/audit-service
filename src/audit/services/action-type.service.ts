import { BadRequestException, Injectable } from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ActionTypeDal } from '../dal/mongodb/action-type.dal';
import { PaginationQuery, PaginationResultDto } from '@bondsports/types';
import { ActionTypeDto, CategoryDto, CreateActionTypeDto } from '../types/dto/audit.dto';
import { ActionType } from '../models/mongodb/action-type';
import { i18n } from '../../i18n';
import { Logger } from '../../config/logger';

@Injectable()
export class ActionTypeService {
	constructor(
		private actionTypeDal: ActionTypeDal,
		@InjectMapper() private mapper: Mapper
	) {}

	/**
	 * Returns a paginated list of action types for an organization
	 * @param organizationId {number} The organization id
	 * @param pagination {PaginationQuery} The pagination query
	 * @returns {Promise<PaginationResultDto<CategoryDto>>} A paginated list of action types
	 */
	async getOrganizationActionTypes(
		organizationId: number,
		pagination: PaginationQuery
	): Promise<PaginationResultDto<CategoryDto>> {
		const { meta, data } = await this.actionTypeDal.paginatedFind(organizationId, pagination);
		return {
			meta,
			data: this.mapper.mapArray(data, ActionType, CategoryDto),
		};
	}

	/**
	 * Create an action type
	 * @param organizationId {number} The organization ID
	 * @param createCategoryDto {CreateActionTypeDto} The action type DTO
	 * @returns {Promise<ActionTypeDto>} The created action type
	 */
	async createActionType(organizationId: number, createCategoryDto: CreateActionTypeDto): Promise<ActionTypeDto> {
		const existingActionType: ActionType = await this.actionTypeDal.findOneByName(
			organizationId,
			createCategoryDto.name
		);

		if (existingActionType) {
			throw new BadRequestException(
				i18n.actionTypes.errors.actionTypeAlreadyExists(organizationId, createCategoryDto.name)
			);
		}

		const createdActionType: ActionType = await this.actionTypeDal.create(
			organizationId,
			this.mapper.map(createCategoryDto, CreateActionTypeDto, ActionType)
		);

		const actionType: ActionTypeDto = this.mapper.map(createdActionType, ActionType, ActionTypeDto);

		Logger.info(`createActionType - Successfully created action type with ID "${actionType.id}"`);

		return actionType;
	}
}
