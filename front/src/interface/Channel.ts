import { IMessage } from "./Message";
import { IUser } from "./User";

export interface IChannel {
	id: number;
	name: string;
	chanType: number;
	password: string;
	owner: IUser;
	admin: IUser[]
	users: IUser[];
	banned: IUser[];
	muted: IUser[];
	messages?: IMessage[];
}