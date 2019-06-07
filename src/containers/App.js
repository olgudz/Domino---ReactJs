import React, { Component, Fragment } from 'react';
import Game from './Game/Game';
import Header from '../components/UI/Header/Header';

class App extends Component {
  render() {
    return (
      <Fragment>
          <Header />
          <Game />
      </Fragment>
    );
  }
}

export default App;
