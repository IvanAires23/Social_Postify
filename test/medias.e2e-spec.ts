import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { cleanDb } from './helpers/clear';
import * as request from 'supertest';
import { CreateMedia } from './factories/createMedia';
import { faker } from '@faker-js/faker';
import { CreatePublication } from './factories/createPublication';

let app: INestApplication;
let prisma: PrismaService;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  app.init();
});

beforeEach(async () => {
  prisma = app.get(PrismaService);
  await cleanDb(prisma);
});

describe('MediaController (e2e)', () => {
  it('should return 201 to create new media', async () => {
    const title = faker.lorem.word();
    const username = faker.person.firstName();
    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title,
        username,
      })
      .expect(HttpStatus.CREATED);

    const medias = await prisma.media.findMany();
    expect(medias).toHaveLength(1);
    const media = medias[0];
    expect(media).toEqual({
      id: expect.any(Number),
      title,
      username,
    });
  });

  it('should return 200 with all medias', async () => {
    await new CreateMedia(prisma).create();
    await new CreateMedia(prisma).create();
    await new CreateMedia(prisma).create();

    const response = await request(app.getHttpServer()).get('/medias');
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          username: expect.any(String),
        }),
      ]),
    );
  });

  it('should return 200 to find media by id', async () => {
    const media = await new CreateMedia(prisma).create();
    const response = await request(app.getHttpServer()).get(
      `/medias/${media.id}`,
    );
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: media.id,
        title: media.title,
        username: media.username,
      }),
    );
  });

  it('should return 200 to update media by id', async () => {
    const media = await new CreateMedia(prisma).create();
    await request(app.getHttpServer())
      .put(`/medias/${media.id}`)
      .send({
        title: faker.commerce.department(),
        username: faker.person.firstName(),
      })
      .expect(HttpStatus.OK);
  });

  it('should return 200 to delete media by id', async () => {
    const media = await new CreateMedia(prisma).create();
    await request(app.getHttpServer())
      .delete(`/medias/${media.id}`)
      .expect(HttpStatus.OK);
  });
});

describe('Media: error cases', () => {
  it('post: no mandatory fields', async () => {
    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: faker.lorem.word(),
      })
      .expect(HttpStatus.BAD_REQUEST);

    await request(app.getHttpServer())
      .post('/medias')
      .send({
        username: faker.person.firstName(),
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('post: when the title is already associated with the user', async () => {
    const title = faker.lorem.word();
    const username = faker.person.firstName();
    await new CreateMedia(prisma, title, username).create();

    const response = await request(app.getHttpServer()).post('/medias').send({
      title,
      username,
    });
    expect(response.status).toBe(HttpStatus.CONFLICT);
  });

  it('get: return an empty array', async () => {
    const response = await request(app.getHttpServer()).get('/medias');
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveLength(0);
  });

  it('get: record id not found', async () => {
    await new CreateMedia(prisma).create();
    const response = await request(app.getHttpServer()).get(`/medias/1`);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('put: record id not found', async () => {
    const response = await request(app.getHttpServer()).put(`/medias/1`).send({
      title: faker.commerce.department(),
      username: faker.person.firstName(),
    });
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('put: registration with the same combination', async () => {
    const title = faker.lorem.word();
    const username = faker.person.firstName();
    const media = await new CreateMedia(prisma, title, username).create();

    await request(app.getHttpServer()).put(`/medias/${media.id}`).send({
      title,
      username,
    });
    expect(HttpStatus.CONFLICT);
  });

  it('delete: record id not found', async () => {
    const response = await request(app.getHttpServer()).delete(`/medias/1`);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('media cannot be deleted', async () => {
    const pubucation = await new CreatePublication(prisma).create();
    const response = await request(app.getHttpServer()).delete(
      `/medias/${pubucation.mediaId}`,
    );
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });
});
