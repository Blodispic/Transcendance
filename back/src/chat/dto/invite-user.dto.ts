import { IsNotEmpty, IsNumber } from 'class-validator';

export class InviteDto {
    @IsNotEmpty()
    usersId: number[];

    @IsNumber()
    chanid: number;
}
