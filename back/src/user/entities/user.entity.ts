import { Channel } from "src/channel/entities/channel.entity";
import { Results } from "../../results/entities/results.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";

@Entity()
export class User {
  
  @Column()
  access_token: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column()
  intra_avatar: string;

  @ManyToMany(type => User, user => user.friends)
  @JoinTable()
  friends: User[];

  @ManyToMany(() => Channel)
  channels: Channel[]

  //      STATISTIQUES        //

  @Column({ default: 1000 })
  elo: number;

  @Column({ default: 0 })
  win: number;

  @Column({ default: 0 })
  loose: number;

  @OneToMany(type => Results, result => result.user)
  results: Results[];
}
