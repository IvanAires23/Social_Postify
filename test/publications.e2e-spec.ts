import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { cleanDb } from './helpers/clear';
import * as request from 'supertest';
import { CreateMedia } from './factories/createMedia';
import { faker } from '@faker-js/faker';
import { CreatePublication } from './factories/createPublication';
import { CreatePost } from './factories/createPosts';

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
describe('publicationController (e2e)', () => {
  it('should return 201 to create new publication', async () => {
    const media = await new CreateMedia(prisma).create();
    const post = await new CreatePost(prisma).create();
    await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: media.id,
        postId: post.id,
        date: faker.date.future(),
      })
      .expect(HttpStatus.CREATED);
  });

  it('should return 200 with all publications', async () => {
    await new CreatePublication(prisma).create();
    await new CreatePublication(prisma).create();
    await new CreatePublication(prisma).create();

    const response = await request(app.getHttpServer()).get('/publications');
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          mediaId: expect.any(Number),
          postId: expect.any(Number),
          date: expect.any(String),
        }),
      ]),
    );
  });

  it('should return 200 to find publication by id', async () => {
    const publication = await new CreatePublication(prisma).create();
    const response = await request(app.getHttpServer()).get(
      `/publications/${publication.id}`,
    );
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          mediaId: expect.any(Number),
          postId: expect.any(Number),
          date: expect.any(String),
        }),
      ]),
    );
  });

  it('should return 200 to update publication by id', async () => {
    const publication = await new CreatePublication(prisma).create();
    await request(app.getHttpServer())
      .put(`/publications/${publication.id}`)
      .send({
        mediaId: publication.mediaId,
        postId: publication.postId,
        date: faker.date.future(),
      })
      .expect(HttpStatus.OK);
  });

  it('should return 200 to delete publication by id', async () => {
    const publication = await new CreatePublication(prisma).create();
    await request(app.getHttpServer())
      .delete(`/publications/${publication.id}`)
      .expect(HttpStatus.OK);
  });
});

describe('Publications: cases errors', () => {
  it('no mandatory fields', async () => {
    await request(app.getHttpServer())
      .post('/publications')

      .expect(HttpStatus.BAD_REQUEST);

    await request(app.getHttpServer())
      .post('/publications')
      .send({
        postId: faker.number.int(),
      })
      .expect(HttpStatus.BAD_REQUEST);

    await request(app.getHttpServer())
      .post('/publications')
      .send({
        date: 'Test',
      })
      .expect(HttpStatus.BAD_REQUEST);

    await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: 1,
        postId: 1,
        date: faker.date.anytime(),
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('return an empty array', async () => {
    const response = await request(app.getHttpServer()).get('/publications');
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveLength(0);
  });

  it('get: record id not found', async () => {
    await new CreatePublication(prisma).create();
    const response = await request(app.getHttpServer()).get(`/publications/1`);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('put: record id not found', async () => {
    const publication = await new CreatePublication(prisma).create();
    const response = await request(app.getHttpServer())
      .put(`/publications/1`)
      .send({
        mediaId: 1,
        postId: 1,
        date: faker.date.anytime(),
      });
    expect(response.status).toBe(HttpStatus.NOT_FOUND);

    await request(app.getHttpServer())
      .put(`/publications/${publication.id}`)
      .send({
        mediaId: 1,
        postId: 1,
        date: faker.date.anytime(),
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('put: id already published', async () => {
    const media = await new CreateMedia(prisma).create();
    const post = await new CreatePost(prisma).create();
    const publication = await new CreatePublication(prisma).create(
      faker.date.past(),
    );
    const response = await request(app.getHttpServer())
      .put(`/publications/${publication.id}`)
      .send({
        mediaId: media.id,
        postId: post.id,
        date: faker.date.anytime(),
      });
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('delete: record id not found', async () => {
    await new CreatePublication(prisma).create();
    const response = await request(app.getHttpServer()).delete(
      `/publications/1`,
    );
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });
});
