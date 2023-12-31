# Social Postify

Social Postify is an online tool that allows users to create and design content for various social networks, including Facebook, Instagram, Twitter, LinkedIn and others. Users can customize their posts with images, titles, and text, and schedule them for specific dates and times. This platform also allows you to schedule multiple posts and offers an overview of scheduled posts.

Try it out now at: https://socialpostifyapi.onrender.com

## About

To reinforce the presence of companies on social media, it is necessary to have an effective tool that allows you to plan, manage and monitor entries on different social media platforms. Below are the implemented features:

 - Medias: represent the social networks on which the publications will be made.
 - Posts: Posts represent content that will be published on social media through a post
 - Publications: Posts are social media posting schedules
 - integration tests

Future features that will be implemented:
  - email sending
  - unitary tests
  - Documentation
    
## Technologies
The following tools and frameworks were used in the construction of the project:<br>
<p>
    <img  height="30" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
    <img  height="30" src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white"/>
    <img  height="30" src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
    <img  height="30" src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"/>
    <img  height="30" src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white"/>
</p>

## How to run

1. This project was developed in Vite, therefore it requires Node.js version 14.18+, 16+. However, some templates require a higher version of Node.js to work
   *If necessary, install Node.js from this link: https://nodejs.org/en
2. Clone this repository
3. Install dependencies
```bash
npm install
```
4. Create a PostgreSQL database with whatever name you want
   
5. Configure the .env file using the .env.example file (see "Running application locally or inside docker section" for details)

6. Generate migrations
```bash
npm run dev:migration:generate
```

7. Run migrations
```bash
npm run dev:migration:run
```
8. Run with
```bash
npm run start
```
9. You can optionally build the project running
```bash
npm run build
```
10. In your browser, run the application at:
```bash
http://localhost:3000/health
```

## How to run tests

1. Follow the steps in the last section
2. Clone this repository
3. Install dependencies
```bash
npm install
```
4. Create a PostgreSQL database with whatever name you want
   
5. Configure the .env.test file using the .env.example file (see "Running application locally or inside docker section" for details)

6. Run all migrations
  ```bash
  npm run test:migration:run
  ```
7. Run the back-end in a development environment:
  ```bash
  npm run test:e2e
  ```

