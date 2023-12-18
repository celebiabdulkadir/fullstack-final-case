import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { Logger } from '@nestjs/common';

export class RefreshJwtStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh'
) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request) => {
					Logger.log('request', request.cookies);
					return request?.cookies?.refreshToken;
				},
			]),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.refreshSecret,
		});
	}

	async validate(payload: any) {
		try {
			Logger.log('refresh payload', payload);
			return { userId: payload.sub, username: payload.username };
		} catch (error) {
			Logger.error('Error validating refresh token', error);
			throw error;
		}
	}
}
