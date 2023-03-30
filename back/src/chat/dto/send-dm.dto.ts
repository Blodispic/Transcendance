import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class SendDmDto {
	@IsNumber()
	IdReceiver: number;

	@IsString()
	@IsNotEmpty()
	@MaxLength(1000)
	message: string; 
}
