import { IsNumber } from "class-validator";

export class RmAdminDto {
    @IsNumber()
    chanid: number;

    @IsNumber()
    userid: number;
}