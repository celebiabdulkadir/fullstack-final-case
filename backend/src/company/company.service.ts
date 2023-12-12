import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
	constructor(
		@InjectRepository(Company)
		private readonly companyRepository: Repository<Company>
	) {}

	async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
		const poll = this.companyRepository.create(createCompanyDto);
		return this.companyRepository.save(poll);
	}

	async getAllCompany(): Promise<Company[]> {
		return this.companyRepository.find();
	}
	async deleteCompany(id: number): Promise<void> {
		await this.companyRepository.delete(id);
	}

	async updateCompany(updateCompanyDto: UpdateCompanyDto): Promise<Company> {
		const toUpdate = await this.companyRepository.findOne(
			updateCompanyDto.companyId as any
		);
		const updated = Object.assign(toUpdate, updateCompanyDto);
		return this.companyRepository.save(updated);
	}
}
