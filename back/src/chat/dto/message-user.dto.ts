import { User } from "src/user/entities/user.entity";

export class MessageUserDto {
	readonly usertowho: User;
	readonly message: string; 
	// à améliorer
}