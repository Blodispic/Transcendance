import { User } from "../entities/user.entity";

export type FriendRequest_Status = 'Pending' | 'Accepted' | 'Declined';

export interface FriendRequestStatus {
    status?: FriendRequest_Status;
}

export interface FriendRequest {
    id?: number;
    creator?: User;
    receiver?: User;
    status?: FriendRequest_Status;
}