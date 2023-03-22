import { IUser } from "./User";

export interface IMessage {
	chanid?: number;
	sender?: IUser;
	// usertowho?: IUser;
	IdReceiver?: number;
	message: string;
	sendtime?: string;
}