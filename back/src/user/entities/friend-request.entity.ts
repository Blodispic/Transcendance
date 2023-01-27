import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { FriendRequest_Status } from "../interface/friend-request.interface";

@Entity('request')
export class FriendRequest {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.sendFriendRequests)
    creator: User;

    @ManyToOne(() => User, (user) => user.receiveFriendRequests)
    receiver: User;

    @Column()
    status: FriendRequest_Status;
}
