import { IsNumber } from "class-validator";

export class BanUserDto {
    @IsNumber()
    chanid: number;
    
    @IsNumber()
    userid: number;
}