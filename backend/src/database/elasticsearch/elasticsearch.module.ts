import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './elasticsearch.service';

@Module({
	imports: [
		ElasticsearchModule.register({
			node: 'https://my-deployment-818398.es.us-central1.gcp.cloud.es.io',
			auth: {
				username: 'elastic',
				password: 'TN5iMUf7RiNKC8hNVyddGxVW',
			},
		}),
	],
	providers: [SearchService],
	exports: [SearchService, SearchModule],
})
export class SearchModule {}
