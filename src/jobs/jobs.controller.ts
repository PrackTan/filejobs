import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ResponseMessage, User } from 'src/decorator/customizeDecoratior';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }
  @ResponseMessage('Create job successfully')
  @Post()
  create(@Body() createJobDto: CreateJobDto, @User() user: any) {
    return this.jobsService.create(createJobDto, user);
  }

  @Get()
  findAll(@Query("current") currentPage: number, @Query("pageSize") pageSize: number, @Query() qs: string) {
    return this.jobsService.findAll(currentPage, pageSize, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }
  @ResponseMessage('Update job successfully')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: any) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}
