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

    return (
      <ConnectedRouter history={history}>
        {currentUser.loggedIn &&
          currentUser.completedProfile && (
            <LoggedIn>
              <Switch>
                <Route path="/" component={Home} />
              </Switch>
            </LoggedIn>
          )}
        {currentUser.loggedIn &&
          !currentUser.completedProfile && (
            <Switch>
              <Route component={Register} />
            </Switch>
          )}
        {!currentUser.loggedIn && (
          <Switch>
            <Route path="/register" component={Register} />
            <Route component={Login} />
          </Switch>
        )}
      </ConnectedRouter>
    );
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
