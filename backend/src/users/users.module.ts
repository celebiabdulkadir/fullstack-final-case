import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SearchModule } from 'src/database/elasticsearch/elasticsearch.module';

@Module({
	imports: [SearchModule],
	providers: [UsersService],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
