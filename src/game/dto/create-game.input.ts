import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateGameInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  genre: string;
}
