import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
export type GameDocument = HydratedDocument<Game>;

@Schema()
@ObjectType()
export class Game {
  @Field(() => String, { nullable: false })
  _id: Types.ObjectId;

  @Prop({ required: true })
  @Field(() => String, { nullable: false })
  name: string;

  @Prop({ required: true })
  @Field(() => String, { nullable: false })
  genre: string;


}
export const GameSchema = SchemaFactory.createForClass(Game);