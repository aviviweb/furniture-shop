import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private prisma: PrismaService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string; tenantId?: string }) {
    const user = await this.auth.validateUser(body.email, body.password);
    const company = await this.prisma.company.findFirst({ where: { id: user.companyId } });
    const token = await this.auth.sign(user.id, user.role, company?.tenantId || 'furniture-demo');
    return { token, role: user.role };
  }
}


