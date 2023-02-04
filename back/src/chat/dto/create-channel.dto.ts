export class CreatePublicChannelDto {
    readonly channame: string;
	readonly password?: string;
	readonly chanType: number;
}