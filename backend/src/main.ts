import './load-env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useLogger(new Logger('debug'));
	app.use(cookieParser());
	await app.listen(3000);
}

bootstrap();
