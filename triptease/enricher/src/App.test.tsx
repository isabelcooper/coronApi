import React, {PureComponent, SyntheticEvent} from 'react';
import './App.css';
import ResultsTable from "./Results";
import {InMemoryMetaInfoFinder, MetaInfoFinder} from "./MetaInfoFinder/PuppeteerMetaInfoFinder";

export interface HotelMetaInfo {
  name: string;
  address: string;
  country: string;
  roomCount?: number;
  rating: number;
}

export interface HotelSiteInfo {
  competitors: string[];
}


async function getHotelSiteInfo(): Promise<HotelSiteInfo> {
  return {
    competitors: ['comp 1', 'comp2']
  }
}

export interface Hotel {
  hotelName?: string;
  hotelUrl?: string;
  hotelMetaInfo?: HotelMetaInfo | undefined;
  hotelSiteInfo?: HotelSiteInfo;
}


interface EnricherPageProps {
  metaInfoFinder: MetaInfoFinder;
}

export default class App extends PureComponent<EnricherPageProps, {}> {
  state: Hotel = {};

  constructor(props: any) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.metaInfoFinder = new InMemoryMetaInfoFinder()
  }

  handleChange(event: SyntheticEvent<HTMLInputElement>) {
    const target = event.target as HTMLTextAreaElement;
    this.setState(prevState => {
      return {
        ...prevState,
        [target.name]: target.value
      }
    });
  }

  handleSubmit(event: any) {
    event.preventDefault(); // WHY
    this.setState(prevState => {
      return {
        ...prevState,
        hotelMetaInfo: this.getHotelMetaInfo(),
        hotelSiteInfo: getHotelSiteInfo(),
      }
    });
  }

  async getHotelMetaInfo(): Promise<HotelMetaInfo | undefined> {
    return this.state.hotelName
      ? await this.props.metaInfoFinder.findMetaInfo(this.state.hotelName)
      : undefined;
  }

  render() {
    return (
      <div className="App">
        <h1>Enricher</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Hotel Name:
            <input name="hotelName" type="text" value={this.state.hotelName} onChange={this.handleChange}/>
          </label>
          <label>
            Url:
            <input name="hotelUrl" type="text" value={this.state.hotelUrl} onChange={this.handleChange}/>
          </label>
          <input type="submit" value="Go"/>
        </form>

        <ResultsTable hotel={this.state}/>
      </div>
    );
  }


}
