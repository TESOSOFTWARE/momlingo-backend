import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NameDto } from './dtos/name.dto';
import { Name } from './entities/name.entity';
import { Gender } from '../../enums/gender.enum';
import { Language } from '../../enums/language.enum';
import { PAGINATION } from '../../constants/constants';

@Injectable()
export class NamesService {
  constructor(
    @InjectRepository(Name)
    private nameRepository: Repository<Name>,
  ) {
  }

  async create(nameDto: NameDto): Promise<Name> {
    const name = this.nameRepository.create(nameDto);
    return await this.nameRepository.save(name);
  }

  async getAllName(currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.nameRepository.findAndCount({
      skip: (currentPage - 1) * limit,
      take: limit,
    });
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      totalPages,
      currentPage,
    };
  }

  async findOne(id: number): Promise<Name> {
    const name = await this.nameRepository.findOneBy({ id });
    if (!name) {
      throw new NotFoundException(`Name with ID ${id} not found`);
    }
    return name;
  }

  async update(id: number, nameDto: NameDto): Promise<Name> {
    const name = await this.findOne(id);
    Object.assign(name, nameDto);
    return this.nameRepository.save(name);
  }

  async remove(id: number): Promise<void> {
    const name = await this.findOne(id);
    await this.nameRepository.remove(name);
  }

  async findByName(
    fullName: string,
    currentPage: number,
    gender?: Gender,
    lan?: Language,
  ) {
    if (!fullName) {
      throw new Error('Full name is required');
    }

    // Tách chuỗi fullName thành các từ riêng biệt (tách theo khoảng trắng)
    const searchTerms = fullName.trim().split(/\s+/);

    // Xây dựng các điều kiện LIKE cho mỗi từ trong fullName
    const likeConditions = searchTerms.map((term) => `name LIKE '%${term}%'`);

    // Tạo truy vấn cơ bản
    const query = this.nameRepository.createQueryBuilder('name');

    // Thêm điều kiện LIKE vào truy vấn
    query.where(likeConditions.join(' AND ')); // Tìm tên có chứa tất cả các từ trong fullName

    // Nếu có filter theo giới tính, thêm điều kiện gender
    if (gender) {
      query.andWhere('name.gender = :gender', { gender });
    }

    // Nếu có filter theo ngôn ngữ, thêm điều kiện lan
    if (lan) {
      query.andWhere('name.lan = :lan', { lan });
    }

    const skip = (currentPage - 1) * PAGINATION.LIMIT;
    query.skip(skip).take(PAGINATION.LIMIT);

    // Thực thi truy vấn và trả về kết quả
    return await query.getMany();
  }
}
