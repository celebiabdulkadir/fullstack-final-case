import { type } from 'os';
import { Company } from 'src/entities/company.entity';
import { CompanyDetail } from 'src/entities/companydetail.entity';

type Config = {
	type: 'postgres';
	url: string;
	entities: Function[];
	synchronize: boolean;
};
export const config: Config = {
	type: 'postgres',
	url: 'postgres://tywdifrw:d3ZJbXFAvB6gM126AZUEdwltNib6Dzi2@flora.db.elephantsql.com/tywdifrw',
	entities: [Company, CompanyDetail],
	synchronize: true,
};
