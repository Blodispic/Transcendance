import { IsNumber, IsOptional } from "class-validator";

export class MuteUserDto {
    @IsNumber()
    chanid: number;
    
    @IsNumber()
    userid: number;

    @IsOptional()
    @IsNumber()
    timeout?: number;
}