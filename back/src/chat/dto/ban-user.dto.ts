import { IsNumber, IsOptional } from 'class-validator';

export class BanUserDto {
    @IsNumber()
    chanid: number;
    
    @IsNumber()
    userid: number;

    @IsOptional()
    @IsNumber()
    timeout?: number;
}
