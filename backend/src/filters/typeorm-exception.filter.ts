import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError, NotFoundException, TypeError, ConflictException)
export class TypeOrmExceptionFilter implements ExceptionFilter {
	catch(
		exception:
			| QueryFailedError
			| NotFoundException
			| TypeError
			| ConflictException,
		host: ArgumentsHost
	) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();
		let status = 500;
		let message = 'Internal Server Error';

		if (exception instanceof NotFoundException) {
			if (exception.message.includes('invalid input syntax')) {
				message = 'please check your input';
			} else {
				message = exception.message;
			}
			status = 404;
		} else if (
			exception instanceof QueryFailedError ||
			exception instanceof TypeError
		) {
			status = 400;
			if (
				exception.message.includes(
					'duplicate key value violates unique constraint'
				)
			) {
				message = 'Duplicate key value detected';
			} else if (exception.message.includes('invalid input syntax')) {
				message = 'please check your input';
			} else {
				message = exception.message;
			}
		} else if (exception instanceof ConflictException) {
			status = 400;
			message = exception.message;
		} else {
			status = 500;
			message = message;
		}

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message: message,
		});
	}
}
