import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BanUserDto {
    @IsNumber()
    chanid: number;
    
    @IsNumber()
    userid: number;

    @IsOptional()
    @IsString()
    timeout?: string;
}
