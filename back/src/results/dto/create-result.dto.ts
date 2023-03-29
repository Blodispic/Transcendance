import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateResultDto {
	@IsNumber()
	@IsNotEmpty()
	winnerId: number;

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
