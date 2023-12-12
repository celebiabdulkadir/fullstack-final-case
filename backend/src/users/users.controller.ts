import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
	Logger,
	Delete,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UsersController {
	constructor(private readonly userService: UsersService) {}
	@UseGuards(JwtAuthGuard)
	@Get('all')
	getAllUsers() {
		return this.userService.getAllUsers();
	}
	@UseGuards(JwtAuthGuard)
	@Delete('all')
	deleteAllUsers() {
		return this.userService.deleteAllUsers();
	}
	@UseGuards(JwtAuthGuard)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(id.toString());
	}
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	deleteUser(@Param('id') id: string) {
		return this.userService.deleteUsers(id.toString());
	}
}
