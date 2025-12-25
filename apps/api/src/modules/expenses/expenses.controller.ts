import { Body, Controller, Post, Req, BadRequestException } from '@nestjs/common';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private expenses: ExpensesService) {}

  @Post('scan')
  async scan(@Req() req: any, @Body() body: { fileUrl: string }) {
    if (!body?.fileUrl || typeof body.fileUrl !== 'string' || body.fileUrl.trim().length === 0) {
      throw new BadRequestException('fileUrl is required and must be a non-empty string');
    }
    const exp = await this.expenses.upload(req.tenantId, body.fileUrl);
    return { id: exp.id, status: 'queued' };
  }
}


