import {ConnectionDetails} from "../database/postgres/PostgresMigrator";

export const getCoronaConnectionDetails = (port: number): ConnectionDetails => {
  return {
    host: 'localhost',
    port: port,
    user: 'postgres',
    password: '',
    database: 'coronapi'
  }
};
