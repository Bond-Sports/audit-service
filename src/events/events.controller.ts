import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { ConfigKeysEnum, configService } from '../config/config.service';
import { AuditService } from '../audit/services/audit.service';
import { AuditLogDto, CreateAuditLogDto } from '../audit/types/dto/audit.dto';
import { Logger } from '../config/logger';

const PUB_SUB_CHANNEL: string = configService.getValue(ConfigKeysEnum.PUB_SUB_CHANNEL);

@Controller()
export class EventsController {
	constructor(private auditService: AuditService) {}

	@MessagePattern(PUB_SUB_CHANNEL)
	async onMessage(@Payload() data: CreateAuditLogDto, @Ctx() context: RedisContext): Promise<void> {
		const result: AuditLogDto = await this.auditService.createAuditLog(data.organizationId, data.log);
		Logger.info(`Successfully handled message, created log with ID "${result.id}"`);
	}
}
