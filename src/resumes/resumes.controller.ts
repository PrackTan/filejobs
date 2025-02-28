import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateResumeDtoCV } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customizeDecoratior';
import { ResumeStatus } from 'src/enum/resume-status.enum';
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }


  @ResponseMessage('Create resume successfully')
  @Post()
  create(@Body() createResumeDtoCV: CreateResumeDtoCV, @User() user: any) {
    return this.resumesService.create(createResumeDtoCV, user);
  }
  @ResponseMessage('Get list resumes successfully')
  @Get()
  findAll(@Query('current') currentPage: string, @Query('pageSize') limit: string, @Query('query') query: string) {
    return this.resumesService.findAll(currentPage, limit, query);
  }

  @ResponseMessage('Get resume successfully')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }
  @Post("by-user")
  @ResponseMessage('Get resume successfully')
  getResume(@User() user: any) {
    return this.resumesService.findByUsers(user);
  }
  @ResponseMessage('Update resume successfully')
  @Patch(':id')
  update(@Param('id') id: string, @Body('status') status: ResumeStatus, @User() user: any) {
    return this.resumesService.update(id, status, user);
  }

  @ResponseMessage('Delete resume successfully')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: any) {
    return this.resumesService.remove(id, user);
  }
}
