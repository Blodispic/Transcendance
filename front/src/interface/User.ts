
import { Result } from "./Result";

export enum UserStatus {
    ONLINE = "online",
    OFFLINE = "offlin",
    INGAME = "ingame",   
}



export interface IUser {

    id: number;
    login: string;
    username: string;
    avatar: string;
    status: UserStatus;
    isTwoFactorAuthenticationEnabled: boolean;
    elo: number;
    twoFaEnable: boolean;
    friends?: IUser[];
    history?: Result[];
}
