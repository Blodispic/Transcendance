
import { Result } from "./Result";

export enum UserStatus {
    ONLINE = "Online",
    OFFLINE = "Offline",
    INGAME = "InGame",   
}



export interface IUser {

    id: number;
    login: string;
    username: string;
    avatar: string;
    status: UserStatus;
    twoFaEnable: boolean;
    elo: number;
    win: number;
    lose: number;
    friends?: IUser[];
    history?: Result[];
    blocked?: IUser[];
}
