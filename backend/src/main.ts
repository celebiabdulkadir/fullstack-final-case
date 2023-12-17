import './load-env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TypeOrmExceptionFilter } from './filters/typeorm-exception.filter';
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useLogger(new Logger('debug'));
	app.use(cookieParser());
	app.useGlobalFilters(new TypeOrmExceptionFilter());
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		})
	);
	app.enableCors();
	await app.listen(3000);
}

bootstrap();
