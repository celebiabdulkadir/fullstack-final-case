import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Logger } from '@nestjs/common';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'email',
			passwordField: 'password',
		});
	}
	async validate(email: string, password: string): Promise<any> {
		Logger.log('email', email);
		const newUser: LoginUserDto = {
			email: email,
			password: password,
		};
		console.log('email', newUser.email);
		Logger.log('email', newUser.email);
		const user = await this.authService.validateUser(newUser);
		if (!user) {
			throw new UnauthorizedException({ message: 'Invalid credentials' });
		}
		return user;
	}
}
