import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { HttpStatus } from '@nestjs/common';

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
	async deleteCompany(id: string): Promise<void> {
		const foundId = await this.getCompanyById(id);

		if (!foundId) {
			throw new Error('companyId is not provided');
		}
		await this.companyRepository.delete(id);
	}

	async updateCompany(updateCompanyDto: UpdateCompanyDto): Promise<Company> {
		Logger.log(updateCompanyDto.companyId);
		if (!updateCompanyDto.companyId) {
			throw new Error('companyId is not provided');
		}

		const toUpdate = await this.companyRepository.findOneBy({
			companyId: updateCompanyDto.companyId,
		});

		const updated = Object.assign(toUpdate, updateCompanyDto);
		return this.companyRepository.save(updated);
	}

	async getCompanyById(companyId: string): Promise<Company> {
		Logger.log(companyId);
		if (!companyId) {
			throw new Error('companyId is not provided');
		}

		try {
			const found = await this.companyRepository.findOneBy({
				companyId: companyId,
			});

			if (!found) {
				throw new NotFoundException(HttpStatus.NOT_FOUND);
			}

			return found;
		} catch (error) {
			throw new Error('server error');
		}
	}
}
