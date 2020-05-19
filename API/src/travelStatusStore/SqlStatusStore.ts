import {StatusReader, StatusWriter} from "./StatusStore";
import {column, generateSqlInsert, SqlMapper, TableSchema} from "../../database/postgres/Sql";
import {TravelStatus} from "./TravelStatus";
import {PostgresDatabase} from "../../database/postgres/PostgresDatabase";

export const travelStatusTableSchema: TableSchema<TravelStatus> =
  {
  tableName: 'travel_status',
  fields: {
    iso: column('iso'),
    country: column('country'),
    domesticTravel: column('domestic_travel'),
    noEntryCountries: column('no_entry_countries'),
    quarantineOnArrival: column('quarantine'),
    startDate: column('start_date'),
    updated: column('updated')
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

  public async read(country: string): Promise<TravelStatus | null> {
    return await this.database.inTransaction(async (client) => {
      const row = (await client.query(
        `SELECT * FROM current_travel_status WHERE country = '${country}';`
      )).rows[0];
      return this.mapper.map(row);
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

  public async storeAll(travelStatuses: TravelStatus[]): Promise<void> {
    return this.database.inTransaction(async (client) => {
      for (const travelStatus of travelStatuses) {
        await client.query(generateSqlInsert(travelStatus, travelStatusTableSchema))
      }
    });
  }

}
