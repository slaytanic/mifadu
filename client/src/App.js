import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import MenuAppBar from './components/MenuAppBar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';

import { getMe, logoutUser } from './data/service';

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
    this.setState({ me: user });
  };

  logoutUser = () => {
    logoutUser().then(() => {
      this.setCurrentUser(null);
    });
  };

  render() {
    const { me } = this.state;

    if (me && me.completedProfile === false) {
      return (
        <div className="App">
          <MenuAppBar />
          <Route
            render={() => (
              <RegisterPage
                user={me}
                setCurrentUser={this.setCurrentUser}
                logoutUser={this.logoutUser}
              />
            )}
          />
        </div>
      );
    }

    return (
      <div className="App">
        <MenuAppBar user={me} logoutUser={this.logoutUser} />
        <Route
          exact
          path="/"
          render={() => <HomePage user={me} logoutUser={this.logoutUser} />}
        />
        <Route
          exact
          path="/login"
          render={() => <LoginPage setCurrentUser={this.setCurrentUser} />}
        />
        <Route
          exact
          path="/register"
          render={() => (
            <RegisterPage
              user={me}
              setCurrentUser={this.setCurrentUser}
              logoutUser={this.logoutUser}
            />
          )}
        />
      </div>
    );
  }
}

export default App;
