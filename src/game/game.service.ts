import { Injectable } from '@nestjs/common';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { Game, GameDocument } from './schema/game.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>
  ) { }
  create(createGameInput: CreateGameInput) {
    return 'This action adds a new game';
  }

  async findAll() {
    return await this.gameModel.find();
  }

  findOne(id: number) {
    return "This action returns a #${id} game";
  }

  update(id: number, updateGameInput: UpdateGameInput) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
