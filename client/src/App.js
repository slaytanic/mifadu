import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import LoginPage from 'views/LoginPage/LoginPage.jsx';
import RegisterPage from 'views/RegisterPage/RegisterPage.jsx';
// import DashboardPage from './views/LoginPage/DashboardPage.jsx';

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
      return <RegisterPage user={me} />;
    }

    if (me && me.completedProfile === true) {
      return <div />;
      // return <DashboardPage />;
    }

    return (
      <Switch>
        <Route
          exact
          path="/"
          render={() => <LoginPage setCurrentUser={this.setCurrentUser} />}
        />
        <Route exact path="/register" component={RegisterPage} />
      </Switch>
    );
  }
}

export default App;
