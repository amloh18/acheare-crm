import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('CreateLocationInput')
export class CreateLocationInputDTO {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  timezone?: string;

  @Field(() => Number, { nullable: true })
  latitude?: number;

  @Field(() => Number, { nullable: true })
  longitude?: number;

  @Field(() => Number, { nullable: true })
  geofenceRadiusMeters?: number;
}

@InputType('UpdateLocationInput')
export class UpdateLocationInputDTO {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  timezone?: string;

  @Field(() => Number, { nullable: true })
  latitude?: number;

  @Field(() => Number, { nullable: true })
  longitude?: number;

  @Field(() => Number, { nullable: true })
  geofenceRadiusMeters?: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@ObjectType('HrLocation')
export class LocationDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  address: string | null;

  @Field(() => String, { nullable: true })
  city: string | null;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => String, { nullable: true })
  country: string | null;

  @Field(() => String, { nullable: true })
  timezone: string | null;

  @Field(() => Number, { nullable: true })
  latitude: number | null;

  @Field(() => Number, { nullable: true })
  longitude: number | null;

  @Field(() => Number, { nullable: true })
  geofenceRadiusMeters: number | null;

  @Field(() => Boolean)
  isActive: boolean;
}
