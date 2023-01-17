
import { Result } from "./Result";

export interface User {
    username: string;
    avatar: string;
    status: string;
    elo: number;
    friends?: User[];
    history?: Result[];
}
