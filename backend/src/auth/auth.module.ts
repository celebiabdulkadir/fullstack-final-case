import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '3600s' },
		}),
	],
	providers: [AuthService, LocalStrategy, JwtStrategy, RefreshJwtStrategy],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
