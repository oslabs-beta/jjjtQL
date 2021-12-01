import express, { Application, Request, Response, NextFunction } from 'express';
import Router from './router';

const path = require('path');
// require('dotenv').config();

const PORT = 3000;
const app: Application = express();

// handle parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// production build static serve
if (process.env.NODE_ENV === 'production') {
  // statically serve everything in the build folder on the route '/build'
  app.use('/build', express.static(path.join(__dirname, '../build')));
  // serve index.html on the route '/'
  app.get('/', (req: Request, res: Response) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });
}

// route to router file
app.use('/', Router);

// catch-all route handler
app.use('*', (req: Request, res: Response) => res.status(400).send('This is not the page you\'re looking for...'));

// global error handler
app.use((err, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = { ...defaultErr, ...err };
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(3000, () => {
  console.log(`⚡Server is listening on port ${PORT}... 🚀`);
});