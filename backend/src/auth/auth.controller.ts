import {
	Body,
	Controller,
	Post,
	Get,
	Request,
	UseGuards,
} from '@nestjs/common';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
import { ValidationPipe } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private usersService: UsersService
	) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return this.authService.login(req.user, req.res);
	}

	@Post('register')
	async registerUser(
		@Body(new ValidationPipe()) createUserDto: RegisterUserDto
	) {
		return await this.usersService.create(createUserDto);
	}
	@UseGuards(JwtAuthGuard)
	@Get('getuser/:email')
	async getUser(@Request() req) {
		return await this.usersService.findOne(req.params.email);
	}

	@UseGuards(RefreshJwtGuard)
	@Post('refresh')
	async refreshToken(@Request() req) {
		return this.authService.refreshToken(req.user);
	}
}
