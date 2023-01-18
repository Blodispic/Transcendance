import { Column, PrimaryGeneratedColumn } from "typeorm";


export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique:true })
	name: string;

	// @Column()		a rajouter mais de manière optionnelle
	// password: string;


}