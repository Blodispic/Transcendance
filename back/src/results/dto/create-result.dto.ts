import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateResultDto {
	@IsString()
	@IsNotEmpty()
	winner: string;

	@IsNumber()
	@IsNotEmpty()
	winnerId: number;

	@IsString()
	@IsNotEmpty()
	loser: string;

	@IsNumber()
	@IsNotEmpty()
	loserId: number;

	@IsNumber()
	@IsNotEmpty()
	winner_score: string;

	@IsNumber()
	@IsNotEmpty()
	loser_score: string;


}
