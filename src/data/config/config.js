import config from '../../../src/config'
let { db } = config;

export default {
  "development": {
    "username": db.user,
    "password": db.password,
    "database": db.name,
    "host": db.host,
    "port": db.port,
    "dialect": "postgres"
  }
}
