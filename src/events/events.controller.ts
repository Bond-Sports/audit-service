import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { ConfigKeysEnum, configService } from '../config/config.service';
import { AuditService } from '../audit/services/audit.service';
import { AuditLogDto, CreateAuditLogEventDto } from '../audit/types/dto/audit.dto';
import { Logger } from '../config/logger';

const PUB_SUB_CHANNEL: string = configService.getValue(ConfigKeysEnum.PUB_SUB_CHANNEL);

@Controller()
export class EventsController {
	constructor(private auditService: AuditService) {}

	@MessagePattern(PUB_SUB_CHANNEL)
	async onMessage(@Payload() data: CreateAuditLogEventDto, @Ctx() context: RedisContext): Promise<void> {
		try {
			Logger.info(
				`EventsController channel "${PUB_SUB_CHANNEL}" - Received message for organization "${data.organizationId}",`,
				JSON.stringify(data.log)
			);

			const result: AuditLogDto = await this.auditService.createAuditLog(data.organizationId, data.log);
			Logger.info(
				`EventsController channel "${PUB_SUB_CHANNEL}" - Successfully handled message, created log with ID "${result.id}"`
			);
		} catch (error) {
			Logger.error(`EventsController channel "${PUB_SUB_CHANNEL}" - Error handling message`, error);
		}
	}
}
