import { IAuditLog, IPubSub } from '../types/interfaces';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REDIS_CLIENT } from '../types/constants';
import { RedisClientType } from '@redis/client';
import { ConfigKeysEnum, configService } from './config.service';
import { AuditService } from './audit.service';
import { plainToInstance } from 'class-transformer';
import { AuditLog } from '../models/audit-log';
import { Logger } from '../logger';

@Injectable({ scope: Scope.DEFAULT })
export class RedisPubSubService implements IPubSub<IAuditLog> {
	private readonly channel: string = configService.getValue(ConfigKeysEnum.PUB_SUB_CHANNEL);

	constructor(
		@Inject(REDIS_CLIENT) private redisClient: RedisClientType,
		private auditService: AuditService
	) {}

	async onApplicationShutdown(signal?: string): Promise<void> {
		await this.redisClient.unsubscribe(this.channel);
		await this.redisClient.quit();
	}

	async onApplicationBootstrap() {
		await this.redisClient.subscribe(this.channel, this.onMessageHandler.bind(this));

		Logger.info(` RedisPubSubService - Subscribed to channel "${this.channel}"`);
	}

	/**
	 * Handles incoming messages from the Redis Pub/Sub channel
	 * @param message {string} - The message received from the Redis Pub/Sub channel
	 * @private
	 */
	private async onMessageHandler(message: string): Promise<void> {
		try {
			Logger.info(` RedisPubSubService - Received message: ${message}`);

			const data: AuditLog = plainToInstance(AuditLog, JSON.parse(message));

			const audit: AuditLog = await this.auditService.createAuditLog(data);

			Logger.info(` RedisPubSubService - successfully saved audit log with ID "${audit.id}"`);
		} catch (error) {
			Logger.error(` RedisPubSubService - Error processing message: ${message}`, error);
		}
	}

	/**
	 * Publishes a message to the Redis Pub/Sub channel
	 * @param message {object} - The message to publish to the Redis Pub/Sub channel
	 */
	async publish(message: object): Promise<void> {
		await this.redisClient.publish(this.channel, JSON.stringify(message));
	}
}
