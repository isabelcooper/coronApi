import {QueryConfig} from 'pg';

export type ConnectionDetails = {
  host: string,
  port: number,
  user: string,
  password: string,
  database: string
}

export interface ColumnDefinition {
  fieldName: string,
  toSqlConverter: (value: any) => any
}

type ColumnDefinitions<T> = { [key in keyof T]: ColumnDefinition };

export interface TableSchema<T> {
  tableName: string;
  fields: ColumnDefinitions<T>;
}

export const passThroughConversion = (value: any) => value;
export const passThroughIfDefinedConversion = (value: any) => value !== undefined ? value : null;
export const stringToSqlInteger = (value: string) => value && parseInt(value);
export const stringToSqlFloat = (value: string) => value && parseFloat(value);
export const stringToSqlString = (value: string) => value && `'${value}'`;
// export const stringEstDateToUtcString = (value: string) => value && `'${Dates.format(moment.tz(value, 'America/New_York').utc().toDate(), 'YYYY-MM-DD HH:mm:ss')}'`;
// export const dateToUtcString = (value: Date) => value && `'${Dates.format(value, Dates.YYYY_DASH_MM_DASH_DD_HH_MM_SS)}'`;

export function column(fieldName: string, toSqlConverter: (value: any) => any = passThroughConversion) {
  return {
    fieldName,
    toSqlConverter
  }
}
const getKeys = <T extends {}>(o: T): Array<keyof T> => <Array<keyof T>>Object.keys(o);

export class SqlInsertBuilder<T> {
  private tableSchema: TableSchema<T> | undefined;
  private chunk: T | undefined;
  private onConflict: string = '';

  public table(tableSchema: TableSchema<T>) {
    this.tableSchema = tableSchema;
    return this;
  }

  public insert(chunk: T) {
    this.chunk = chunk;
    return this;
  }

  public onConflictDoNothing() {
    this.onConflict = 'ON CONFLICT DO NOTHING';
    return this;
  }

  public onConflictUpdate(conflictingFields: ColumnDefinition[]) {
    const fieldsAndValues = this.getFieldsAndValues();
    this.onConflict = `ON CONFLICT (${conflictingFields.map(cd => cd.fieldName).join(',')}) DO UPDATE SET ${fieldsAndValues.fieldNames.map(field => field + ' = EXCLUDED.' + field).join(', ')}`;
    return this;
  }

  public build(): QueryConfig {
    if (this.tableSchema && this.chunk) {
      const fieldsAndValues = this.getFieldsAndValues();
      return {
        text: `INSERT INTO ${this.tableSchema.tableName} (${fieldsAndValues.fieldNames.join(', ')}) VALUES (${fieldsAndValues.fieldNames.map((_name, index) => '$' + (index+1))}) ${this.onConflict};`,
        values:fieldsAndValues.values
      }
    }
    throw new Error('somethings wrong with your SQL builder.');
  }

  public getFieldsAndValues() {
    const fields: ColumnDefinitions<T> = this.tableSchema!.fields;
    const chunk = this.chunk;
    return getKeys(fields).reduce((fieldsAndValues: { fieldNames: string[], values: any[] }, fieldName) => {
      const columnDefinition = fields[fieldName];
      return {
        fieldNames: [...fieldsAndValues.fieldNames, columnDefinition.fieldName],
        values: [...fieldsAndValues.values, columnDefinition.toSqlConverter(chunk![fieldName])]
      }
    }, {
      fieldNames: [],
      values: []
    });
  }
}
export class SqlUpsertBuilder<T> {
  private tableSchema: TableSchema<T> | undefined;
  private chunk: Partial<T> | undefined;
  private onConflict: string = '';

  public table(tableSchema: TableSchema<T>) {
    this.tableSchema = tableSchema;
    return this;
  }

  public insert(chunk: Partial<T>) {
    this.chunk = chunk;
    return this;
  }

  public onConflictDoNothing() {
    this.onConflict = 'ON CONFLICT DO NOTHING';
    return this;
  }

  public onConflictUpdate(conflictingFields: ColumnDefinition[]) {
    const fieldsAndValues = this.getFieldsAndValues();
    this.onConflict = `ON CONFLICT (${conflictingFields.map(cd => cd.fieldName).join(',')}) DO UPDATE SET ${fieldsAndValues.fieldNames.map(field => field + ' = EXCLUDED.' + field).join(', ')}`;
    return this;
  }

  public build(): QueryConfig {
    if (this.tableSchema && this.chunk) {
      const fieldsAndValues = this.getFieldsAndValues();
      return {
        text: `INSERT INTO ${this.tableSchema.tableName} (${fieldsAndValues.fieldNames.join(', ')}) VALUES (${fieldsAndValues.fieldNames.map((_name, index) => '$' + (index+1))}) ${this.onConflict};`,
        values:fieldsAndValues.values
      }
    }
    throw new Error('somethings wrong with your SQL builder.');
  }

  public getFieldsAndValues() {
    const fields: ColumnDefinitions<T> = this.tableSchema!.fields;
    const chunk = this.chunk!;
    return getKeys(chunk).reduce((fieldsAndValues: { fieldNames: string[], values: any[] }, fieldName) => {
      const columnDefinition = fields[fieldName];
      if(!columnDefinition) { return fieldsAndValues }
      return {
        fieldNames: [...fieldsAndValues.fieldNames, columnDefinition.fieldName],
        values: [...fieldsAndValues.values, columnDefinition.toSqlConverter(chunk![fieldName])]
      }
    }, {
      fieldNames: [],
      values: []
    });
  }
}

export class SqlQueryBuilder<T> {
  private tableSchema: TableSchema<T> | undefined;

  public table(tableSchema: TableSchema<T>) {
    this.tableSchema = tableSchema;
    return this;
  }

  public build(): QueryConfig {
    if (this.tableSchema) {
      const fieldsAndValues = this.getFields();
      return {
        text: `SELECT ${fieldsAndValues.fieldNames.join(', ')} FROM ${this.tableSchema.tableName};`,
        values:[]
      }
    }
    throw new Error('somethings wrong with your SQL builder.');
  }

  private getFields() {
    const fields: ColumnDefinitions<T> = this.tableSchema!.fields;
    return getKeys(fields).reduce((fieldsAndValues: { fieldNames: string[] }, fieldName) => {
      const columnDefinition = fields[fieldName];
      return {
        fieldNames: [...fieldsAndValues.fieldNames, columnDefinition.fieldName],
      }
    }, {
      fieldNames: []
    });
  }

}

export class SqlMapper<T> {
  constructor(private schema: TableSchema<T>){}

  public map(row: any): T {
    return getKeys(this.schema.fields).reduce((agg: Partial<T>, key: keyof T) => {
      const field = this.schema.fields[key];
      agg[key] = field.toSqlConverter(row[field.fieldName]);
      return agg;
    }, {}) as T;
  }

  public toRow(data: T):  {[key: string]: any} {
    return getKeys(data).reduce((agg: {[key: string]: any}, key: keyof T) => {
      const valueAtKey = data[key];
      const rowName = this.schema.fields[key].fieldName;
      agg[rowName] = valueAtKey;
      return agg;
    }, {});
  }

  public mapAll(rows: any[]): T[] {
    return rows.map(row => {
      return this.map(row)
    });
  }

  public toRows(data: T[]): any[] {
    return data.map(row => {
      return this.toRow(row)
    });
  }
}

export function generateSqlInsert<T>(chunk: T, tableSchema: TableSchema<T>) {
  return new SqlInsertBuilder()
    .table(tableSchema)
    .insert(chunk)
    .onConflictDoNothing()
    .build();
}

export function generateSqlUpsert<T>(chunk: Partial<T>, tableSchema: TableSchema<T>, conflictingFields: ColumnDefinition[]) {
  return new SqlUpsertBuilder()
    .table(tableSchema)
    .insert(chunk)
    .onConflictUpdate(conflictingFields)
    .build();
}

//generate sql upsert (given partial)
