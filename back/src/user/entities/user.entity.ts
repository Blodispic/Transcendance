import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Channel } from 'src/chat/channel/entities/channel.entity';
import { FriendRequest } from './friend-request.entity';
import { Exclude } from 'class-transformer';

export enum Status {
  Offline = "Offline",
  Online = "Online",
  Ingame = "InGame",
}


@Entity('user')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  twoFaEnable: boolean;

  @Column({ type: 'enum', enum: Status, default: Status.Offline })
  status: Status;

  @Column({ unique: true, nullable: true, length: 16 })
  username: string;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  two_factor_secret: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  intra_avatar: string;

  @ManyToMany(() => User, user => user.friends, { onDelete: 'CASCADE' })
  @JoinTable()
  friends: User[];

  @ManyToMany(() => Channel, channel => channel.users, { onDelete: 'CASCADE'} )
  channels: Channel[];

  @OneToMany(() => Channel, channel => channel.owner, { onDelete: 'CASCADE'} )
  owned: Channel[];

  @ManyToMany(() => User, user => user.blocked, { onDelete: 'CASCADE'})
  @JoinTable()
  blocked: User[];

  //      STATISTIQUES        //

  @Column({ default: 1000 })
  elo: number;

  @Column({ default: 0 })
  win: number;

  @Column({ default: 0 })
  lose: number;

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.creator)
  @JoinTable()
  sendFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.receiver)
  @JoinTable()
  receiveFriendRequests: FriendRequest[];
}
