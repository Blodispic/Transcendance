import { IsString } from "class-validator";

export class ResultDto {
  @IsString()
  winner: string;

  @IsString()
  looser: string;

  @IsString()
  winner_score: string;

  @IsString()
  looser_score: string;

  @IsString()
  winner_avatar: string;

  @IsString()
  looser_avatar: string;
}
