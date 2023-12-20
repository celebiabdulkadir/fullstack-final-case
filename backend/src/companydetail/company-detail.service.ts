import {
	Injectable,
	Logger,
	HttpStatus,
	NotFoundException,
} from '@nestjs/common';
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
		try {
			return this.companyDetailRepository.find();
		} catch (error) {
			throw new Error(error);
		}
	}
	async deleteCompanyDetail(id: string): Promise<void> {
		try {
			await this.companyDetailRepository.delete(id);
		} catch (error) {
			if (error.code === '22P02') {
				throw new NotFoundException(error);
			} else {
				throw new Error(error);
			}
		}
	}
	async getCompanyDetailById(companyDetailId: string): Promise<CompanyDetail> {
		if (!companyDetailId) {
			throw new Error('companyDetailId is not provided');
		}
		try {
			const found = await this.companyDetailRepository.findOneBy({
				companyDetailId: companyDetailId,
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
	async updateCompanyDetail(
		updateCompanyDetailDto: UpdateCompanyDetailDto
	): Promise<CompanyDetail> {
		const toUpdate = await this.getCompanyDetailById(
			updateCompanyDetailDto.companyDetailId
		);
		try {
			const updated = Object.assign(toUpdate, updateCompanyDetailDto);
			return this.companyDetailRepository.save(updated);
		} catch (error) {
			Logger.error(error);
			return error;
		}
	}
	async getCompanyDetailByCompanyId(companyId: string) {
		try {
			const response = await this.companyDetailRepository
				.createQueryBuilder('companyDetail')
				.innerJoinAndSelect(
					'companyDetail.company',
					'company',
					'companyDetail.companyId = :companyId',
					{ companyId }
				)
				.getMany();
			return response;
		} catch (error) {
			throw new Error(error);
		}
	}
}
