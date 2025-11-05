import { Pipe, PipeTransform } from '@angular/core';

import { Client, Coach } from '@forma-ws/frontend/domain';

@Pipe({
  name: 'userFullName',
  standalone: true,
})
export class UserFullNamePipe implements PipeTransform {
  transform(user: Client | Coach): string {
    return `${user?.firstName} ${user?.lastName}`;
  }
}
