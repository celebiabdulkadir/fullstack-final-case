import {
	IsString,
	IsDateString,
	IsNumber,
	IsBoolean,
	IsNotEmpty,
} from 'class-validator';
export class CreateCompanyDto {
	@IsNotEmpty()
	@IsString()
	readonly companyName: string;
	@IsNotEmpty()
	@IsDateString()
	readonly subscriptionStart: Date;
	@IsNotEmpty()
	@IsDateString()
	readonly subscriptionEnd: Date;
	@IsNotEmpty()
	@IsNumber()
	readonly employerNumber: number;
	@IsNotEmpty()
	@IsBoolean()
	readonly isFree: boolean;
}
