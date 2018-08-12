import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import lightBlue from '@material-ui/core/colors/lightBlue';

import MenuAppBar from './components/MenuAppBar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import AssignmentPage from './pages/AssignmentPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import TutorDashboardPage from './pages/TutorDashboardPage';

import { getMe, logoutUser } from './data/service';

// import logo from './logo.png';
// import './App.css';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#0091ea' },
    secondary: { main: '#f9f9f9' },
  },
});

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
        <MuiThemeProvider theme={theme}>
          <MenuAppBar>
            <Route
              render={() => (
                <RegisterPage
                  user={me}
                  setCurrentUser={this.setCurrentUser}
                  logoutUser={this.logoutUser}
                />
              )}
            />
          </MenuAppBar>
        </MuiThemeProvider>
      );
    }

    return (
      <MuiThemeProvider theme={theme}>
        <MenuAppBar user={me} logoutUser={this.logoutUser}>
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
          <Route exact path="/admin" render={() => <AdminPage />} />
          <Route
            exact
            path="/student"
            render={() => <StudentDashboardPage />}
          />
          <Route exact path="/tutor" render={() => <TutorDashboardPage />} />
          <Route exact path="/assignments" render={() => <AssignmentPage />} />
          <Route
            exact
            path="/assignments/:action"
            render={() => <AssignmentPage />}
          />
          <Route
            exact
            path="/assignment/:id"
            render={() => <AssignmentPage />}
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
        </MenuAppBar>
      </MuiThemeProvider>
    );
  }
}

export default App;
