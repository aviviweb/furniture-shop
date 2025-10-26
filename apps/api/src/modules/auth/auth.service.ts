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
    const ok = user.password.startsWith('$2') ? await bcrypt.compare(password, user.password) : user.password === password;
    if (!ok) throw new UnauthorizedException('invalid credentials');
    return user;
  }

  async sign(userId: string, role: string, tenantId: string) {
    return this.jwt.sign({ sub: userId, role, tenantId });
  }
}


