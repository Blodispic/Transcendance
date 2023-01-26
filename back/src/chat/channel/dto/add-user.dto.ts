import { User } from "src/user/entities/user.entity";

export class AddUserDto {
	readonly user: User;
	readonly chanId: number;
}