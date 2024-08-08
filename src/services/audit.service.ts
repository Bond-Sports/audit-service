import { Injectable } from '@nestjs/common';
import { AuditLogDal } from '../dal/audit-log.dal';
import { CategoryDal } from '../dal/category.dal';
import { ActionTypeDal } from '../dal/action-type.dal';
import { SubCategoryDal } from '../dal/sub-category.dal';
import { PaginationQueryDto, PaginationResultDto } from '../types/dtos/general.dto';
import { IAuditLog } from '../types/interfaces';
import { promiseAllSettled, useConditionalPromise } from '@bondsports/general';
import { AuditLog } from '../models/audit-log';

@Injectable()
export class AuditService {
	constructor(
		private auditLogDal: AuditLogDal,
		private categoryDal: CategoryDal,
		private subCategoryDal: SubCategoryDal,
		private actionTypeDal: ActionTypeDal
	) {}

	getOrganizationAuditLogs(
		organizationId: number,
		pagination: PaginationQueryDto
	): Promise<PaginationResultDto<AuditLog>> {
		return this.auditLogDal.paginatedFind(organizationId, pagination);
	}

	async createAuditLog(auditLog: AuditLog): Promise<IAuditLog> {
		const [category, subCategory, actionType] = await promiseAllSettled(
			useConditionalPromise(() => this.categoryDal.findById(auditLog.categoryId), !!auditLog.categoryId),
			useConditionalPromise(() => this.subCategoryDal.findById(auditLog.subCategoryId), !!auditLog.subCategoryId),
			useConditionalPromise(() => this.actionTypeDal.findById(auditLog.actionTypeId), !!auditLog.actionTypeId)
		);

		if (!category && auditLog.categoryId) {
			throw new Error(`Category with id ${auditLog.categoryId} not found`);
		}

		if (!subCategory && auditLog.subCategoryId) {
			throw new Error(`SubCategory with id ${auditLog.subCategoryId} not found`);
		}

		if (!actionType && auditLog.actionTypeId) {
			throw new Error(`ActionType with id ${auditLog.actionTypeId} not found`);
		}

		return this.auditLogDal.create(auditLog as IAuditLog);
	}
}
