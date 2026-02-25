import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  AddWeighInDto,
  AuthPayload,
  ChartSpaceValues,
  WeighInResponse,
} from '@forma-ws/domain';
import { JwtAuthGuard } from '@forma-ws/backend-shared';
import { WeightService } from './weight.service';
import { CurrentUser } from '../../../security/common/decorators/current-user.decorator';

@Controller('tracking/weight')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Get(':clientId/chart')
  getWeightTracking(
    @Param('clientId') clientId: string,
    @Query('span', new DefaultValuePipe(ChartSpaceValues.YEAR), ParseIntPipe)
    span: number
  ) {
    return this.weightService.getWeightTracking(clientId, span);
  }

  @Post()
  addDailyWeighIn(
    @CurrentUser() user: AuthPayload,
    @Body() dto: AddWeighInDto
  ): Promise<boolean> {
    return this.weightService.logDailyWeighIn(user.sub, dto);
  }

  @Get()
  getTodayTracking(@CurrentUser() user: AuthPayload): Promise<WeighInResponse> {
    return this.weightService.getTodayWeighIn(user.sub);
  }
}
