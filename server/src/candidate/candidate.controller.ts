import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import {Multer} from 'multer';
import { CandidateService } from './candidate.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAdminGuard } from 'src/auth/guard/jwt-admin.guard';
import { CreateCandidateDto } from './create-candidate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { updateCandidateDto } from './update-candidate.dto';


@Controller('candidates')
export class CandidateController {
    constructor(private readonly candidateService: CandidateService) { }

    @ApiOperation({ summary: "Get all candidates for current election" })
    @Get()
    async getAllCandidatesForCurrentElection() {
        return await this.candidateService.getAllCandidatesForCurrentElection();
    }

    @ApiBearerAuth()
    @UseGuards(JwtAdminGuard)
    @ApiOperation({ summary: 'Get all candidates for a specific election' })
    @Get('election/:id')
    async getCandidatesByElection(@Param('id') id: string) {
        return await this.candidateService.getCandidatesByElection(id);
    }

    
    @ApiBearerAuth()
    @UseGuards(JwtAdminGuard)
    @ApiOperation({ summary: 'Create a new candidate from a CSV file' })
    @Post('import')
    @UseInterceptors(FileInterceptor('file')) // ← important pour récupérer le CSV
    async importCSV(
      @UploadedFile() file: Multer.File,
      @Body('electionId') electionId: string,
    ) {
      return this.candidateService.importCSV(file, electionId);
    }
  
    @ApiBearerAuth()
    @UseGuards(JwtAdminGuard)
    @ApiOperation({ summary: 'Create a new candidate manually' })
    @Post('create')
    @UseInterceptors(FileInterceptor('photo')) // ← important pour récupérer l’image
    async createCandidate(
      @Body() dto: CreateCandidateDto,
      @UploadedFile() photo: Multer.File,
    ) {
      return this.candidateService.createCandidate(dto, photo);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAdminGuard)
    @ApiOperation({ summary: 'Get a candidate by ID' })
    @Get(':id')
    async getCandidateById(@Param('id') id: string) {
        return await this.candidateService.getCandidateById(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAdminGuard)
    @ApiOperation({ summary: 'Update a candidate by ID' })
    @Post('edit/:id')
    @UseInterceptors(FileInterceptor('image'))
    async updateCandidate(
      @Param('id') candidateId: string,
      @Body() dto: updateCandidateDto,
      @UploadedFile() image: Multer.File,
    ) {
      return await this.candidateService.updateCandidate(candidateId, dto, image);
    }


}