
<<<<<<< HEAD
import { IsOptional } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
=======
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
>>>>>>> 91c2ffa67a13d993a568cf2e4e75c797384b6ece

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

	@Column('int', {default: 0})
	chanType: ChanType;

	@Column({ nullable: true, select: false})
	password: string;

	@IsOptional()
	@ManyToOne(() => User, user => user.channels, {cascade: true} )
	owner?: User
	
	@ManyToMany(() => User, user => user.channels, { cascade: true })
	@JoinTable()
	admin: User[];

	@ManyToMany(() => User, user => user.channels, { cascade: true })
	@JoinTable()
	users: User[];

	@ManyToMany(() => User, user => user.channels, { cascade: true })
	@JoinTable()
	banned: User[];

	@ManyToMany(() => User, user => user.channels, { cascade: true })
	@JoinTable()
	muted: User[];
}
