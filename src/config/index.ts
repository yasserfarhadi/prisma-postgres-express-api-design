import merge from 'lodash.merge';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const stage = process.env.STAGE || 'local';
let envConfig;

if (stage.trim() === 'production') {
  envConfig = require('./prod').default;
} else if (stage.trim() === 'stagin') {
  envConfig = require('./testing').default;
} else {
  envConfig = require('./local').default;
}

export default merge(
  {
    stage,
    env: process.env.NODE_ENV,
    port: 3000,
    logging: false,
    secrets: {
      jwt: process.env.JWT_SECRET,
      dbUrl: process.env.DATABASE_URL,
    },
  },
  envConfig
);
