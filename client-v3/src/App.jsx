import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';

import LoggedIn from './layouts/LoggedIn';

import Login from './views/Login/Login';
import Register from './views/Register/Register';
import Home from './views/Home/Home';

import { currentUserFetch } from './actions/current-user';

class App extends Component {
  componentDidMount() {
    const { dispatchCurrentUserFetch } = this.props;
    dispatchCurrentUserFetch();
  }

  render() {
    const { history, currentUser } = this.props;

    let main;
    if (currentUser.loggedIn) {
      if (currentUser.completedProfile) {
        main = (
          <LoggedIn>
            <Switch>
              <Route path="/" component={Home} />
            </Switch>
          </LoggedIn>
        );
      } else {
        main = (
          <Switch>
            <Route component={Register} />
          </Switch>
        );
      }
    } else {
      main = (
        <Switch>
          <Route path="/register" component={Register} />
          <Route component={Login} />
        </Switch>
      );
    }

    return <ConnectedRouter history={history}>{main}</ConnectedRouter>;
  }
}

App.propTypes = {
  history: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  dispatchCurrentUserFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  hasErrored: state.currentUserHasErrored,
  isLoading: state.currentUserIsLoading,
});

const mapDispatchToProps = dispatch => ({
  dispatchCurrentUserFetch: () => dispatch(currentUserFetch()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
