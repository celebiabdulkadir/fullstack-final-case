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
	UseFilters,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Update } from '@reduxjs/toolkit';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { TypeOrmExceptionFilter } from 'src/filters/typeorm-exception.filter';
import { IdParam } from 'src/idParamspipeline/idParam';
@UseGuards(JwtAuthGuard)
@Controller('company')
export class CompanyController {
	constructor(private readonly companyService: CompanyService) {}

	@Post()
	createCompany(@Body() createCompanyDto: CreateCompanyDto) {
		return this.companyService.createCompany(createCompanyDto);
	}

	@Put()
	updateCompany(@Body() UpdateCompanyDto: UpdateCompanyDto) {
		return this.companyService.updateCompany(UpdateCompanyDto);
	}

	@Get('all')
	getAllCompany() {
		return this.companyService.getAllCompany();
	}

	@Get(':id')
	getCompanyById(@Param() params: IdParam) {
		return this.companyService.getCompanyById(params.id);
	}

	@Delete(':id')
	deleteCompanyById(@Param() params: IdParam) {
		return this.companyService.deleteCompany(params.id);
	}
}
