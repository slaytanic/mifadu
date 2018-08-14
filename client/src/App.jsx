import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import LoginPage from 'views/LoginPage/LoginPage';
import RegisterPage from 'views/RegisterPage/RegisterPage';
import DashboardPage from 'views/DashboardPage/DashboardPage';

import { getMe, logoutUser } from 'data/service';

class App extends Component {
  state = {
    me: null,
    loading: true,
  };

  componentDidMount() {
    getMe().then(res => {
      this.setState({ me: res.data.data.me, loading: false });
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
    const { me, loading } = this.state;

    if (loading) {
      return <div />;
    }

    if (me && me.completedProfile === false) {
      return (
        <RegisterPage user={me} setCurrentUser={this.setCurrentUser} logoutUser={this.logoutUser} />
      );
    }

    return (
      <Switch>
        {me ? (
          <DashboardPage user={me} logoutUser={this.logoutUser} />
        ) : (
          <Route exact path="/" render={() => <LoginPage setCurrentUser={this.setCurrentUser} />} />
        )}
        <Route
          exact
          path="/register"
          render={() => (
            <RegisterPage setCurrentUser={this.setCurrentUser} logoutUser={this.logoutUser} />
          )}
        />
      </Switch>
    );
  }
}

export default App;
