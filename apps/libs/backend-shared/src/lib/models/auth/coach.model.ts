import * as bcrypt from 'bcrypt';
import {
  Gender,
  SpecializationField,
  CommunicationMethod,
  RegisterCoachDto,
  AuthPayload,
  UserType,
  AvailabilityModel,
} from '@forma-ws/domain';
import { Prisma } from '@prisma/client';
import { BaseMapper, MapperConfig } from '../../utils';

export class Coach extends BaseMapper {
  private static readonly mapperConfig: MapperConfig = {
    sensitiveFields: ['password'],
    decimalFields: ['pricing'],
    jsonFields: ['availability'],
    fieldMappings: {},
  };

  constructor(
    public readonly email: string,
    private password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly gender: Gender,
    public readonly yearsOfExperience: number,
    public readonly specializationFields: SpecializationField[],
    public readonly communicationMethods: CommunicationMethod[],
    public readonly bio?: string,
    public readonly pricing?: number,
    public readonly availability?: AvailabilityModel[],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly id?: string
  ) {
    super();
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }

  static async createWithHashedPassword(
    coach: RegisterCoachDto
  ): Promise<Coach> {
    return new Coach(
      coach.email,
      await bcrypt.hash(coach.password, 12),
      coach.firstName,
      coach.lastName,
      coach.gender,
      coach.yearsOfExperience,
      coach.specializationFields,
      coach.communicationMethods || [],
      coach.bio,
      coach.pricing,
      coach.availability
    );
  }

  getUserType(): UserType {
    return UserType.COACH;
  }

  getAuthPayload(): AuthPayload {
    return {
      sub: this.id!,
      email: this.email,
      userType: this.getUserType(),
    };
  }

  static fromPrisma(data: any): Coach {
    const mapped = BaseMapper['mapFromPrisma'](
      data,
      Coach,
      Coach.mapperConfig
    );

    return new Coach(
      mapped.email,
      mapped.password,
      mapped.firstName,
      mapped.lastName,
      mapped.gender,
      mapped.yearsOfExperience,
      mapped.specializationFields,
      mapped.communicationMethods,
      mapped.bio,
      mapped.pricing,
      mapped.availability as AvailabilityModel[],
      mapped.createdAt,
      mapped.updatedAt,
      mapped.id
    );
  }

  toPrisma() {
    return BaseMapper['mapToPrisma'](this, Coach.mapperConfig) as Prisma.CoachCreateInput;
  }

  toJSON() {
    return BaseMapper['mapToJSON'](this, Coach.mapperConfig);
  }
}
