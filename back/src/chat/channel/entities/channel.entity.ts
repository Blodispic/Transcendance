import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique:true })
	name: string;

	// @Column()		a rajouter mais de manière optionnelle
	// password: string;

	@OneToOne(() => User)
	owner: User

	@ManyToMany(() => User)
	@JoinTable()
	users: User[]
}