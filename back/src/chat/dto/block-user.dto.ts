import { IsNumber } from "class-validator";

export class BlockDto {
    
    @IsNumber()
    userId: number;
}