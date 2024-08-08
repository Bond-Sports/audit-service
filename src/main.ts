import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigKeys, configService } from './services/config.service';
import { INestApplication } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

function configureSwagger(app: INestApplication) {
	const port: number = configService.getPort();
	const version: string = configService.getVersion();

	const documentBuilder: DocumentBuilder = new DocumentBuilder()
		.setDescription('The API2 description')
		.setTitle('API2 Swagger')
		.setVersion(version)
		.addBearerAuth();

	documentBuilder.addServer(`http://localhost:${port}`, 'Local Host');
	console.info(`Added local server for Swagger on http://localhost:${port}`);

	const swaggerConfig = documentBuilder
		.addServer('https://api-v1-staging.bondsports.co/v4', 'V2 Staging')
		.addServer('https://api-v1-dev.bondsports.co/v4', 'V2 Dev')
		.build();

	const swaggerDocument: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup('api', app, swaggerDocument);
	console.info('Swagger configured successfully.');
}

async function bootstrap(): Promise<void> {
	const app: INestApplication<AppModule> = await NestFactory.create(AppModule);

	app.use(json({ limit: '50mb' }));
	app.use(urlencoded({ extended: true, limit: '50mb' }));

	configureSwagger(app);

	await app.listen(configService.getValue(ConfigKeys.PORT));
}

bootstrap();
