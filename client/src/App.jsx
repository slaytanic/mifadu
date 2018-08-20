import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import LoginPage from 'views/LoginPage/LoginPage';
import RegisterPage from 'views/RegisterPage/RegisterPage';
import DashboardPage from 'views/DashboardPage/DashboardPage';
import AdminPage from 'views/AdminPage/AdminPage';

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
    const { location } = this.props;
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
          <div>
            <Route
              exact
              path="/"
              render={() => <DashboardPage user={me} logoutUser={this.logoutUser} />}
            />
            {location.pathname !== '/' && (
              <Switch>
                <Route
                  path="/:collection/:id?/:action"
                  render={() => <AdminPage user={me} logoutUser={this.logoutUser} />}
                />
                <Route
                  path="/:collection/:action(pending|complete)"
                  render={() => <AdminPage user={me} logoutUser={this.logoutUser} />}
                />
                <Route
                  path="/:collection/:id?"
                  render={() => <AdminPage user={me} logoutUser={this.logoutUser} />}
                />
              </Switch>
            )}
          </div>
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

export default withRouter(App);
