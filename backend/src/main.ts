import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useLogger(new Logger('debug'));
	app.use(cookieParser());
	const now = new Date();
	const nowISOString = now.toISOString();
	Logger.log(nowISOString);
	await app.listen(3000);
}
bootstrap();
