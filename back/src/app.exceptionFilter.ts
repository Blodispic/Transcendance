import { Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";

@Catch()
export class GatewayExceptionFilter extends BaseWsExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		console.log("exception message = ", exception.message);
		if (exception instanceof WsException) {
			console.log("WsException", exception.message);
			super.catch(exception, host);
		}
		else if (exception instanceof HttpException){
			console.log("HttpException", exception.message);
			const properException = new WsException(exception.getResponse());
			super.catch(properException, host);
		} else {
			console.log("ElseException", exception.message);
		}
	}
}