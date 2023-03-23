import { IsNotEmpty, IsNumber } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class RmUserDto {
	@IsNotEmpty()
	user: User;

	@IsNumber()
	chanid: number;
}
