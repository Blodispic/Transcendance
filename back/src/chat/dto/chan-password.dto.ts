import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ChanPasswordDto {
    @IsNumber()
    chanid: number;
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    password: string;
}
