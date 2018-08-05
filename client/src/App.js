import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import MenuAppBar from './components/MenuAppBar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';

import { getMe } from './data/service';

// import logo from './logo.png';
import './App.css';
class App extends Component {
  state = {
    me: null,
  };

  componentDidMount() {
    getMe().then(res => {
      this.setState({ me: res.data.data.me });
    });
  }

  render() {
    const { me } = this.state;

    if (me && me.completedProfile === false) {
      return (
        <div className="App">
          <MenuAppBar />
          <Route render={() => <RegisterPage user={me} />} />
        </div>
      );
    }

    return (
      <div className="App">
        <MenuAppBar user={me} />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </div>
    );
  }
}

export default App;
