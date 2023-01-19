import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique:true })
	name: string;

	// @Column()		a rajouter mais de manière optionnelle
	// password: string;

	@ManyToMany(() => User)
	@JoinTable()
	users: User[]
}