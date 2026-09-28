import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/** This is App Controller */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /** This is Get Hello from app service */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
