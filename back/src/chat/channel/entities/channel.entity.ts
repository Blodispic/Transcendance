import { IsOptional } from "class-validator";
import { channel } from "diagnostics_channel";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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
	chanType: ChanType

	@Column({ nullable: true, select: false })
	password: string;

	// @IsOptional()
	@ManyToOne(() => User, user => user.channels, {cascade: true} )
	owner?: User

	// @OneToOne(() => User, { createForeignKeyConstraints: false, nullable: true })
	// @JoinColumn()
	// owner?: User
	
	@ManyToMany(() => User, user => user.channels, { cascade: true })
	@JoinTable()
	admin: User[]

	@ManyToMany(() => User, user => user.channels, { cascade: true })
	@JoinTable()
	users: User[]

	@ManyToMany(() => User, user => user.channels, { cascade: true })
	@JoinTable()
	banned: User[]

	@ManyToMany(() => User, user => user.channels, { cascade: true })
	@JoinTable()
	muted: User[]
}