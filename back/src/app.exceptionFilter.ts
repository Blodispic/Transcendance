import { Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";

@Catch()
export class GatewayExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
	console.log("Catching", exception);
	
    if (exception instanceof WsException) {
      super.catch(exception, host);
    } else if (exception instanceof HttpException) {
      const response: any = exception.getResponse(); // add type annotation
      const message = typeof response === 'string' ? response : response.message;
      const properException = new WsException(message);
      super.catch(properException, host);
    } else {
      console.error(exception.message); // log the error message
      const message = exception.message || 'Internal server error';
      const properException = new WsException(message);
      super.catch(properException, host);
    }
  }
}

