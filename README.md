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
2. Clone this repository: https://github.com/IvanAires23/Social_Postify.git
3. Install dependencies
```bash
npm install
```
4. Create a PostgreSQL database with whatever name you want
   
5. Configure the .env.development file using the .env.example file (see "Running application locally or inside docker section" for details)

6. Run migrations
```bash
npm run dev:migration:run
```
7. Run with
```bash
npm run start
```
8. You can optionally build the project running
```bash
npm run build
```
9. In your browser, run the application at:
```bash
http://localhost:3000/health
```

## How to run tests

1. Follow the steps in the last section
2. Clone this repository
3. In a .env.test file, define your database environment variable
 ```bash
DATABASE_URL="postgresql://<USERNAME_POSTGRES>:<PASSWORD_POSTGRES>@localhost:5432/<NAME_DATABASE>?schema=public"
```
If you don't already have a PostgreSQL database, create one using this link: https://www.elephantsql.com/ <br/>
4. Run all migrations
  ```bash
  npm run test:migration:run
  ```
5. Run the back-end in a development environment:
  ```bash
  npm run test
  ```

