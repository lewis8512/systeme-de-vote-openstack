import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ElectionService } from './election.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateElectionDto } from './create-election.dto';
import { JwtAdminGuard } from 'src/auth/guard/jwt-admin.guard';
import { EditElectionDto } from './edit-election.dto';

@Controller('elections')
export class ElectionController {
  constructor(private readonly electionService: ElectionService) { }

  @ApiOperation({ summary: "Get current election" })
  @Get('current')
  async getCurrentElection() {
    return await this.electionService.getCurrentElection();
  }

  @Get('results')
  @ApiOperation({ summary: "Get current results of the active election" })
  getCurrentResults() {
    return this.electionService.getResultsForCurrentElection();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Get('admin-results')
  @ApiOperation({ summary: "Get results of the active election for admin" })
  getAdminResults() {
    return this.electionService.getAdminResultsForCurrentElection();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Get(':id')
  @ApiOperation({ summary: "Get election by id" })
  getElectionById(@Param('id') id: string) {
    return this.electionService.getElectionById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Get('')
  @ApiOperation({ summary: "Get all elections" })
  getAllElections() {
    return this.electionService.getAllElections();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Post('create')
  @ApiOperation({ summary: "Create a new election" })
  async createElection(@Body() dto: CreateElectionDto) {
    return this.electionService.createElection(dto);
  }
  
  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Post('edit/:id')
  @ApiOperation({ summary: "Edit an election" })
  async editElection(@Param('id') id: string, @Body() dto: EditElectionDto) {
    return this.electionService.editElection(id, {
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
  }

}
