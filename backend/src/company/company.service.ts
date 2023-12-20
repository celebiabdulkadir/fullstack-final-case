import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
		try {
			const company = this.companyRepository.create(createCompanyDto);
			return this.companyRepository.save(company);
		} catch (error) {
			throw new Error(error);
		}
	}

	async getAllCompany(): Promise<Company[]> {
		try {
			return await this.companyRepository.find();
		} catch (error) {
			throw new Error(error);
			Logger.error(error);
		}
	}
	async deleteCompany(id: string) {
		try {
			const found = await this.getCompanyById(id);
			if (!found)
				throw new NotFoundException(`Company with id ${id} not found`);
			const deletedCompany = await this.companyRepository.delete(id);
			return deletedCompany;
		} catch (error) {
			if (error.code === '22P02') {
				throw new NotFoundException(error);
			} else if (error.status === 404) {
				throw new NotFoundException(error);
			} else {
				throw new Error(error);
			}
		}
	}
	async getCompanyById(companyId: string): Promise<Company> {
		if (!companyId) {
			throw new Error('companyId is not provided');
		}

		try {
			const found = await this.companyRepository.findOneBy({
				companyId: companyId,
			});
			return found;
		} catch (error) {
			if (error.code === '22P02') {
				throw new NotFoundException(error);
			} else {
				throw new Error(error);
			}
		}
	}
	async updateCompany(updateCompanyDto: UpdateCompanyDto): Promise<Company> {
		const toUpdate = await this.getCompanyById(updateCompanyDto.companyId);
		try {
			const updated = Object.assign(toUpdate, updateCompanyDto);
			return this.companyRepository.save(updated);
		} catch (error) {
			Logger.error(error);
			throw new Error(error);
		}
	}
}
