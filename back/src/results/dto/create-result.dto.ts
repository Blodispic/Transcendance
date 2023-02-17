import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateResultDto {
	@IsString()
	@IsNotEmpty()
	winner: string;

	@IsString()
	@IsNotEmpty()
	loser: string;

	@IsNumber()
	@IsNotEmpty()
	winner_score: string;

	@IsString()
	@IsNotEmpty()
	loser_score: string;


}
