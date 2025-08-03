import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Prisma, User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  create(@Body() createUserData: Prisma.UserCreateInput): Promise<User> {
    return this.appService.create(createUserData);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.appService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.appService.findOne(id);
  }
}
