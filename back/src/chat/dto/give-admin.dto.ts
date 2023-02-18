import { IsNumber } from "class-validator";

export class GiveAdminDto {
    @IsNumber()
    chanid: number;

    @IsNumber()
    userid: number;
}