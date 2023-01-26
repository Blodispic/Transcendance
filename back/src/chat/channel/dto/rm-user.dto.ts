import { User } from "src/user/entities/user.entity";

export class RmUserDto {
	readonly user: User;
	readonly chanid: number;
}