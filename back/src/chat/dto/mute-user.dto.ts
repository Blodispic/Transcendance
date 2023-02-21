import { IsNumber } from "class-validator";

export class MuteUserDto {
    @IsNumber()
    chanid: number;
    
    @IsNumber()
    userid: number;
}