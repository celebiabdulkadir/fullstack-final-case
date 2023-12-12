import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

export class RefreshJwtStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh'
) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request) => {
					return request?.cookies?.refreshToken;
				},
			]),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.refreshSecret,
		});
	}

	async validate(payload: any) {
		return { user: payload.sub, username: payload.username };
	}
}
