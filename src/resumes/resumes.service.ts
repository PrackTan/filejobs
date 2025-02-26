import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResumeDtoCV } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schema/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { ResumeStatus } from 'src/enum/resume-status.enum';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) { }

  // Hàm tạo mới một bản ghi resume
  async create(createResumeDtoCV: CreateResumeDtoCV, user: any) {
    const { url, companyId, jobId } = createResumeDtoCV;
    // Tạo một đối tượng resume mới và lưu vào cơ sở dữ liệu
    const resume = await new this.resumeModel({
      url, companyId, jobId,
      status: ResumeStatus.PENDING, // Trạng thái ban đầu là PENDING
      email: user.email,
      userId: user._id,
      history: [
        {
          status: ResumeStatus.PENDING,
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            name: user.name,
          }
        }
      ],
      createdBy: {
        _id: user._id,
        name: user.name
      }
    }).save();
    // Trả về ID và thời gian tạo của resume
    return { _id: resume._id, createAt: resume.createdAt };
  }

  // Hàm tìm kiếm tất cả các resume với phân trang và lọc
  async findAll(query: string, currentPage: number, pageSize: number) {
    const { filter, sort, projection, population } = aqp(query);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * (+pageSize);
    let defaultLimit = +pageSize ? +pageSize : 10;
    const totalItems = await this.resumeModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.resumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select(projection)
      .populate(population);
    // Trả về thông tin phân trang và kết quả tìm kiếm
    return {
      meta: {
        current: currentPage,
        itemsPerPage: defaultLimit,
        totalItems,
        totalPages
      },
      result
    }
  }

  // Hàm tìm kiếm một resume theo ID
  async findOne(id: string) {
    const resume = await this.resumeModel.findById(id);
    if (!resume) {
      throw new NotFoundException('Resume not found'); // Ném lỗi nếu không tìm thấy resume
    }
    return resume; // Trả về resume tìm thấy
  }

  // Hàm cập nhật trạng thái của một resume
  async update(id: string, status: ResumeStatus, user: any) {
    const resume = await this.resumeModel.findById(id);
    if (!resume) {
      throw new NotFoundException('Resume not found'); // Ném lỗi nếu không tìm thấy resume
    }
    // Cập nhật trạng thái và lịch sử cập nhật của resume
    const update = await this.resumeModel.updateOne({ _id: id }, {
      status,
      updatedBy: {
        _id: user._id,
        name: user.email
      },
      $push: {
        history: {
          status,
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            name: user.email
          }
        }
      }
    });
    return update; // Trả về kết quả cập nhật
  }

  // Hàm xóa một resume theo ID
  remove(id: number) {
    return `This action removes a #${id} resume`; // Trả về thông báo xóa
  }
}
