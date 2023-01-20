
import { Result } from "./Result";

export interface IUser {

    id: number;
    login: string;
    username: string;
    avatar: string;
    status: string;
    elo: number;
    friends?: IUser[];
    history?: Result[];
}
