import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GameService } from './game.service';
import { Game } from './schema/game.schema';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { Public } from 'src/decorator/customizeDecoratior';

@Resolver(() => Game)
export class GameResolver {
  constructor(private readonly gameService: GameService) { }

  // @Mutation(() => Game)
  // createGame(@Args('createGameInput') createGameInput: CreateGameInput) {
  //   return this.gameService.create(createGameInput);
  // }
  @Public()
  @Query(() => [Game], { name: 'games' })  // Change "game" to "games"
  findAll() {
    return this.gameService.findAll();
  }

  // @Query(() => Game, { name: 'game' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.gameService.findOne(id);
  // }

  // @Mutation(() => Game)
  // updateGame(@Args('updateGameInput') updateGameInput: UpdateGameInput) {
  //   return this.gameService.update(updateGameInput.id, updateGameInput);
  // }

  // @Mutation(() => Game)
  // removeGame(@Args('id', { type: () => Int }) id: number) {
  //   return this.gameService.remove(id);
  // }
}
