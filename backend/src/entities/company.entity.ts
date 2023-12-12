import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyDetail } from './companydetail.entity';

@Entity()
export class Company {
	@PrimaryGeneratedColumn('uuid')
	companyId: string;
	@Column({ unique: true, nullable: false })
	companyName: string;
	@Column({ nullable: false })
	subscriptionStart: Date;
	@Column({ nullable: false })
	subscriptionEnd: Date;
	@Column({ nullable: false })
	employerNumber: number;
	@Column({ nullable: false })
	isFree: boolean;
	@OneToMany(() => CompanyDetail, (companyDetail) => companyDetail.company)
	companyDetails: CompanyDetail[];
}
