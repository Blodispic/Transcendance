import { Results } from "../../results/entities/results.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Channel } from "src/chat/channel/entities/channel.entity";
import { FriendRequest } from "./friend-request.entity";

@Entity('user')
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ default: false })
  isTwoFactorAuthenticationEnabled: boolean;

  @Column()
  access_token: string;

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
  @JoinTable()
  sendFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.receiver)
  @JoinTable()
  receiveFriendRequests: FriendRequest[];
}
