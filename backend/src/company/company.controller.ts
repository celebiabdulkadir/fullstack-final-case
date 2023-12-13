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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Update } from '@reduxjs/toolkit';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
	constructor(private readonly companyService: CompanyService) {}
	@UseGuards(JwtAuthGuard)
	@UsePipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		})
	)
	@Post()
	createCompany(@Body() createCompanyDto: CreateCompanyDto) {
		return this.companyService.createCompany(createCompanyDto);
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
	updateCompany(@Body() UpdateCompanyDto: UpdateCompanyDto) {
		return this.companyService.updateCompany(UpdateCompanyDto);
	}

	@UseGuards(JwtAuthGuard)
	@Get('all')
	getAllCompany() {
		return this.companyService.getAllCompany();
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	getCompanyById(@Param('id') id: string) {
		return this.companyService.getCompanyById(id.toString());
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	deleteCompanyById(@Param('id') id: string) {
		return this.companyService.deleteCompany(id.toString());
	}
}
