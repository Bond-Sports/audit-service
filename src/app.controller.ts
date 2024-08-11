import { BadRequestException, Controller, Get } from '@nestjs/common';
import { HealthcheckService } from './services/health-check.service';
import { HealthCheckResponseDto } from './types/dtos/health-check.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { configService } from './config/config.service';

@ApiTags('Healthcheck')
@Controller()
export class AppController {
	constructor(private healthCheckService: HealthcheckService) {}

	@Get('/')
	@ApiOperation({
		summary: 'Get Health',
		description: 'Retrieve health information including the service version and health status.',
	})
	async getHealth(): Promise<any> {
		const [serviceHealth, version] = await Promise.all([
			this.healthCheckService.checkHealth(),
			configService.getVersion(),
		]);

		const responsePayload = {
			version,
			serviceHealth,
		};

		if (!serviceHealth.healthy) {
			throw new BadRequestException(JSON.stringify(responsePayload));
		}

		return responsePayload;
	}
}
