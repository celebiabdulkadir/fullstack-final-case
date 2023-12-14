import {
	Controller,
	Get,
	Post,
	Body,
	UsePipes,
	ValidationPipe,
	Param,
	Delete,
	Put,
} from '@nestjs/common';
import { CompanyDetailService } from './company-detail.service';
import { CreateCompanyDetailDto } from './dto/create-company-detail.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UpdateCompanyDetailDto } from './dto/update-company-detail.dto';
import { IdParam } from 'src/idParamspipeline/idParam';

@Controller('companydetail')
export class CompanyDetailController {
	constructor(private readonly companyDetailService: CompanyDetailService) {}
	@UseGuards(JwtAuthGuard)
	@UsePipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		})
	)
	@Post()
	createCompanyDetail(@Body() createCompanyDetailDto: CreateCompanyDetailDto) {
		return this.companyDetailService.createCompanyDetail(
			createCompanyDetailDto
		);
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		})
	)
	@Put()
	updateCompanyDetail(@Body() UpdateCompanyDetailDto: UpdateCompanyDetailDto) {
		return this.companyDetailService.updateCompanyDetail(
			UpdateCompanyDetailDto
		);
	}

	@UseGuards(JwtAuthGuard)
	@Get('all')
	getAllCompanyDetail() {
		return this.companyDetailService.getAllCompanyDetail();
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	getCompanyDetailById(@Param() params: IdParam) {
		return this.companyDetailService.getCompanyDetailById(params.id);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	deleteCompanyDetailById(@Param() params: IdParam) {
		return this.companyDetailService.deleteCompanyDetail(params.id);
	}
}
