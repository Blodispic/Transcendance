import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class ReceiveDmDto {
	@IsNotEmpty()
	sender: User;

	@IsString()
	@IsNotEmpty()
	@MaxLength(1000)
	message: string;
}
