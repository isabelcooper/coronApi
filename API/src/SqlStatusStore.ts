import {Status, StatusReader, StatusWriter} from "./StatusStore";
import {column, generateSqlInsert, SqlMapper, TableSchema} from "../database/postgres/Sql";
import {PostgresDatabase} from "../database/postgres/PostgresDatabase";

export const statusSchema: TableSchema<Status> =
  {
  tableName: 'status',
  fields: {
    country: column('country'),
    flightStatus: column('flight_status'),
    // excludedDestinations: column('excluded_destinations'),
    travelAdvice: column('travel_advice'),
    updated: column('updated'),
  }
};


export class SqlStatusReader implements StatusReader {
  protected mapper = new SqlMapper(statusSchema);

  constructor(private database: PostgresDatabase) {

  }

  public async readAll(): Promise<Status[]> {
    return await this.database.inTransaction(async (client) => {
      const rows = (await client.query(
        'SELECT * FROM status ORDER BY updated DESC'
      )).rows;
      return this.mapper.mapAll(rows);
    });
  }

}

export class SqlStatusWriter implements StatusWriter {
  constructor(private database: PostgresDatabase) {

  }

  store(status: Status): Promise<void> {
    return this.database.inTransaction(async (client) => {
      await client.query(generateSqlInsert(status, statusSchema))
    });
  }

}
