
import { Result } from "./Result";

export interface IUser {

    username: string;
    avatar: string;
    elo: number;
    friends?: IUser[];
    history?: Result[];
}
