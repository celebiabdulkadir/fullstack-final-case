import './load-env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TypeOrmExceptionFilter } from './filters/typeorm-exception.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useLogger(new Logger('debug'));
	app.enableCors({
		origin: ['http://localhost:5000', 'http://localhost:3000'],
		credentials: true,
	});
	app.use(cookieParser());

	app.useGlobalFilters(new TypeOrmExceptionFilter());
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		})
	);

	await app.listen(3000);
}

bootstrap();
