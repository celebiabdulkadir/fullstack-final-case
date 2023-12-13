import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
	catch(exception: QueryFailedError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();
		let status = 500;
		let message = 'Internal Server Error';

		switch (exception.driverError.code) {
			case '23505': // Duplicate entry
				status = 400;
				message = 'Duplicate entry. The name already exists.';
				break;
			case '23503': // Foreign key violation
				status = 400;
				message = 'Cannot delete or update record because it is in use.';
				break;
			case '22P02': // Invalid input syntax
				status = 400;
				message = 'Invalid input syntax.';
				break;
			// Add more cases as needed
		}

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message: message,
		});
	}
}
