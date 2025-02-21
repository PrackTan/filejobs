import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { Game } from './schema/game.schema';
import { GameSchema } from './schema/game.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [GameResolver, GameService],
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],
  exports: [GameService]
})
export class GameModule { }
