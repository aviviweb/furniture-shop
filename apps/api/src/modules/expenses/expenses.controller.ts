import { Body, Controller, Post, Req } from '@nestjs/common';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private expenses: ExpensesService) {}

  @Post('scan')
  async scan(@Req() req: any, @Body() body: { fileUrl: string }) {
    const exp = await this.expenses.upload(req.tenantId, body.fileUrl);
    return { id: exp.id, status: 'queued' };
  }
}


