import { IsString, IsDate, IsNumber, IsBoolean } from 'class-validator';
import { CreateCompanyDetailDto } from './create-company-detail.dto';
export class UpdateCompanyDetailDto extends CreateCompanyDetailDto {
	@IsNumber()
	readonly companyDetailId: string;

	constructor(companyDetailId: string) {
		super();
		this.companyDetailId = companyDetailId;
	}
}
