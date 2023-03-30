
import { IsOptional } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

enum ChanType {
	Public,
	Private,
	Protected,
  }

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique:true })
	name: string;

	@Column({ type: 'enum', enum: ChanType, default: ChanType.Public })
	chanType: ChanType;

	@Column({ nullable: true, select: false})
	password: string;

	@IsOptional()
	@ManyToOne(() => User, user => user.owned, {cascade: true} )
	owner?: User
	
	@ManyToMany(() => User, { cascade: true })
	@JoinTable()
	admin: User[];

	@ManyToMany(() => User, user => user.channels, { cascade: true })
	@JoinTable()
	users: User[];

	@ManyToMany(() => User, { cascade: true })
	@JoinTable()
	banned: User[];

	@ManyToMany(() => User, { cascade: true })
	@JoinTable()
	muted: User[];

}
