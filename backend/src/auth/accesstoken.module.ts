// AccessTokenModule.ts
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
	providers: [
		{
			provide: 'ACCESS_TOKEN_JWT_SERVICE',
			useFactory: async () => {
				return new JwtService({
					secret: jwtConstants.secret,
					signOptions: { expiresIn: '15m' },
				});
			},
		},
	],
	exports: ['ACCESS_TOKEN_JWT_SERVICE'],
})
export class AccessTokenModule {}

// RefreshTokenModule.ts
@Module({
	providers: [
		{
			provide: 'REFRESH_TOKEN_JWT_SERVICE',
			useFactory: async () => {
				return new JwtService({
					secret: jwtConstants.refreshSecret,
					signOptions: { expiresIn: '1w' },
				});
			},
		},
	],
	exports: ['REFRESH_TOKEN_JWT_SERVICE'],
})
export class RefreshTokenModule {}
