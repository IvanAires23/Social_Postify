import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { cleanDb } from './helpers/clear';
import * as request from 'supertest';
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

describe('PostController (e2e)', () => {
  it('should return 201 to create new post', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: faker.word.words(5),
        text: faker.internet.url(),
      })
      .expect(HttpStatus.CREATED);
  });

  it('should return 200 with all posts', async () => {
    await new CreatePost(prisma).create();
    await new CreatePost(prisma).create();
    await new CreatePost(prisma).create();

    const response = await request(app.getHttpServer()).get('/posts');
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          text: expect.any(String),
        }),
      ]),
    );
  });

  it('should return 200 to find post by id', async () => {
    const post = await new CreatePost(prisma).create();
    const response = await request(app.getHttpServer()).get(
      `/posts/${post.id}`,
    );
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: post.id,
          title: post.title,
          text: post.text,
        }),
      ]),
    );
  });

  it('should return 200 to update post by id', async () => {
    const post = await new CreatePost(prisma).create();
    await request(app.getHttpServer())
      .put(`/posts/${post.id}`)
      .send({
        title: faker.word.words(5),
        text: faker.internet.url(),
      })
      .expect(HttpStatus.OK);
  });

  it('should return 200 to delete post by id', async () => {
    const post = await new CreatePost(prisma).create();
    await request(app.getHttpServer())
      .delete(`/posts/${post.id}`)
      .expect(HttpStatus.OK);
  });
});

describe('Posts: cases errors', () => {
  it('no mandatory fields', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: 'Test',
      })
      .expect(HttpStatus.BAD_REQUEST);

    await request(app.getHttpServer())
      .post('/posts')
      .send({
        text: 'Test',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('return an empty array', async () => {
    const response = await request(app.getHttpServer()).get('/posts');
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveLength(0);
  });

  it('get: record id not found', async () => {
    await new CreatePost(prisma).create();
    const response = await request(app.getHttpServer()).get(`/posts/1`);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('put: record id not found', async () => {
    await new CreatePost(prisma).create();
    const response = await request(app.getHttpServer()).put(`/posts/1`).send({
      title: faker.commerce.department(),
      username: faker.person.firstName(),
    });
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('delete: record id not found', async () => {
    await new CreatePost(prisma).create();
    const response = await request(app.getHttpServer()).delete(`/posts/1`);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('post cannot be deleted', async () => {
    const pubucation = await new CreatePublication(prisma).create();
    const response = await request(app.getHttpServer()).delete(
      `/posts/${pubucation.postId}`,
    );
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });
});
