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
	url: `${process.env.POSTGRES_URL}`,
	entities: [Company, CompanyDetail],
	synchronize: true,
};
