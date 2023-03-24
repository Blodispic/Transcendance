import { IsNotEmpty } from "class-validator";
import { FriendRequest_Status } from "../interface/friend-request.interface";
import { User } from "../entities/user.entity";

export class FriendRequestDto {

	@IsNotEmpty()
	creatorId: number;

	@IsNotEmpty()
	receiverId: number;

	@IsNotEmpty()
	creator: User;

	@IsNotEmpty()
	receiver: User;

	@IsNotEmpty()
	status: FriendRequest_Status;

}
