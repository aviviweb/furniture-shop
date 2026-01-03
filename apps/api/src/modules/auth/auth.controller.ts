import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private prisma: PrismaService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string; tenantId?: string }) {
    try {
      if (!body.email || !body.password) {
        throw new HttpException('אימייל וסיסמה נדרשים', HttpStatus.BAD_REQUEST);
      }

      const user = await this.auth.validateUser(body.email, body.password);
      const company = await this.prisma.company.findFirst({ where: { id: user.companyId } });
      const token = await this.auth.sign(user.id, user.role, company?.tenantId || 'furniture-demo');
      return { token, role: user.role };
    } catch (error: any) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      // Otherwise, wrap it in a proper error response
      console.error('Login error:', error);
      throw new HttpException(
        error?.message || 'שגיאה בהתחברות. בדוק את האימייל והסיסמה.',
        error?.status || HttpStatus.UNAUTHORIZED
      );
    }
  }
}


