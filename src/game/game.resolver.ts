import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GameService } from './game.service';
import { Game } from './schema/game.schema';
import { CreateGameInput, GameResponse } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { Public } from 'src/decorator/customizeDecoratior';
import mongoose from 'mongoose';

@Resolver()
export class GameResolver {
  constructor(private readonly gameService: GameService) { }

  @Public()
  @Mutation(() => Game)
  async createGame(@Args('createGameInput') createGameInput: CreateGameInput) {
    return this.gameService.create(createGameInput);
  }


  @Public()
  @Query(() => GameResponse) // Trả về object chứa meta và result
  async findAll(
    @Args('current', { type: () => Int }) current: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
    @Args('query', { type: () => String, nullable: true }) query: string
  ): Promise<GameResponse> {
    return this.gameService.findAll(current, pageSize, query);
  }
  @Public()
  @Query(() => Game)
  async findOne(@Args('id', { type: () => String }) id: string) {
    return this.gameService.findOne(id);
  }
}
