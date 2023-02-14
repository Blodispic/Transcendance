
import { Result } from "./Result";

export enum UserStatus {
    ONLINE = "online",
    OFFLINE = "offline",
    INGAME = "ingame",   
}



export interface IUser {

    id: number;
    login: string;
    username: string;
    avatar: string;
    status: UserStatus;
    twoFaEnable: boolean;
    elo: number;
    friends?: IUser[];
    history?: Result[];
}
