import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Logger } from '@nestjs/common';
import {
	HttpStatus,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';

@Injectable()
export class SearchService {
	constructor(private readonly elasticsearchService: ElasticsearchService) {}

	async indexUser(user: RegisterUserDto) {
		const result = await this.elasticsearchService.search({
			index: 'users',
			body: {
				query: {
					match: {
						email: {
							query: user.email,
							operator: 'and',
						},
					},
				},
			},
		});
		if (result.hits.hits.length > 0) {
			throw new ConflictException(
				`User with email ${user.email} already exists`
			);
		} else if (result.hits.hits.length === 0) {
			throw new NotFoundException(`User with email ${user.email} not found`);
		} else {
			return this.elasticsearchService.index({
				index: 'users',
				document: user,
			});
		}
	}
	async deleteAllUsers() {
		const response = await this.elasticsearchService.deleteByQuery({
			index: 'users',
			body: {
				query: {
					match_all: {},
				},
			},
		});
		Logger.log('response', response);
		return response;
	}

	async searchUsers(query: string) {
		const response = await this.elasticsearchService.search({
			index: 'users',
			body: {
				query: {
					match: {
						email: {
							query: query,
							operator: 'and',
						},
					},
				},
			},
		});

		if (response.hits.hits.length < 1) {
			throw new NotFoundException(`User with email ${query} not found`);
		} else {
			return response.hits.hits[0]._source;
		}
	}
	async getAllUsers(): Promise<any> {
		const response = await this.elasticsearchService.search({
			index: 'users',
			body: {
				query: {
					match_all: {},
				},
			},
		});
		console.log('response', response.hits.hits);
		return response.hits.hits;
	}
	async deleteUsers(querr: string): Promise<any> {
		try {
			const user = await this.elasticsearchService.search({
				index: 'users',
				body: {
					query: {
						term: { _id: querr },
					},
				},
			});
			if (user.hits.hits.length < 1) {
				throw new NotFoundException(`User with email ${querr} not found`);
			} else {
				const response = await this.elasticsearchService.deleteByQuery({
					index: 'users',
					body: {
						query: {
							term: { _id: querr },
						},
					},
				});
				return `User with id ${querr} deleted`;
			}
		} catch (error) {
			Logger.log(error);
		}
	}
}
