import {React, PureComponent} from 'react';
import './App.css';
import {BrowserRouter, Route} from "react-router-dom";
import styled from "styled-components";
import {CoronApiHttpClient} from "./api/CoronApiHttpClient";

const Layout = styled.div`
  max-width: 500px;
  margin: 64px auto;
`;

function App() {
  // const api = new CoronApi();
  return (
    <BrowserRouter>
      <Route exact path={'/'}>
        <Layout>
          <h1>TITLE</h1>
          {/*<StatusList/>*/}
        </Layout>
      </Route>
    </BrowserRouter>
  );
}
//
// class StatusList extends PureComponent {
//   async componentDidMount() {
//     const apiClient = new CoronApiHttpClient('http://localhost:1010');
//     const statuses = await apiClient.getAllStatuses();
//     console.log("*********", statuses);
//   }
//
//  render() {
//    return (
//            <h1>Statuslist</h1>
//    );
//  }
// }

export default App;
