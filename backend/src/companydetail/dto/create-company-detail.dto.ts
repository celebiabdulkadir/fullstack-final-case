import {
	IsString,
	IsDateString,
	IsNumber,
	IsBoolean,
	IsNotEmpty,
} from 'class-validator';
export class CreateCompanyDetailDto {
	@IsNotEmpty()
	@IsString()
	readonly departmentName: string;
	@IsNotEmpty()
	@IsString()
	readonly companyId: string;
	@IsNotEmpty()
	@IsDateString()
	readonly usageTime: Date;
	@IsNotEmpty()
	@IsNumber()
	readonly consumptionFee: number;
	@IsNotEmpty()
	@IsNumber()
	readonly consumptionAmount: number;
	@IsNotEmpty()
	@IsBoolean()
	readonly isDiscountPrice: boolean;
}
