import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigKeysEnum, configService } from './config/config.service';
import { INestApplication, INestMicroservice, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { EventsModule } from './events/events.module';
import { Logger } from './config/logger';

function catchUnhandledErrors() {
	process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
		Logger.error('Unhandled Rejection at:', p, 'reason:', reason);
	});

	process.on('uncaughtException', (error: Error) => {
		Logger.error('Uncaught Exception thrown', error);
	});
}


function configureSwagger(app: INestApplication): void {
	const port: number = configService.getPort();
	const version: string = configService.getVersion();

	// Toto we are not in Kansas anymore
	// Todo - we need to move the swagger to the service naming 
	const documentBuilder: DocumentBuilder = new DocumentBuilder()
		.setDescription('The API2 description')
		.setTitle('API2 Swagger')
		.setVersion(version)
		.addBearerAuth();

	documentBuilder.addServer(`http://localhost:${port}`, 'Local Host');
	Logger.info(`Added local server for Swagger on http://localhost:${port}`);

	const swaggerConfig = documentBuilder
		.addServer('https://api-v1-staging.bondsports.co/audit-service', 'Audit service Staging')
		.addServer('https://api-v1-dev.bondsports.co/audit-service', 'Audit service Dev')
		.build();

	const swaggerDocument: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup('api', app, swaggerDocument);
	Logger.info('Swagger configured successfully.');
}

function configureApp(app: INestApplication): void {
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	app.use(json({ limit: '50mb' }));
	app.use(urlencoded({ extended: true, limit: '50mb' }));

	configureSwagger(app);
}

function configureMicroservice(microService: INestMicroservice): void {
	microService.useGlobalPipes(new ValidationPipe({ transform: true }));
}

async function bootstrap(): Promise<void> {
	catchUnhandledErrors();

	const [app, eventsService]: [INestApplication<AppModule>, INestMicroservice] = await Promise.all([
		NestFactory.create(AppModule),
		NestFactory.createMicroservice(EventsModule, configService.getMicroServiceConfiguration()),
	]);

	configureApp(app);
	configureMicroservice(eventsService);

	await configService.setupDynamodb();

	await Promise.all([
		app.listen(configService.getValue(ConfigKeysEnum.PORT), () => Logger.info('API service started')),
		eventsService.listen().then(() => Logger.info('Events service started')),
	]);
}

bootstrap();
