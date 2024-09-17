import * as dotenv from 'dotenv';
import app from './server';
import config from './config';

dotenv.config();

app.listen(config.port, () => console.log(`Listening on ${config.port}...`));

process.on('uncaughtException', (error) => {
  console.log(error.message);
});
process.on('unhandledRejection', (error) => {
  console.log(error);
});
