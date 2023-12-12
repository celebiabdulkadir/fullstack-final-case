import { IsString, IsDate, IsNumber, IsBoolean } from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';
export class UpdateCompanyDto extends CreateCompanyDto {
	@IsString()
	readonly companyId: string;

	constructor(companyId: string) {
		super();
		this.companyId = companyId;
	}
}
