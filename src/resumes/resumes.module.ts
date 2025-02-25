import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from './schema/resume.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }])], // Đăng ký model Resume và schema ResumeSchema
  controllers: [ResumesController], // Đăng ký controller ResumesController
  providers: [ResumesService], // Đăng ký service ResumesService
})
export class ResumesModule { }
