import { IsAlphanumeric, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';


export class CreateChannelDto {
    @IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(15)
	chanName: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(30) // jsp
	password?: string;

	@IsNumber()
	chanType: number;

	@IsOptional()
	@IsArray()
	usersId?: number[];
}
