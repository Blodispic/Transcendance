import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MuteUserDto {
    @IsNumber()
    chanid: number;
    
    @IsNumber()
    userid: number;

    @IsOptional()
    @IsString()
    timeout?: string;
}
