import React, { Component } from 'react';
// import { Switch, Route } from 'react-router-dom'

import LoginPage from './views/LoginPage/LoginPage.jsx';

import { getMe, logoutUser } from './data/service';

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
      return <RegisterPage />;
    }

    if (me && me.completedProfile === true) {
      return <DashboardPage />;
    }

    return (
      <LoginPage />
      // <Switch>
      //   <Route exact path="/" component={LoginPage} />
      // </Switch>
    );
  }
}

export default App;
