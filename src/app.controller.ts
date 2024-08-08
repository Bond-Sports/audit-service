import { Controller, Get } from '@nestjs/common';
import { HealthcheckService } from './services/health-check.service';
import { HealthCheckResponseDto } from './types/dtos/health-check.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
	constructor(private healthCheckService: HealthcheckService) {}

	@Get('/')
	@ApiOperation({
		summary: 'Get Health',
		description: 'Retrieve health information including the service version and health status.',
	})
	healthCheck(): Promise<HealthCheckResponseDto> {
		return this.healthCheckService.checkHealth();
	}
}
