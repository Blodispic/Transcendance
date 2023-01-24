import { Body, Controller, Post } from "@nestjs/common";
import { ResultService } from "./results.service";
import { Results } from "./entities/results.entity";

@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) { }

  @Post()
  async createResults(@Body() resultDto: Results) {
      return await this.resultService.createResult(resultDto);
  }
  
}
