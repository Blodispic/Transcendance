import { Results } from "src/results/entities/results.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  status: string;

  @Column({ default: 1000 })
  elo: number;
  
  @Column()
  avatar: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(type => User, user => user.friends)
  @JoinTable()
    friends: User[];

  //      STATISTIQUES        //
  
  @Column({ default: 0 })
	win: number;

	@Column({ default: 0 })
	loose: number;

  
  @OneToMany(type => Results, result => result.user)
  results: Results[];
}

