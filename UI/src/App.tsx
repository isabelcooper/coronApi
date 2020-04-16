import React from 'react';
import './App.css';
import {BrowserRouter, Route} from "react-router-dom";
import styled from "styled-components";

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
          </Layout>
        </Route>
      </BrowserRouter>
  );
}

export default App;
