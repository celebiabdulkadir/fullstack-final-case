import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './elasticsearch.service';

@Module({
	imports: [
		ElasticsearchModule.register({
			node: process.env.ELASTIC_SEARCH_NODE,
			auth: {
				username: process.env.ELASTIC_SEARCH_USERNAME,
				password: process.env.ELASTIC_SEARCH_PASSWORD,
			},
		}),
	],
	providers: [SearchService],
	exports: [SearchService, SearchModule],
})
export class SearchModule {}
