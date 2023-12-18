import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { SearchService } from 'src/database/elasticsearch/elasticsearch.service';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
	constructor(private searchService: SearchService) {}

	async findOne(email: string): Promise<User | undefined> {
		return await this.searchService.searchUsers(email);
	}
	async getAllUsers() {
		try {
			return await this.searchService.getAllUsers();
		} catch (error) {
			Logger.error(error);
		}
	}

	async create(user: RegisterUserDto) {
		const hashedPassword = await bcrypt.hash(user.password, 10);
		const userWithHashedPassword = { ...user, password: hashedPassword };

		try {
			return await this.searchService.indexUser(userWithHashedPassword);
		} catch (error) {
			Logger.error(error);
		}
	}
	async deleteUsers(query: string) {
		try {
			return await this.searchService.deleteUsers(query);
		} catch (error) {
			Logger.error(error);
		}
	}
	async deleteAllUsers() {
		try {
			return await this.searchService.deleteAllUsers();
		} catch (error) {
			Logger.error(error);
			throw new Error(error);
		}
	}
}
