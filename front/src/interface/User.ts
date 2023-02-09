
import { Result } from "./Result";

export enum UserStatus {
    ONLINE,
    OFFLINE,
    INGAME,   
}



export interface IUser {

    id: number;
    login: string;
    username: string;
    avatar: string;
    status: UserStatus;
    elo: number;
    friends?: IUser[];
    history?: Result[];
}
