import * as fs from 'fs';
import * as path from 'path';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import * as dynamoose from 'dynamoose';
import { Logger } from './logger';
import { Transport } from '@nestjs/microservices';

require('dotenv').config();

export enum ConfigKeysEnum {
	PORT = 'PORT',
	DYNAMO_DB_HOST = 'DYNAMO_DB_HOST',
	DYNAMO_DB_PORT = 'DYNAMO_DB_PORT',
	DYNAMO_DB_USERNAME = 'DYNAMO_DB_USERNAME',
	DYNAMO_DB_PASSWORD = 'DYNAMO_DB_PASSWORD',
	DYNAMO_DB_NAME = 'DYNAMO_DB_NAME',
	DYNAMO_DB_REGION = 'DYNAMO_DB_REGION',
	PUB_SUB_CHANNEL = 'PUB_SUB_CHANNEL',
	REDIS_HOST = 'REDIS_HOST',
	REDIS_PORT = 'REDIS_PORT',
	NODE_ENV = 'NODE_ENV',
	MONGODB_DATABASE_URL = 'MONGO_DATABASE_URL',
	MONGODB_DATABASE_PORT = 'MONGO_DATABASE_PORT',
	MONGODB_DATABASE_USER = 'MONGO_DATABASE_USER',
	MONGODB_DATABASE_PASSWORD = 'MONGO_DATABASE_PASSWORD',
	PUB_SUB_TRANSPORT = 'PUB_SUB_TRANSPORT',
	KAFKA_URL = 'KAFKA_URL',
}

enum PubSubBrokerEnum {
	REDIS = 'REDIS',
	KAFKA = 'KAFKA',
	RMQ = 'RMQ',
	SQS = 'SQS',
}

type Env = { [key in ConfigKeysEnum]: string } & Record<string, string>;

const { version, name } = JSON.parse(fs.readFileSync(path.resolve(__filename, '../../../', 'package.json')).toString());

class ConfigService {
	constructor(private env: Env) {}

	public getValue(key: string, trowOnMissing = true): string {
		const value: string = this.env[key];

		if (!value && trowOnMissing) {
			throw new Error(`config error - missing env.${key}`);
		}

		return value;
	}

	public ensureValues(keys: string[]): boolean {
		return keys.every(key => this.getValue(key, true));
	}

	public getPort(): number {
		return Number(this.getValue(ConfigKeysEnum.PORT));
	}

	public getVersion(): string {
		return version;
	}

	public async setupDynamodb(): Promise<void> {
		const host: string = this.getValue(ConfigKeysEnum.DYNAMO_DB_HOST);
		const port: string = this.getValue(ConfigKeysEnum.DYNAMO_DB_PORT);

		const database: DynamoDB = new dynamoose.aws.ddb.DynamoDB({
			endpoint: `${host}:${port}`,
			region: !this.isLocalEnvironment() ? this.getValue(ConfigKeysEnum.DYNAMO_DB_REGION) : undefined,
		});

		dynamoose.aws.ddb.set(database);

		Logger.info(`Successfully connected to DynamoDB "${host}" on port "${port}"`);
	}

	public isLocalEnvironment(): boolean {
		const nodeEnv: string = this.getValue(ConfigKeysEnum.NODE_ENV, false);
		return !nodeEnv || nodeEnv === 'development';
	}

	public getMongoUrl(): string {
		const url: string = this.getValue(ConfigKeysEnum.MONGODB_DATABASE_URL);
		const port: string = this.getValue(ConfigKeysEnum.MONGODB_DATABASE_PORT);

		const password: string = this.getValue(ConfigKeysEnum.MONGODB_DATABASE_PASSWORD, false);
		const user: string = this.getValue(ConfigKeysEnum.MONGODB_DATABASE_USER, false);

		if (!password && !user) {
			return `${url}:${port}`;
		}

		if (!user || !password) {
			throw new Error('MongoDB user and password must be provided');
		}

		const [protocol, host] = url.split('://');

		return `${protocol}://${user}:${password}@${host}:${port}`;
	}

	private getRedisConfiguration() {
		return {
			transport: Transport.REDIS,
			options: {
				host: this.getValue(ConfigKeysEnum.REDIS_HOST),
				port: this.getValue(ConfigKeysEnum.REDIS_PORT),
			},
		};
	}

	private getKafkaConfiguration() {
		return {
			transport: Transport.KAFKA,
			options: {
				consumer: { groupId: 'test' },
				broker: [this.getValue(ConfigKeysEnum.KAFKA_URL)],
				subscribe: { topics: [this.getValue(ConfigKeysEnum.PUB_SUB_CHANNEL)] },
			},
		};
	}

	private getRabbitMQConfiguration() {
		return {
			transport: Transport.RMQ,
			options: {},
		};
	}

	public getMicroServiceConfiguration(): { transport: Transport; options: any } {
		const broker: string = String(this.getValue(ConfigKeysEnum.PUB_SUB_TRANSPORT)).toUpperCase();
		switch (broker) {
			case PubSubBrokerEnum.REDIS:
				return this.getRedisConfiguration();
			case PubSubBrokerEnum.KAFKA:
				return this.getKafkaConfiguration();
			case PubSubBrokerEnum.RMQ:
				return this.getRabbitMQConfiguration();
			default:
				throw new Error(`Unknown broker type: ${broker}`);
		}
	}
}

export const configService: ConfigService = new ConfigService(process.env as Env);
configService.ensureValues([
	ConfigKeysEnum.PORT,
	ConfigKeysEnum.DYNAMO_DB_HOST,
	ConfigKeysEnum.DYNAMO_DB_PORT,
	ConfigKeysEnum.PUB_SUB_CHANNEL,
	ConfigKeysEnum.REDIS_PORT,
	ConfigKeysEnum.REDIS_HOST,
	ConfigKeysEnum.MONGODB_DATABASE_URL,
	ConfigKeysEnum.MONGODB_DATABASE_PORT,
	ConfigKeysEnum.PUB_SUB_TRANSPORT,
]);
