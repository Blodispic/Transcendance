import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ResultDto } from "./dto/results.dto";
import { Results } from "./entities/results.entity";

@Injectable()
export class ResultService {
  constructor(@InjectRepository(Results) private readonly resultRepository: Repository<Results>) {}

  async createResult(resultDto: ResultDto) {
    const result = this.resultRepository.create(resultDto);
    return this.resultRepository.save(result);
  }

  async findResultById(id: number) {
    return this.resultRepository.findOneBy({
        id: id 
    });
  }
}
