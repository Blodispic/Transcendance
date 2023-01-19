import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ResultDto } from "./dto/results.dto";
import { ResultService } from "./results.service";

@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post()
  async createResult(@Body() resultDto: ResultDto) {
    return await this.resultService.createResult(resultDto);
  }

  @Get('user/:id')
  async findResultById(@Param('id') id: number) {
    return await this.resultService.findResultById(id);
  }
}
