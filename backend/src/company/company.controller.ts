import {
	Controller,
	Get,
	Post,
	Body,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

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
	@Post('/')
	createCompany(@Body() createCompanyDto: CreateCompanyDto) {
		return this.companyService.createCompany(createCompanyDto);
	}
	@UseGuards(JwtAuthGuard)
	@Get()
	getAllCompany() {
		return this.companyService.getAllCompany();
	}
}
