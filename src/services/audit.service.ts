import { BadRequestException, Injectable } from '@nestjs/common';
import { AuditLogDal } from '../dal/audit-log.dal';
import { CategoryDal } from '../dal/category.dal';
import { ActionTypeDal } from '../dal/action-type.dal';
import { SubCategoryDal } from '../dal/sub-category.dal';
import { PaginationQueryDto, PaginationResultDto } from '../types/dtos/general.dto';
import { IAuditLog } from '../types/interfaces';
import { promiseAllSettled, useConditionalPromise } from '@bondsports/general';
import { AuditLog } from '../models/audit-log';
import { i18n } from '../i18n';

@Injectable()
export class AuditService {
	constructor(
		private auditLogDal: AuditLogDal,
		private categoryDal: CategoryDal,
		private subCategoryDal: SubCategoryDal,
		private actionTypeDal: ActionTypeDal
	) {}

	/**
	 * Returns a paginated result for a given organization
	 * @param organizationId {number} - The organization ID
	 * @param pagination {PaginationQueryDto} - The pagination query
	 * @returns {Promise<PaginationResultDto<AuditLog>>} - The paginated result
	 */
	getOrganizationAuditLogs(
		organizationId: number,
		pagination: PaginationQueryDto
	): Promise<PaginationResultDto<AuditLog>> {
		return this.auditLogDal.paginatedFind(organizationId, pagination);
	}

	/**
	 * Creates an audit log
	 * @param auditLog {AuditLog} - The audit log to create
	 * @returns {Promise<IAuditLog>} - The created audit log
	 */
	async createAuditLog(auditLog: AuditLog): Promise<IAuditLog> {
		const [category, subCategory, actionType] = await promiseAllSettled(
			useConditionalPromise(() => this.categoryDal.findById(auditLog.categoryId), !!auditLog.categoryId),
			useConditionalPromise(() => this.subCategoryDal.findById(auditLog.subCategoryId), !!auditLog.subCategoryId),
			useConditionalPromise(() => this.actionTypeDal.findById(auditLog.actionTypeId), !!auditLog.actionTypeId)
		);

		if (!category && auditLog.categoryId) {
			throw new BadRequestException(i18n.audit.errors.categoryNotFound(auditLog.categoryId));
		}

		if (!subCategory && auditLog.subCategoryId) {
			throw new BadRequestException(i18n.audit.errors.subCategoryNotFound(auditLog.subCategoryId));
		}

		if (!actionType && auditLog.actionTypeId) {
			throw new BadRequestException(i18n.audit.errors.actionTypeNotFound(auditLog.actionTypeId));
		}

		return this.auditLogDal.create(auditLog as IAuditLog);
	}
}
