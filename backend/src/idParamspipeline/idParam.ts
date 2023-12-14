import { IsNotEmpty, IsString } from 'class-validator';

export class IdParam {
	@IsNotEmpty()
	@IsString()
	readonly id: string;
}
