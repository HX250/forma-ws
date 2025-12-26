import { Pipe, PipeTransform } from '@angular/core';
import { Client, Coach } from '@forma-ws/domain';

@Pipe({
  name: 'userFullName',
  standalone: true,
})
export class UserFullNamePipe implements PipeTransform {
  transform(user: any): string {
    if (!user) {
      return '';
    }

    return `${user.firstName} ${user.lastName}`;
  }
}
