import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { FriendRequest_Status } from '../interface/friend-request.interface';

@Entity('request')
export class FriendRequest {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    creatorId: number;

    @Column()
    receiverId: number;

    @ManyToOne(() => User, (user) => user.sendFriendRequests, {cascade: true,  onDelete: 'CASCADE'})
    creator: User;

    @ManyToOne(() => User, (user) => user.receiveFriendRequests, {cascade: true,  onDelete: 'CASCADE'})
    receiver: User;

    @Column()
    status: FriendRequest_Status;
}
