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

    console.log("🔥 Dữ liệu MongoDB sau khi lưu:", saveGame); // Debug

    // Nếu name bị undefined hoặc null, cần kiểm tra lại
    if (!saveGame.name) {
      throw new Error("❌ Dữ liệu trả về không có name, kiểm tra lại schema!");
    }

    return {
      name: saveGame.name,
      genre: saveGame.genre,
    };
  }


  async findAll() {
    return await this.gameModel.find();
  }

  async findOne(id: string) {
    return await this.gameModel.findById(id);
  }

  update(id: number, updateGameInput: UpdateGameInput) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
