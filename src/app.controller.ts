import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './services/audit.service';
import { PaginationQueryDto } from './types/dtos/general.dto';

@Controller()
export class AppController {
	constructor(private auditService: AuditService) {}

	@Get('/')
	healthCheck(@Query() pagination: PaginationQueryDto) {
		return this.auditService.getOrganizationAuditLogs(155, pagination);
	}
}
