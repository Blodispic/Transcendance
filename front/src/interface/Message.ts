import { IUser } from "./User";

export interface IMessage {
	chanid?: number;
	sender?: IUser;
	IdReceiver?: number;
	message: string;
	sendtime?: string;
}