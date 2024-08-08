import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuditLogDal } from './dal/audit-log.dal';
import { CategoryDal } from './dal/category.dal';
import { SubCategoryDal } from './dal/sub-category.dal';
import { ActionTypeDal } from './dal/action-type.dal';
import { AuditController } from './audit.controller';
import { PUB_SUB, REDIS_CLIENT } from './types/constants';
import { ConfigKeysEnum, configService } from './services/config.service';
import { createClient, RedisClientOptions } from '@redis/client';
import { RedisPubSubService } from './services/redis-pub-sub.service';
import { AuditService } from './services/audit.service';
import { HealthcheckService } from './services/health-check.service';

@Module({
	imports: [],
	controllers: [AppController, AuditController],
	providers: [
		AuditLogDal,
		CategoryDal,
		SubCategoryDal,
		ActionTypeDal,
		AuditService,
		HealthcheckService,
		{
			provide: REDIS_CLIENT,
			useFactory: async () => {
				const url: string = configService.getValue(ConfigKeysEnum.REDIS_WRITER_URL);
				const redisConnectionOptions: RedisClientOptions = {
					url,
					socket: {
						tls: false,
					},
				};

				const connection = createClient(redisConnectionOptions);
				return await connection.connect();
			},
		},
		{ provide: PUB_SUB, useClass: RedisPubSubService },
	],
})
export class AppModule {}
