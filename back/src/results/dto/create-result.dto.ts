import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateResultDto {
	@IsString()
	@IsNotEmpty()
	winner: string;

	@IsString()
	@IsNotEmpty()
	looser: string;

	@IsNumber()
	@IsNotEmpty()
	winner_score: string;

	@IsString()
	@IsNotEmpty()
	looser_score: string;

  
}
