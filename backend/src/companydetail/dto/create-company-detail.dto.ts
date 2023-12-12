import { IsString, IsDateString, IsNumber, IsBoolean } from 'class-validator';
export class CreateCompanyDetailDto {
	@IsString()
	readonly departmentName: string;
	@IsString()
	readonly companyId: string;
	@IsDateString()
	readonly usageTime: Date;
	@IsNumber()
	readonly consumptionFee: number;
	@IsNumber()
	readonly consumptionAmount: number;
	@IsBoolean()
	readonly isDiscountPrice: boolean;
}
