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

    @ManyToOne(() => User, (user) => user.sendFriendRequests, { onDelete: 'CASCADE' , cascade: true })
    creator: User;

    @ManyToOne(() => User, (user) => user.receiveFriendRequests, { onDelete: 'CASCADE' , cascade: true })
    receiver: User;

    @Column()
    status: FriendRequest_Status;
}
