import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ByOrganizationIdDto, PaginationQuery, PaginationResultDto } from '@bondsports/types';
import { AuditService } from './services/audit.service';
import { AuditLog } from './models/mongodb/audit-log';

@Controller('audit/organization/:organizationId')
export class AuditController {
	constructor(private auditService: AuditService) {}

	@Get('/')
	@ApiParam({ name: 'organizationId', type: 'integer' })
	@ApiQuery({ name: 'pagination', type: PaginationQuery })
	@ApiOperation({ description: 'Get organization audit logs', operationId: 'getOrganizationAuditLogs' })
	getOrganizationAuditLogs(
		@Param() { organizationId }: ByOrganizationIdDto,
		@Query() pagination: PaginationQuery
	): Promise<PaginationResultDto<AuditLog>> {
		return this.auditService.getOrganizationAuditLogs(organizationId, pagination);
	}
}
