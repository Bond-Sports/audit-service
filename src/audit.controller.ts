import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { ByOrganizationIdDto } from '@bondsports/types';
import { AuditService } from './services/audit.service';
import { PaginationQueryDto, PaginationResultDto } from './types/dtos/general.dto';
import { IAuditLog } from './types/interfaces';
import { AuditLog } from './models/audit-log';

@Controller('audit/organization/:organizationId')
export class AuditController {
	constructor(private auditService: AuditService) {}

	@Get('/')
	@ApiParam({ name: 'organizationId', type: 'integer' })
	@ApiQuery({ name: 'pagination', type: PaginationQueryDto })
	getOrganizationAuditLogs(
		@Param() { organizationId }: ByOrganizationIdDto,
		@Query() pagination: PaginationQueryDto
	): Promise<PaginationResultDto<AuditLog>> {
		return this.auditService.getOrganizationAuditLogs(organizationId, pagination);
	}
}
