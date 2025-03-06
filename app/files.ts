/** @satisfies {import('@webcontainer/api').FileSystemTree} */


export const files = {
  "index.js": {
    file: {
      contents: `
  import express from 'express';
  import dotenv from 'dotenv';
  dotenv.config();
  const app = express();
  const port = 3111;
  
  app.get('/', (req, res) => {
    console.log('port',process.env.PORT)
    res.send('Welcome to a WebContainers app! 🥳,port');
  });
  
  app.listen(port, () => {
    console.log(\`App is live at http://localhost:\${port}\`);
  });`,
    },
  },
  ".env": {
    file: {
      contents: `
    PORT=3000
    `,
    },
  },
  "package.json": {
    file: {
      contents: `
  {
    "name": "example-app",
    "type": "module",
    "dependencies": {
      "express": "latest",
      "nodemon": "latest",
      "dotenv": "latest"
    },
    "scripts": {
      "start": "nodemon --watch './' index.js"
    }
  }`,
    },
  },
};
