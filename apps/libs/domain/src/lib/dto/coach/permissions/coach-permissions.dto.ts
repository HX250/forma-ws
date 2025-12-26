import { PermissionsEnum } from './permissions.enum';

export interface CoachEnablePermissionDto {
  clientId: string;
  permissionType: PermissionsEnum;
  value: boolean;
}
