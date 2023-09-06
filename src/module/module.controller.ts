import { Controller, Get, Param, Body } from "@nestjs/common";
import { ModuleService } from "./module.service";
import { PaginationDTO } from "../dto/validation/pagination.dto";

@Controller("modules")
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Get("/")
  async findAll(@Param() paginationDto: PaginationDTO) {
    return this.moduleService.findAll(paginationDto);
  }

  @Get(":id")
  async find(@Param("id") id: string) {
    return this.moduleService.findById(id);
  }
}
