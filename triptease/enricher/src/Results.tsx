import React, {SyntheticEvent} from 'react';
import styled from 'styled-components';
import './App.css';

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

function getHotelMetaInfo(): HotelMetaInfo {
  return {
    country: 'england',
    roomCount: 1,
    name: "hotelNameAgain",
    rating: 0,
    address: "123 road",
  }
}

function getHotelSiteInfo(): HotelSiteInfo {
  return {
    competitors: ['comp 1', 'comp2']
  }
}

interface Hotel {
  hotelName?: string;
  hotelUrl?: string;
  hotelMetaInfo?: HotelMetaInfo | undefined;
  hotelSiteInfo?: HotelSiteInfo;
}

const SubheaderSpan = styled.span`
  text-transform: capitalize;
  color: #5e43c2;
  padding-right: 20px;
`;

export default class App extends React.Component<{}> {
  state: Hotel = {};

  constructor(props: any) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        hotelMetaInfo: getHotelMetaInfo(),
        hotelSiteInfo: getHotelSiteInfo(),
      }
    });
  }

  render() {
    console.log('*', this.state);
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

        <ResultsTable hotel={this.state}>

        <div>
          <table className={"flex-table"}>
            <tr>
              {this.state.hotelName && <th>Hotel Name</th>}
              {this.state.hotelName && <td>{this.state.hotelName}</td>}
            </tr>
            <tr>
              {this.state.hotelUrl && <th>Hotel Url</th>}
              {this.state.hotelUrl && <td>{this.state.hotelUrl}</td>}
            </tr>
            <tr>
              {this.state.hotelMetaInfo && <th>Hotel Meta</th>}
              {
                this.state.hotelMetaInfo &&
                <td>
                  {
                    Object.entries(this.state.hotelMetaInfo).map(([key, value]) => {
                      return <tr><SubheaderSpan>{key}:</SubheaderSpan>{ value}</tr>
                    })
                  }
                </td>
              }
            </tr>
            <tr>
              {this.state.hotelSiteInfo && <th>Hotel Site Info</th>}
              {
                this.state.hotelSiteInfo &&
                this.state.hotelSiteInfo.competitors &&
                <td><SubheaderSpan>Competitors:</SubheaderSpan>
                    <tr>{Object.values(this.state.hotelSiteInfo.competitors).map(competitor => competitor).join(', ')}</tr>
                </td>
              }
            </tr>
          </table>
        </div>
      </div>
    );
  }


}
