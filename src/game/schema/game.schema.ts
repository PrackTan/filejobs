import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type GameDocument = HydratedDocument<Game>;

@Schema()
@ObjectType()
export class Game {
  @Prop({ required: true })
  @Field(() => String)
  name: string;

  @Prop({ required: true })
  @Field(() => String)
  genre: string;


}
export const GameSchema = SchemaFactory.createForClass(Game);