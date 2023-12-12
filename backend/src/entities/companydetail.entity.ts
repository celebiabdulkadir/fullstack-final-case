import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	OneToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
	JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity()
@Unique(['departmentName', 'companyId'])
export class CompanyDetail {
	@PrimaryGeneratedColumn('uuid')
	companyDetailId: string;

	@Column({ nullable: false })
	departmentName: string;
	@Column({ nullable: false })
	usageTime: Date;
	@Column({ nullable: false })
	consumptionFee: number;
	@Column({ nullable: false })
	consumptionAmount: number;
	@Column({ nullable: false })
	isDiscountPrice: boolean;
	@ManyToOne(() => Company, (company) => company.companyDetails)
	@JoinColumn({ name: 'companyId' }) // This line is added
	company: Company;
	@Column({ nullable: false }) // This line is added
	companyId: string;
}
