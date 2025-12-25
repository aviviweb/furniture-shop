import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('invalid credentials');
    
    // Security: Only allow bcrypt hashed passwords in production
    // Plain text passwords are only allowed in demo mode for development
    const isDemo = process.env.DEMO_MODE === 'true';
    const isHashed = user.password.startsWith('$2');
    
    let ok = false;
    if (isHashed) {
      ok = await bcrypt.compare(password, user.password);
    } else if (isDemo) {
      // Only allow plain text comparison in demo mode
      ok = user.password === password;
    } else {
      // In production, reject plain text passwords
      throw new UnauthorizedException('invalid credentials');
    }
    
    if (!ok) throw new UnauthorizedException('invalid credentials');
    return user;
  }

  async sign(userId: string, role: string, tenantId: string) {
    return this.jwt.sign({ sub: userId, role, tenantId });
  }
}


