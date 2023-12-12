import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyDetailController } from './company-detail.controller';
import { CompanyDetailService } from './company-detail.service';
import { CompanyDetail } from 'src/entities/companydetail.entity';
import { CompanyModule } from 'src/company/company.module';

@Module({
	imports: [TypeOrmModule.forFeature([CompanyDetail]), CompanyModule],
	controllers: [CompanyDetailController],
	providers: [CompanyDetailService],
})
export class CompanyDetailModule {}
