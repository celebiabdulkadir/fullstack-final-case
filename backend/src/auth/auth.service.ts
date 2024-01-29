import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { Logger } from '@nestjs/common';
import { Response } from 'express';
import { Inject } from '@nestjs/common';
@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		@Inject('ACCESS_TOKEN_JWT_SERVICE') private jwtAccessService: JwtService,
		@Inject('REFRESH_TOKEN_JWT_SERVICE') private jwtRefreshService: JwtService
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

		const refreshToken = this.jwtRefreshService.sign(payload, {
			expiresIn: '1w',
		});

		// Set the refresh token as an HttpOnly cookie
		response.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			sameSite: 'none', // 'strict', 'lax', or 'none'
			secure: false,
		});

		return {
			...user,
			accessToken: this.jwtAccessService.sign(payload, { expiresIn: '15m' }),
		};
	}

	async logout(response: Response) {
		// Remove the refresh token cookie
		response.clearCookie('refreshToken');

		return {
			message: 'success',
		};
	}

	async refreshToken(user: any) {
		Logger.log('user', user);
		const payload = {
			email: user?.email,
			sub: {
				email: user?.email,
			},
		};

		return {
			accessToken: this.jwtAccessService.sign(payload, { expiresIn: '15m' }),
		};
	}
}
