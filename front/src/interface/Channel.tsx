import { IUser } from "./User";

export interface IChannel {
	id: number;
	name: string;
	owner: IUser;
	users: IUser[];
}