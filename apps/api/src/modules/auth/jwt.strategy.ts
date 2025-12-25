import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret === 'change-me') {
      console.warn('⚠️ WARNING: JWT_SECRET is not set or using default value. This is a security risk!');
      console.warn('⚠️ Please set JWT_SECRET environment variable in production.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret || 'change-me',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, role: payload.role, tenantId: payload.tenantId };
  }
}


