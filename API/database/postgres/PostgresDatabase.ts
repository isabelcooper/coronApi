import {Pool, PoolClient} from 'pg';

export class PostgresDatabase {
  constructor(private pool: Pool){}

  public async inTransaction<R>(fn: (client: PoolClient) => Promise<R>) {
    const client = await this.pool.connect();
    await client.query('BEGIN;');

    try {
      const result = await fn(client);
      await client.query('COMMIT;');
      return result;
    } catch (e) {
      await client.query('ROLLBACK;');
      throw e;
    } finally {
      client.release();
    }
  }
}
