import * as fs from 'fs';
import * as path from 'path';

require('dotenv').config();

export enum ConfigKeys {
	PORT = 'PORT',
	DB_HOST = 'DB_HOST',
	DB_PORT = 'DB_PORT',
	DB_USERNAME = 'DB_USERNAME',
	DB_PASSWORD = 'DB_PASSWORD',
	DB_NAME = 'DB_NAME',
	PUB_SUB_CHANNEL = 'PUB_SUB_CHANNEL',
	REDIS_WRITER_URL = 'REDIS_WRITER_URL',
}

const { version, name } = JSON.parse(fs.readFileSync(path.resolve(__filename, '../../../', 'package.json')).toString());

class ConfigService {
	constructor(private env: Record<string, string>) {}

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
		return Number(this.getValue(ConfigKeys.PORT));
	}

	public getVersion(): string {
		return version;
	}
}

export const configService: ConfigService = new ConfigService(process.env);
configService.ensureValues([
	ConfigKeys.PORT,
	// ConfigKeys.DB_HOST,
	// ConfigKeys.DB_PORT,
	// ConfigKeys.DB_USERNAME,
	// ConfigKeys.DB_PASSWORD,
	// ConfigKeys.DB_NAME,
	ConfigKeys.PUB_SUB_CHANNEL,
	ConfigKeys.REDIS_WRITER_URL,
]);
