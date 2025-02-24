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
  async create(createGameInput: CreateGameInput): Promise<Game> {
    const createdGame = new this.gameModel(createGameInput);
    const saveGame = await createdGame.save();

    return {
      _id: saveGame._id,
      name: saveGame.name,
      genre: saveGame.genre,
    };
  }


  async findAll(): Promise<Game[]> {
    const games = await this.gameModel.find().exec();

    return games; // Đảm bảo luôn trả về một mảng
  }

  // Tìm game theo ID từ MongoDB
  async findOne(id: string): Promise<Game | null> {
    return await this.gameModel.findById(id);
  }

  update(id: number, updateGameInput: UpdateGameInput) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
