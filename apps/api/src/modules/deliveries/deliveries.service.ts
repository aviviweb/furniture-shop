import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async optimize(companyId: string, stops: { lat: number; lng: number; id: string }[]) {
    // mock TSP: return same order with simple distance heuristic
    const route = stops.slice().sort((a, b) => (a.lat + a.lng) - (b.lat + b.lng));
    return { route, provider: process.env.GOOGLE_MAPS_API_KEY ? 'google' : 'mock' };
  }
}


