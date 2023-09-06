import { Injectable } from "@nestjs/common";
import { ModuleModel, ModuleDocument } from "../schemas/module.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaginationDTO } from "../dto/validation/pagination.dto";
import { PaginationResponse } from "../dto/responses/pagination";

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(ModuleModel.name) private moduleModel: Model<ModuleDocument>
  ) {}
  async findAll(
    paginationDto: PaginationDTO
  ): Promise<PaginationResponse<ModuleDocument>> {
    const query = this.moduleModel.find();
    const { search, page = 1, perPage = 10 } = paginationDto;
    if (search) {
      query.or([
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ]);
    }
    const query2 = query.clone();
    const count = await query.countDocuments();
    const modules = await query2
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
    return { data: modules, count, page, perPage };
  }

  async findBySlug(slug: string): Promise<ModuleDocument | null> {
    return this.moduleModel.findOne({ slug }).exec();
  }

  async findById(id: string): Promise<ModuleDocument | null> {
    return this.moduleModel.findById(id).exec();
  }
}
