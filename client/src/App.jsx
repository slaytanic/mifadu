import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';

import LoggedIn from './layouts/LoggedIn';

import Login from './views/Login/Login';
import Register from './views/Register/Register';
import Home from './views/Home/Home';
import RecoverPassword from './views/RecoverPassword/RecoverPassword';
import ResetPassword from './views/ResetPassword/ResetPassword';
import Profile from './views/Profile/Profile';
// import Users from './views/User/Users';
import Students from './views/Student/Students';
import Assignment from './views/Assignment/Assignment';
import AssignmentNew from './views/Assignment/AssignmentNew';
import AssignmentEdit from './views/Assignment/AssignmentEdit';
import Assignments from './views/Assignment/Assignments';
import AssignmentScore from './views/Assignment/AssignmentScore';
import AssignmentSelfScore from './views/Assignment/AssignmentSelfScore';
// import AssignmentSubmit from './views/Assignment/AssignmentSubmit';
import Evaluation from './views/Evaluation/Evaluation';
import Evaluations from './views/Evaluation/Evaluations';
import Works from './views/Works/Works';

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
              <Route path="/profile" component={Profile} />
              <Route path="/students" component={Students} />
              <Route path="/works" component={Works} />
              <Route path="/works/:studentId/:assignmentId" component={Works} />
              <Route path="/assignments/new" component={AssignmentNew} />
              <Route path="/assignments/:id/edit" component={AssignmentEdit} />
              <Route path="/assignments/:id/score/:targetUserId" component={AssignmentScore} />
              <Route path="/assignments/:id/self_score" component={AssignmentSelfScore} />
              <Route
                exact
                path="/assignments/:filter(pending|completed)?"
                component={Assignments}
              />
              <Route path="/assignments/:id" component={Assignment} />
              <Route path="/evaluations/:assignmentId/:studentId" component={Evaluation} />
              <Route path="/evaluations/:filter(pending|completed)?" component={Evaluations} />
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
          <Route path="/recover_password/:recoveryToken" component={ResetPassword} />
          <Route path="/recover_password" component={RecoverPassword} />
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
