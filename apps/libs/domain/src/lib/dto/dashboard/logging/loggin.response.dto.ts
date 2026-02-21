import { ActivityEnum } from '../../../enums';
import { ShortenedClient } from '../../client/client-response.dto';

export interface LoggingDto {
  client: ShortenedClient;
  activityType: ActivityEnum;
  timestamp: Date;
}
