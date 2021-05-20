import { Component, h } from 'preact';
import { HotelSiteInfo, HotelMetaInfo } from './PuppeteerMetaInfoFinder';

export interface HootlePageProps {
  search: string;
  url: string;
  metaInfo?: HotelMetaInfo;
  siteInfo?: HotelSiteInfo;
}

export class HootlePage extends Component<HootlePageProps> {
  render() {
    console.log(this.props);
    return (
      <html>
        <head>
          <title>Welcome to Hootle</title>
          <link href="http://fonts.googleapis.com/css?family=Roboto:400,500" rel="stylesheet" type="text/css" />
          <link rel="stylesheet" href={'/hootle/static/styles.css')} />
          <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
        </head>

        <body>
          <section>
            <h1>
              <span style={{ color: '#fff' }}>Hootle</span>
            </h1>
            <div class="flex">
              <form
                method="POST"
                action={"/"}
                encType="application/x-www-form-urlencoded"
                style={{ 'min-width': '800px' }}
              >
                <h3>Search for a hotel</h3>
                <fieldset>
                  <div class="inputDiv">
                    <h4>Hotel name</h4>
                    <input
                      style={{ width: '400px', marginRight: '20px' }}
                      type="text"
                      id="search"
                      name="search"
                      value={this.props.search}
                    />
                    <h4>Hotel url</h4>
                    <input
                      style={{ width: '400px', marginRight: '20px' }}
                      type="text"
                      id="url"
                      name="url"
                      value={this.props.url}
                    />
                    <br />
                    <br />
                    <button type="submit" class="primaryButton" name="action" value="Scan">
                      Search
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </section>
          <section>
            <div>
              <h3>Results</h3>
              <table>
                <tr>
                  <th></th>
                  <th>Found</th>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>{this.props.metaInfo && this.props.metaInfo.name}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>{this.props.metaInfo && this.props.metaInfo.address}</td>
                </tr>
                <tr>
                  <td>Country</td>
                  <td>{this.props.metaInfo && this.props.metaInfo.country}</td>
                </tr>
                <tr>
                  <td>Room Count</td>
                  <td>{this.props.metaInfo && this.props.metaInfo.roomCount}</td>
                </tr>
                <tr>
                  <td>Rating</td>
                  <td>{this.props.metaInfo && this.props.metaInfo.rating}</td>
                </tr>
                <tr>
                  <td>Competitors</td>
                  <td>{this.props.siteInfo && this.props.siteInfo.competitors.map((c) => `${c}, `)}</td>
                </tr>
              </table>
            </div>
          </section>
        </body>
      </html>
    );
  }
}
