export class CreateChannelDto {
    readonly chanName: string;
	readonly password?: string;
	readonly chanType: number;
}