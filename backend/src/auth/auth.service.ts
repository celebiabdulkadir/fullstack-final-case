import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { Logger } from '@nestjs/common';
import { Response } from 'express';
@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private jwtService: JwtService
	) {}

	async validateUser(newUser: LoginUserDto) {
		console.log('email', newUser.email);
		Logger.log('email', newUser.email);
		const user = await this.userService.findOne(newUser.email);
		if (user && (await bcrypt.compare(newUser.password, user.password))) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	async login(user: LoginUserDto, response: Response) {
		console.log('user', user);
		const payload = {
			email: user?.email,
			sub: {
				email: user?.email,
			},
		};

		const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });

		// Set the refresh token as an HttpOnly cookie
		response.cookie('refreshToken', refreshToken, { httpOnly: true });

		return {
			...user,
			accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
		};
	}

	async refreshToken(user: any) {
		const payload = {
			email: user.email,
			sub: {
				name: user.name,
			},
		};

		return {
			accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
		};
	}
}
