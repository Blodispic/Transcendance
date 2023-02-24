import { IUser } from "./User";

export interface IMessage {
	chanid?: number;
	userid?: number;
	sender?: IUser;
	usertowho?: IUser;
	message: string;
}