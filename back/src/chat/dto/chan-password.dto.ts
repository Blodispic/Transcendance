import { IsNumber } from 'class-validator';

export class ChanPasswordDto {
    @IsNumber()
    chanid: number;
    
    @IsNumber()
    password: string;
}
