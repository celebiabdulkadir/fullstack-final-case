import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class LoginUserDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, {
		message:
			'Password must contain at least 8 characters, 1 numeric character, and 1 uppercase character',
	})
	password: string;
}
