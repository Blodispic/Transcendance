import { Channel } from "src/channel/entities/channel.entity";
import { Results } from "../../results/entities/results.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { FriendRequest } from "./friend-request.entity";

@Entity('user')
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

  @ManyToMany(() => User, user => user.friends)
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

  @OneToMany(() => Results, result => result.user)
  results: Results[];

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.creator)
  sendFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.receiver)
  receiveFriendRequests: FriendRequest[];
}
