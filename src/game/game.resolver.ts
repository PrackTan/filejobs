import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GameService } from './game.service';
import { Game } from './schema/game.schema';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { Public } from 'src/decorator/customizeDecoratior';

@Resolver()
export class GameResolver {
  constructor(private readonly gameService: GameService) { }
  @Public()
  @Query(() => String)
  async hello() {
    return this.gameService.findAll();
  }
}
