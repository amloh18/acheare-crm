import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('PublishAnnouncementInput')
export class PublishAnnouncementInputDTO {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  body?: string;

  // ALL | DEPARTMENT | TEAM
  @Field(() => String, { nullable: true })
  audience?: string;

  @Field(() => [String], { nullable: true })
  targetDepartmentIds?: string[];

  @Field(() => [String], { nullable: true })
  targetTeamIds?: string[];

  @Field(() => String, { nullable: true })
  expiresAt?: string;
}

@ObjectType('Announcement')
export class AnnouncementDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  body: string | null;

  @Field(() => String, { nullable: true })
  audience: string | null;

  @Field(() => String, { nullable: true })
  authorId: string | null;

  @Field(() => String, { nullable: true })
  publishAt: string | null;

  @Field(() => String, { nullable: true })
  expiresAt: string | null;
}
