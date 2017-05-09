import { db } from '../../../src/config'

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
