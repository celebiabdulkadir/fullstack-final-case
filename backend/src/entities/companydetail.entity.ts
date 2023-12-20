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

	@Column('jsonb')
	usagePeriod: { startTime: Date; endTime: Date };
	@Column({ nullable: false })
	consumptionFee: number;
	@Column({ nullable: false })
	consumptionAmount: number;
	@Column({ nullable: false })
	isDiscountPrice: boolean;
	@ManyToOne(() => Company, (company) => company.companyDetails, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'companyId' }) // This line is added
	company: Company;
	@Column({ nullable: false }) // This line is added
	companyId: string;

	// Temporary properties, not stored in the database
	startTime: Date;
	endTime: Date;

	@BeforeInsert()
	@BeforeUpdate()
	setUsagePeriod() {
		if (this.startTime && this.endTime) {
			this.usagePeriod = {
				startTime: this.startTime,
				endTime: this.endTime,
			};
		}
	}
}
