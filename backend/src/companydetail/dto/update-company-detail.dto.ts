import { IsString, IsNotEmpty } from 'class-validator';
import { CreateCompanyDetailDto } from './create-company-detail.dto';
export class UpdateCompanyDetailDto extends CreateCompanyDetailDto {
	@IsNotEmpty()
	@IsString()
	readonly companyDetailId: string;

	constructor(companyDetailId: string) {
		super();
		this.companyDetailId = companyDetailId;
	}
}
