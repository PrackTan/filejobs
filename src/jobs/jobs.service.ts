import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schema/job.schema';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
  ) { }
  async create(createJobDto: CreateJobDto, user: any) {
    const job = await new this.jobModel({
      ...createJobDto,
      createBy: {
        _id: user._id,
        name: user.email
      }
    }).save()
    return { _id: job._id, createAt: job.createdAt };
  }

  async findAll(current: number, pageSize: number, query: string) {
    // Sử dụng thư viện api-query-params để phân tích cú pháp query thành các phần tử filter, sort, projection, và population.
    const { filter, sort, projection, population } = aqp(query)
    // Xóa các thuộc tính page và limit khỏi filter vì chúng không cần thiết cho việc lọc dữ liệu.
    delete filter.current
    delete filter.pageSize
    // Tính toán offset dựa trên số trang và giới hạn.
    let offset = (current - 1) * (+pageSize);
    // Đặt giới hạn mặc định là 10 nếu limit không được cung cấp.
    let defaultLimit = +pageSize ? +pageSize : 10;

    // Đếm tổng số mục dựa trên filter.
    const totalItems = (await this.jobModel.countDocuments(filter))
    // Tính toán tổng số trang dựa trên tổng số mục và giới hạn mặc định.
    const totalPage = Math.ceil(totalItems / defaultLimit)
    // Tìm các công việc dựa trên filter, offset, limit, sort, projection, và population.
    const result = await this.jobModel.find(filter) // Tìm các công việc dựa trên filter
      .skip(offset) // Bỏ qua một số mục dựa trên offset
      .limit(defaultLimit) // Giới hạn số lượng mục trả về dựa trên defaultLimit
      .sort(sort as any) // Sắp xếp các mục dựa trên sort
      .select(projection) // Chọn các trường cần thiết dựa trên projection
      .populate(population) // Điền dữ liệu các trường liên quan dựa trên population
    // Trả về đối tượng chứa thông tin meta và kết quả.
    return {
      meta: {
        current: current, // Trang hiện tại
        itemCount: totalItems, // Tổng số mục
        itemsPerPage: defaultLimit, // Số mục trên mỗi trang
        totalItems, // Tổng số mục
        totalPages: totalPage // Tổng số trang
      },
      result
    }
  }

  async findOne(_id: string) {
    const job = await this.jobModel.findOne({ _id })
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }
    return job;
  }

  async update(_id: string, updateJobDto: UpdateJobDto, user: any) {
    const job = await this.jobModel.findById(_id);
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }
    const update = await this.jobModel.updateOne({ _id }, {
      ...updateJobDto,
      updateBy: {
        _id: user._id,
        name: user.email
      }
    });
    if (!update) {
      throw new NotFoundException('Không tìm thấy công việc');
    }
    return update;

  }

  async remove(_id: string) {
    const remove = await this.jobModel.softDelete({ _id });
    if (!remove) {
      throw new NotFoundException('Không tìm thấy công việc');
    }
    return { deleted: true };
  }
}
