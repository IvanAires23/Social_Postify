import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { cleanDb } from './healpers';
import { CreateMedia } from './factories/createMedia';
import { createPost } from './factories/createPosts';
import { faker } from '@faker-js/faker';
import { createPublication } from './factories/createPublication';

let app: INestApplication;
let prisma: PrismaService

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe())
  app.init()
})

beforeEach(async () => {
  prisma = app.get(PrismaService)
  await cleanDb(prisma)
})

describe('AppController (e2e)', () => {

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect("Hello World!");
  });

});

describe('HealthController (e2e)', () => {

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect("I'm okay!");
  });

});


describe('MediaController (e2e)', () => {
  it('should return 201 to create new media', async () => {
    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: 'Test',
        username: 'Test'
      })
      .expect(HttpStatus.CREATED)

    const medias = await prisma.media.findMany()
    expect(medias).toHaveLength(1)
    const media = medias[0]
    expect(media).toEqual({
      id: expect.any(Number),
      title: 'Test',
      username: 'Test'
    })
  });

  it('should return 200 with all medias', async () => {
    await new CreateMedia(prisma).create()
    await new CreateMedia(prisma).create()
    await new CreateMedia(prisma).create()

    const response = await request(app.getHttpServer()).get('/medias')
    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        username: expect.any(String)
      })]))
  });

  it('should return 200 to find media by id', async () => {
    const media = await new CreateMedia(prisma).create()
    const response = await request(app.getHttpServer()).get(`/medias/${media.id}`)
    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: media.id,
        title: media.title,
        username: media.username
      })]))
  });

  it('should return 200 to update media by id', async () => {
    const media = await new CreateMedia(prisma).create()
    await request(app.getHttpServer()).put(`/medias/${media.id}`)
      .send({
        title: faker.commerce.department(),
        username: faker.person.firstName()
      })
      .expect(HttpStatus.OK)
  });

  it('should return 200 to delete media by id', async () => {
    const media = await new CreateMedia(prisma).create()
    await request(app.getHttpServer()).delete(`/medias/${media.id}`)
      .expect(HttpStatus.OK)
  })
})

describe('Media: error cases', () => {
  it('no mandatory fields', async () => {
    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: 'Test'
      })
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post('/medias')
      .send({
        username: 'Test'
      })
      .expect(HttpStatus.BAD_REQUEST)
  });

  it('post: registration with the same combination', async () => {
    const title = 'Test'
    const username = 'Test'
    new CreateMedia(prisma).title = title
    new CreateMedia(prisma).username = username
    await new CreateMedia(prisma).create()

    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: 'Test',
        username: 'Test'
      })
    expect(HttpStatus.CONFLICT)
  })

  it('return an empty array', async () => {
    const response = await request(app.getHttpServer()).get('/medias')
    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toHaveLength(0)
  })

  it('get: record id not found', async () => {
    await new CreateMedia(prisma).create()
    const response = await request(app.getHttpServer()).get(`/medias/1`)
    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('put: record id not found', async () => {
    const response = await request(app.getHttpServer()).put(`/medias/1`)
      .send({
        title: faker.commerce.department(),
        username: faker.person.firstName()
      })
    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('put: registration with the same combination', async () => {
    const title = 'Test'
    const username = 'Test'
    new CreateMedia(prisma).title = title
    new CreateMedia(prisma).username = username
    const media = await new CreateMedia(prisma).create()

    await request(app.getHttpServer())
      .put(`/medias/${media.id}`)
      .send({
        title: 'Test',
        username: 'Test'
      })
    expect(HttpStatus.CONFLICT)
  })

  it('delete: record id not found', async () => {
    const response = await request(app.getHttpServer()).delete(`/medias/1`)
    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('media cannot be deleted', async () => {
    const pubucation = await createPublication(prisma)
    const response = await request(app.getHttpServer()).delete(`/medias/${pubucation.mediaId}`)
    expect(response.status).toBe(HttpStatus.FORBIDDEN)
  })
})

describe('PostController (e2e)', () => {
  it('should return 201 to create new post', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: faker.word.words(5),
        text: faker.internet.url()
      })
      .expect(HttpStatus.CREATED)
  });

  it('should return 200 with all posts', async () => {
    await createPost(prisma)
    await createPost(prisma)
    await createPost(prisma)

    const response = await request(app.getHttpServer()).get('/posts')
    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toMatchObject(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        text: expect.any(String)
      })]))
  });

  it('should return 200 to find post by id', async () => {
    const post = await createPost(prisma)
    const response = await request(app.getHttpServer()).get(`/posts/${post.id}`)
    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: post.id,
        title: post.title,
        text: post.text
      })]))
  });

  it('should return 200 to update post by id', async () => {
    const post = await createPost(prisma)
    await request(app.getHttpServer()).put(`/posts/${post.id}`)
      .send({
        title: faker.word.words(5),
        text: faker.internet.url()
      })
      .expect(HttpStatus.OK)
  });

  it('should return 200 to delete post by id', async () => {
    const post = await createPost(prisma)
    await request(app.getHttpServer()).delete(`/posts/${post.id}`)
      .expect(HttpStatus.OK)
  })
})

describe('Posts: cases errors', () => {
  it('no mandatory fields', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: 'Test'
      })
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post('/posts')
      .send({
        text: 'Test'
      })
      .expect(HttpStatus.BAD_REQUEST)
  });

  it('return an empty array', async () => {
    const response = await request(app.getHttpServer()).get('/posts')
    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toHaveLength(0)
  })

  it('get: record id not found', async () => {
    await createPost(prisma)
    const response = await request(app.getHttpServer()).get(`/posts/1`)
    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('put: record id not found', async () => {
    await createPost(prisma)
    const response = await request(app.getHttpServer()).put(`/posts/1`)
      .send({
        title: faker.commerce.department(),
        username: faker.person.firstName()
      })
    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('delete: record id not found', async () => {
    await createPost(prisma)
    const response = await request(app.getHttpServer()).delete(`/posts/1`)
    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('post cannot be deleted', async () => {
    const pubucation = await createPublication(prisma)
    const response = await request(app.getHttpServer()).delete(`/posts/${pubucation.postId}`)
    expect(response.status).toBe(HttpStatus.FORBIDDEN)
  })
})

describe('publicationController (e2e)', () => {
  it('should return 201 to create new publication', async () => {
    const media = await new CreateMedia(prisma).create()
    const post = await createPost(prisma)
    await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: media.id,
        postId: post.id,
        date: faker.date.future()
      })
      .expect(HttpStatus.CREATED)
  });

  it('should return 200 with all publications', async () => {
    await createPublication(prisma)
    await createPublication(prisma)
    await createPublication(prisma)

    const response = await request(app.getHttpServer()).get('/publications')
    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toMatchObject(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        mediaId: expect.any(Number),
        postId: expect.any(Number),
        date: expect.any(String)
      })]))
  });

  it('should return 200 to find publication by id', async () => {
    const publication = await createPublication(prisma)
    const response = await request(app.getHttpServer()).get(`/publications/${publication.id}`)
    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        mediaId: expect.any(Number),
        postId: expect.any(Number),
        date: expect.any(String)
      })]))
  });

  it('should return 200 to update publication by id', async () => {
    const publication = await createPublication(prisma)
    await request(app.getHttpServer()).put(`/publications/${publication.id}`)
      .send({
        mediaId: publication.mediaId,
        postId: publication.postId,
        date: faker.date.future()
      })
      .expect(HttpStatus.OK)
  });

  it('should return 200 to delete publication by id', async () => {
    const publication = await createPublication(prisma)
    await request(app.getHttpServer()).delete(`/publications/${publication.id}`)
      .expect(HttpStatus.OK)
  })
})

describe('Publications: cases errors', () => {
  it('no mandatory fields', async () => {
    await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: faker.number.int()
      })
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post('/publications')
      .send({
        postId: faker.number.int()
      })
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post('/publications')
      .send({
        date: 'Test'
      })
      .expect(HttpStatus.BAD_REQUEST)

    await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: 1,
        postId: 1,
        date: faker.date.anytime()
      })
      .expect(HttpStatus.NOT_FOUND)

  });

  it('return an empty array', async () => {
    const response = await request(app.getHttpServer()).get('/publications')
    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toHaveLength(0)
  })

  it('get: record id not found', async () => {
    await createPublication(prisma)
    const response = await request(app.getHttpServer()).get(`/publications/1`)
    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('put: record id not found', async () => {
    const publication = await createPublication(prisma)
    const response = await request(app.getHttpServer()).put(`/publications/1`)
      .send({
        mediaId: 1,
        postId: 1,
        date: faker.date.anytime()
      })
    expect(response.status).toBe(HttpStatus.NOT_FOUND)

    await request(app.getHttpServer())
      .put(`/publications/${publication.id}`)
      .send({
        mediaId: 1,
        postId: 1,
        date: faker.date.anytime()
      })
      .expect(HttpStatus.NOT_FOUND)
  })

  it('put: id already published', async () => {
    const media = await new CreateMedia(prisma).create()
    const post = await createPost(prisma)
    const publication = await createPublication(prisma, faker.date.past())
    const response = await request(app.getHttpServer()).put(`/publications/${publication.id}`)
      .send({
        mediaId: media.id,
        postId: post.id,
        date: faker.date.anytime()
      })
    expect(response.status).toBe(HttpStatus.FORBIDDEN)
  })

  it('delete: record id not found', async () => {
    await createPublication(prisma)
    const response = await request(app.getHttpServer()).delete(`/publications/1`)
    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })
})
