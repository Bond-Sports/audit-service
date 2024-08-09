import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigKeysEnum, configService } from './config/config.service';
import { INestApplication, INestMicroservice } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { EventsModule } from './events/events.module';
import { Logger } from './config/logger';

function configureSwagger(app: INestApplication): void {
	const port: number = configService.getPort();
	const version: string = configService.getVersion();

	const documentBuilder: DocumentBuilder = new DocumentBuilder()
		.setDescription('The API2 description')
		.setTitle('API2 Swagger')
		.setVersion(version)
		.addBearerAuth();

	documentBuilder.addServer(`http://localhost:${port}`, 'Local Host');
	Logger.info(`Added local server for Swagger on http://localhost:${port}`);

	const swaggerConfig = documentBuilder
		.addServer('https://api-v1-staging.bondsports.co/v4', 'V2 Staging')
		.addServer('https://api-v1-dev.bondsports.co/v4', 'V2 Dev')
		.build();

	const swaggerDocument: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup('api', app, swaggerDocument);
	Logger.info('Swagger configured successfully.');
}

async function bootstrap(): Promise<void> {
	const [app, eventsService]: [INestApplication<AppModule>, INestMicroservice] = await Promise.all([
		NestFactory.create(AppModule),
		NestFactory.createMicroservice(EventsModule, configService.getRedisConfiguration()),
	]);

	app.use(json({ limit: '50mb' }));
	app.use(urlencoded({ extended: true, limit: '50mb' }));

	configureSwagger(app);

	await configService.setupDynamodb();

	await Promise.all([
		app.listen(configService.getValue(ConfigKeysEnum.PORT), () => Logger.info('API service started')),
		eventsService.listen().then(() => Logger.info('Events service started')),
	]);
}

bootstrap();
