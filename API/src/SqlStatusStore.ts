import {StatusReader, StatusWriter} from "./StatusStore";
import {column, generateSqlInsert, SqlMapper, TableSchema} from "../database/postgres/Sql";
import {PostgresDatabase} from "../database/postgres/PostgresDatabase";
import {TravelStatus} from "../../shared/TravelStatus";

export const travelStatusTableSchema: TableSchema<TravelStatus> =
  {
  tableName: 'travel_status',
  fields: {
    country: column('country'),
    flightStatus: column('flight_status'),
    // excludedDestinations: column('excluded_destinations'),
    travelAdvice: column('travel_advice'),
    updated: column('updated'),
  }
};


export class SqlStatusReader implements StatusReader {
  protected mapper = new SqlMapper(travelStatusTableSchema);

  constructor(private database: PostgresDatabase) {

  }

  public async readAll(): Promise<TravelStatus[]> {
    return await this.database.inTransaction(async (client) => {
      const rows = (await client.query(
        'SELECT * FROM current_travel_status;'
      )).rows;
      return this.mapper.mapAll(rows);
    });
  }

}

export class SqlTravelStatusWriter implements StatusWriter {
  constructor(private database: PostgresDatabase) {

  }

  store(status: TravelStatus): Promise<void> {
    return this.database.inTransaction(async (client) => {
      await client.query(generateSqlInsert(status, travelStatusTableSchema))
    });
  }

}
