import {
	Controller,
	Get,
	Post,
	Body,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CompanyDetailService } from './company-detail.service';
import { CreateCompanyDetailDto } from './dto/create-company-detail.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';

@Controller('companydetail')
export class CompanyDetailController {
	constructor(private readonly companyDetailService: CompanyDetailService) {}
	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
	@Post('/')
	createCompanyDetail(@Body() createCompanyDetailDto: CreateCompanyDetailDto) {
		return this.companyDetailService.createCompanyDetail(
			createCompanyDetailDto
		);
	}
	@UseGuards(JwtAuthGuard)
	@Get()
	getAllCompanyDetail() {
		return this.companyDetailService.getAllCompanyDetail();
	}
}
