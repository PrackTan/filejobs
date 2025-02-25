import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { Game } from '../schema/game.schema';

@InputType()
export class CreateGameInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  genre?: string;
}

@InputType()
export class GameFilter {
  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => Number, { nullable: true })
  current?: number;

  @Field(() => Number, { nullable: true })
  pageSize?: number;
}


@ObjectType()
class MetaData {
  @Field(() => Int)
  current: number;

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  itemsPerPage: number;

  @Field(() => Int)
  totalPages: number;
}

@ObjectType()
export class GameResponse {
  @Field(() => MetaData)
  meta: MetaData;

  @Field(() => [Game])
  result: Game[];
}