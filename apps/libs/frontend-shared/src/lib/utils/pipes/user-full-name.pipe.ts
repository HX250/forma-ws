import { Pipe, PipeTransform } from '@angular/core';

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
