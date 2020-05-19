[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/isabelcooper/coronApi/blob/master/LICENSE)

# Covid Travel Store
Open source store mechanism to store and retrieve travel statuses to a given database. WIP

## To read from the DB:
Import the npm library `npm i covid-travel-ban`

Run start() with the StatusReader and StatusWriter
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
You can then hit the endpoints to read 

GET travel status 
`curl -X GET https://yourHostedServer.com/status` 

GET travel status by country 
`curl -X GET https://yourHostedServer.com/status/{country}`

Updates to the data require auth, so please contact me for access. 

POST travel status 
`curl -X POST https://yourHostedServer.com/status -H 'authorization: Basic %{encodedCredentials}'` 

POST travel-bans by country 
`curl -X POST https://yourHostedServer.com/status/{country} -H 'authorization: Basic %{encodedCredentials}'`

NB a 'travel-ban' is designed for a specific format (still under development) and doesn't conform to the travelStatuses elsewhere. It is restructured duruing the storage process.


## For contributors: 
See main README [main repo](!https://github.com/isabelcooper/coronApi) to contribute - this contains both the API and UI projects, but a single run script currently controls both. 

