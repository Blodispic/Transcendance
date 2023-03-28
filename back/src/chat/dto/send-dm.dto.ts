import { IsNotEmpty, IsString } from 'class-validator';

export class SendDmDto {
	@IsNotEmpty()
	IdReceiver: number;

	@IsString()
	@IsNotEmpty()
	message: string; 
}
