import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MessageChannelDto {
	@IsNumber()
	chanid: number;

	@IsNumber()
	userid: number;

	@IsString()
	@IsNotEmpty()
	message: string; 
	// à améliorer
}