[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/isabelcooper/coronApi/blob/master/LICENSE)

## Covid Travel Store

Open source store mechanism to store and retrieve travel statuses to a given database. WIP


to start the server with your database, run start() with the StatusReader and StatusWriter
```
start(statusWriter: StatusWriter, statusReader: StatusReader)
```
```
export interface StatusWriter {
  store(status: TravelStatus): Promise<void>;
}

export interface StatusReader {
  readAll(): Promise<TravelStatus[]>;

  read(country: string): Promise<TravelStatus | null>;
}

```
