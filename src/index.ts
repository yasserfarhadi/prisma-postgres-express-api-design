import * as dotenv from 'dotenv';
import app from './server';

dotenv.config();

app.listen(3000, () => console.log('Listening on 3000...'));

process.on('uncaughtException', (error) => {
  console.log(error.message);
});
process.on('unhandledRejection', (error) => {
  console.log(error);
});
