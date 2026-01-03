import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn(`⚠️ Login attempt with non-existent email: ${email}`);
      throw new UnauthorizedException('invalid credentials');
    }
    
    // Security: Only allow bcrypt hashed passwords in production
    // Plain text passwords are only allowed in demo mode for development
    const isDemo = process.env.DEMO_MODE === 'true';
    const isHashed = user.password.startsWith('$2');
    
    console.log(`🔐 Login attempt for ${email}, Demo Mode: ${isDemo}, Password Hashed: ${isHashed}`);
    
    let ok = false;
    if (isHashed) {
      ok = await bcrypt.compare(password, user.password);
      console.log(`🔐 Bcrypt comparison result: ${ok}`);
    } else if (isDemo) {
      // Only allow plain text comparison in demo mode
      ok = user.password === password;
      console.log(`🔐 Plain text comparison result: ${ok}`);
    } else {
      // In production, reject plain text passwords
      console.error(`❌ Rejecting login: Plain text password in production mode for ${email}`);
      throw new UnauthorizedException('invalid credentials');
    }
    
    if (!ok) {
      console.warn(`⚠️ Login failed: Invalid password for ${email}`);
      throw new UnauthorizedException('invalid credentials');
    }
    
    console.log(`✅ Login successful for ${email}, Role: ${user.role}`);
    return user;
  }

  async sign(userId: string, role: string, tenantId: string) {
    return this.jwt.sign({ sub: userId, role, tenantId });
  }
}


