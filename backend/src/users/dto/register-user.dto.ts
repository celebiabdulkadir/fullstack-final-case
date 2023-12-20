import {
	IsString,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	Matches,
	Length,
} from 'class-validator';

enum UserRole {
	ADMIN = 'admin',
	EDITOR = 'editor',
}

export class RegisterUserDto {
	readonly id?: string;

	@IsNotEmpty()
	@IsString()
	@Length(8)
	@Matches(/^[a-zA-Z\s]*$/, {
		message: 'Name should only contain alphabetic characters and spaces',
	})
	readonly name: string;

	@IsNotEmpty()
	@IsString()
	readonly surname: string;

	@IsString()
	@IsNotEmpty()
	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, {
		message:
			'Password must contain at least 8 characters, 1 numeric character, and 1 uppercase character',
	})
	readonly password: string;

	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@IsNotEmpty()
	@IsEnum(UserRole)
	readonly role: UserRole;
}
