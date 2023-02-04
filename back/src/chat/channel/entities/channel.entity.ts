import { channel } from "diagnostics_channel";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

enum ChanType {
	Public,
	Private,
	Protected
  }

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique:true })
	name: string;

	@Column('int')
	chanType: ChanType

	@Column()
	password?: string;

	@ManyToOne(() => User)
	owner: User

	@ManyToMany(() => User, user => user.channels, { cascade: true })
	@JoinTable()
	users: User[]
}