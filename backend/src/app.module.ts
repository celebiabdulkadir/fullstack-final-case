import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './company/company.module';
import { CompanyDetailModule } from './companydetail/company-detail.module';
import { config } from './database/postgresql/config';
@Module({
	imports: [
		TypeOrmModule.forRoot(config),
		AuthModule,
		UsersModule,
		CompanyModule,
		CompanyDetailModule,
	],
})
export class AppModule {}
