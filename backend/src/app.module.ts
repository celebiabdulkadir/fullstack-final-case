import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompanyDetail } from './entities/companydetail.entity';
import { CompanyModule } from './company/company.module';
import { CompanyDetailModule } from './companydetail/company-detail.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			url: 'postgres://tywdifrw:d3ZJbXFAvB6gM126AZUEdwltNib6Dzi2@flora.db.elephantsql.com/tywdifrw',
			// host: 'localhost',
			// port: 5432,
			// username: 'user',
			// password: 'password',
			// database: 'db',

			entities: [Company, CompanyDetail],
			synchronize: true,
		}),
		AuthModule,
		UsersModule,
		CompanyModule,
		CompanyDetailModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
