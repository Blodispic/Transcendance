import { User } from "src/user/entities/user.entity";

export class MessageChannelDto {
	readonly chanid: number;
	// readonly userid: number;
	readonly sender: User; //edited
	readonly message: string; 
	// à améliorer
}