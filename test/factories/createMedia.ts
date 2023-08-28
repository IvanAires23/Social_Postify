import { PrismaService } from "../../src/prisma/prisma.service";
import { faker } from '@faker-js/faker';

export class CreateMedia {
    private prisma: PrismaService;
    private _title: string;
    private _username: string;

    constructor(prisma: PrismaService) {
        this.prisma = prisma;
    }

    set title(title: string) {
        this._title = title
    }

    set username(username: string) {
        this._username = username
    }

    async create() {
        return this.prisma.media.create({
            data: {
                title: this._title ? this._title : faker.company.buzzAdjective(),
                username: this._username ? this._username : faker.person.firstName()
            }
        })
    }
}