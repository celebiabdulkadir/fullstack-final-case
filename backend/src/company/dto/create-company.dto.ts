import { IsString, IsDateString, IsNumber, IsBoolean } from 'class-validator';
export class CreateCompanyDto {
	@IsString()
	readonly companyName: string;
	@IsDateString()
	readonly subscriptionStart: Date;
	@IsDateString()
	readonly subscriptionEnd: Date;
	@IsNumber()
	readonly employerNumber: number;
	@IsBoolean()
	readonly isFree: boolean;
}
