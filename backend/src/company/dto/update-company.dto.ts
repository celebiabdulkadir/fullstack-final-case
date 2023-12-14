import {
	IsString,
	IsDate,
	IsNumber,
	IsBoolean,
	IsNotEmpty,
} from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';
export class UpdateCompanyDto extends CreateCompanyDto {
	@IsNotEmpty()
	@IsString()
	readonly companyId: string;

	constructor(companyId: string) {
		super();
		this.companyId = companyId;
	}
}
