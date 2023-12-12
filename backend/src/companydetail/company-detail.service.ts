import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyDetail } from 'src/entities/companydetail.entity';
import { CreateCompanyDetailDto } from './dto/create-company-detail.dto';
import { UpdateCompanyDetailDto } from './dto/update-company-detail.dto';
import { Company } from 'src/entities/company.entity';

@Injectable()
export class CompanyDetailService {
	constructor(
		@InjectRepository(CompanyDetail)
		private readonly companyDetailRepository: Repository<CompanyDetail>,
		@InjectRepository(Company)
		private readonly companyRepository: Repository<Company>
	) {}

	async createCompanyDetail(
		createCompanyDto: CreateCompanyDetailDto
	): Promise<CompanyDetail> {
		if (!createCompanyDto.companyId) {
			throw new Error('Company ID is not defined');
		}
		Logger.log(createCompanyDto.companyId);
		const company = await this.companyRepository.findOneBy({
			companyId: createCompanyDto.companyId,
		});

		if (!company) {
			throw new Error('Company not found');
		}

		try {
			const companyDetail =
				this.companyDetailRepository.create(createCompanyDto);
			companyDetail.company = company;

			return this.companyDetailRepository.save(companyDetail);
		} catch (error) {
			throw new Error(error);
		}
	}

	async getAllCompanyDetail(): Promise<CompanyDetail[]> {
		return this.companyDetailRepository.find();
	}
	async deleteCompany(id: number): Promise<void> {
		await this.companyDetailRepository.delete(id);
	}

	async updateCompanyDetail(
		updateCompanyDetailDto: UpdateCompanyDetailDto
	): Promise<CompanyDetail> {
		const toUpdate = await this.companyDetailRepository.findOne(
			updateCompanyDetailDto.companyDetailId as any
		);
		const updated = Object.assign(toUpdate, updateCompanyDetailDto);
		return this.companyDetailRepository.save(updated);
	}
}
