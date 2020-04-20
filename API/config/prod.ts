import {ConnectionDetails} from "../database/postgres/PostgresMigrator";

export const STORE_CONNECTION_DETAILS : ConnectionDetails = {
  host: `/cloudsql/coronapi:us-central1:coronapi`,
  user: 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  database: 'coronapi'
};
