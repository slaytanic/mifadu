import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import MenuAppBar from './components/MenuAppBar';
import RegisterPage from './pages/RegisterPage';

// import logo from './logo.png';
import './App.css';
class App extends Component {
  render() {
    return (
      <div className="App">
        <MenuAppBar />
        <Route exact path="/register" component={RegisterPage} />
      </div>
    );
  }
}

export default App;
