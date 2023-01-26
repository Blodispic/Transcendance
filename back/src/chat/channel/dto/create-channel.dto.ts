import { User } from "src/user/entities/user.entity";

export class CreateChannelDto {
	readonly name: string;
	// readonly password: string;
	readonly owner: User;
}