import {ConnectionDetails} from "../database/postgres/Sql";

export const getCoronaConnectionDetails = (port: number): ConnectionDetails => {
  return {
    host: 'localhost',
    port: port,
    user: 'postgres',
    password: '',
    database: 'coronapi'
  }
};
