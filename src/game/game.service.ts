import { Injectable } from '@nestjs/common';
import { CreateGameInput, GameFilter, GameResponse } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { Game, GameDocument } from './schema/game.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';

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


  // async findAll(filter: GameFilter): Promise<Game[]> {
  //   const { search, current, pageSize } = filter;
  //   const games = await this.gameModel.find({
  //     where: {
  //       OR: [
  //         {
  //           gameName: {
  //             contains: search,
  //           },
  //           gameGenre: {
  //             contains: search,
  //           }
  //         }
  //       ]
  //     },
  //   });

  //   return games; // Đảm bảo luôn trả về một mảng
  // }

  async findAll(current: number, pageSize: number, query: string): Promise<GameResponse> {
    const { filter, sort, projection, population } = aqp(query);

    delete filter.current;
    delete filter.pageSize;

    let offset = (current - 1) * (+pageSize);
    let defaultLimit = +pageSize ? +pageSize : 10;

    // Sửa đổi filter để hỗ trợ tìm kiếm theo từ khóa
    if (filter.name) {
      filter.name = { $regex: filter.name, $options: "i" }; // Tìm kiếm gần đúng, không phân biệt hoa/thường
    }
    const totalItems = await this.gameModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.gameModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select(projection)
      .populate(population);

    return {
      meta: {
        current,
        itemsPerPage: defaultLimit,
        totalItems,
        totalPages,
      },
      result,
    };
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
