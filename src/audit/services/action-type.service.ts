import { Injectable } from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ActionTypeDal } from '../dal/mongodb/action-type.dal';
import { PaginationQuery, PaginationResultDto } from '@bondsports/types';
import { CategoryDto } from '../types/dto/audit.dto';
import { ActionType } from '../models/mongodb/action-type';

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
}
