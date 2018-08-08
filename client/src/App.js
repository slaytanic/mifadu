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
      this.setCurrentUser(res.data.data.me);
    });
  }

  setCurrentUser = user => {
    console.log('setCurrentUser', user);
    console.log('this', this);
    this.setState({ me: user });
    console.log('hellooooo');
    console.log('state:', this.state);
  };

  render() {
    const { me } = this.state;

    if (me && me.completedProfile === false) {
      return (
        <div className="App">
          <MenuAppBar />
          <Route
            render={() => (
              <RegisterPage user={me} setCurrentUser={this.setCurrentUser} />
            )}
          />
        </div>
      );
    }

    return (
      <div className="App">
        <MenuAppBar user={me} />
        <Route exact path="/" render={() => <HomePage user={me} />} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </div>
    );
  }
}

export default App;
