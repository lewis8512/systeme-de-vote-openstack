import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Elector } from '@prisma/client';
import { GetElector } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditElectorDto } from './dto';
import { ElectorService } from './elector.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAdminGuard } from 'src/auth/guard/jwt-admin.guard';
import { DeleteElectorDto } from './dto/delete-elector.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {Multer} from 'multer';

@UseGuards(JwtGuard)
@Controller('electors')
export class ElectorController {
  constructor(private readonly electorService: ElectorService) { }

  @ApiBearerAuth() 
  @ApiOperation({ summary: "Get the information of the connected voter" })
  @Get('me')
  getMe(@GetElector() elector: Elector) {
    return elector;
  }

  @ApiBearerAuth() 
  @UseGuards(JwtGuard, JwtAdminGuard)
  @ApiOperation({ summary: "Get all the electors" })
  @Get()
  getAllElectors(@Req() req: any) {
    return this.electorService.getAllElectors();
  }

  @ApiBearerAuth() 
  @UseGuards(JwtGuard, JwtAdminGuard)
  @ApiOperation({summary: "Edit an elector"})
  @Patch("edit")
  editUser(
    @Body() dto: EditElectorDto,
  ) {
    return this.electorService.editElector(dto);
  }

  @ApiBearerAuth() 
  @UseGuards(JwtGuard, JwtAdminGuard)
  @ApiOperation({ summary: 'Delete an elector' })
  @Patch('delete')
  deleteElector(@Body() dto: DeleteElectorDto) {
    return this.electorService.deleteElector(dto.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @ApiOperation({ summary: 'Create a new elector from a CSV file' })
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importCSV(
    @UploadedFile() file: Multer.File,
  ) {
    return this.electorService.importCSV(file);
  }

  

}
