import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditElectorDto } from './dto';
import { Multer } from 'multer';
import * as csvParser from 'csv-parser';
import * as argon2 from 'argon2';
import { Readable } from 'stream';


@Injectable()
export class ElectorService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllElectors() {
    const users = await this.prisma.elector.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        birthDate: true,
        birthPlace: true,
        idCardNumber: true,
        createdAt: true,
        email: true,
      },
    });

    return users;
  }

  async editElector(
    dto: EditElectorDto,
  ) {
    const user = await this.prisma.elector.update({
      where: {
        id: dto.id,
      },
      data: {
        ...dto,
      },
    });

    delete user.password;

    return user;
  }

  async deleteElector(userId: number) {
    const user = await this.prisma.elector.delete({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async importCSV(file: Multer.File) {
    const results: any[] = [];
  
    return new Promise((resolve, reject) => {
      Readable.from(file.buffer)
        .pipe(csvParser())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', async () => {
          try {
            for (const user of results) {
              user.password = await argon2.hash(user.password);
  
              await this.prisma.elector.create({
                data: {
                  name: user.name,
                  surname: user.surname,
                  birthDate: new Date(user.birthDate),
                  birthPlace: user.birthPlace,
                  idCardNumber: user.idCardNumber,
                  password: user.password,
                  email: user.email,
                },
              });
            }
            resolve(results);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }
}
