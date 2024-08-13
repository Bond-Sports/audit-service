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
	// Todo - add operationId to the @ApiOperation decorator
	@ApiOperation({
		summary: 'Get Health',
		description: 'Retrieve health information including the service version and health status.',
	})
	// Todo - instead of returning any, consider returning a HealthCheckResponseDto object
	// exmple of 
	/*
	interface HealthCheckResponse {
		version: string;
		serviceHealth: HealthCheckResponseDto;
	}
	*/
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
			// Todo - Using BadRequestException might not be the most appropriate way to indicate an unhealthy service state. 
			// Typically, a 500 (Internal Server Error) or 503 (Service Unavailable) HTTP status code would be more appropriate for signaling that the service is unhealthy.
			// for example, we can add a logger here to log the error
			//  throw new ServiceUnavailableException(responsePayload);
			throw new BadRequestException(JSON.stringify(responsePayload));
		}

		return responsePayload;
	}
}
