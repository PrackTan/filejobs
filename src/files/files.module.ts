import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [MulterModule.registerAsync({
    useClass: MulterConfigService,
    inject: [ConfigService]
  })],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule { }
