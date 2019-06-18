import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import { Route, Switch } from 'react-router-dom';

import LoggedIn from 'layouts/LoggedIn/LoggedIn';

import Login from 'views/Login/Login';
import Register from 'views/Register/Register';
import RecoverPassword from 'views/RecoverPassword/RecoverPassword';
import ResetPassword from 'views/ResetPassword/ResetPassword';
import Home from 'views/Home/Home';
import WorkshopMembers from 'views/Workshop/Members/Members';
import WorkshopAssignments from 'views/Workshop/Assignments/Assignments';
import Assignment from 'views/Assignment/Assignment';
import AssignmentNew from 'views/Assignment/AssignmentNew';
import AssignmentEdit from 'views/Assignment/AssignmentEdit';

import './App.css';

import ME_QUERY from 'graphql/queries/Me';
import LOGOUT_USER from 'graphql/mutations/LogoutUser';

class App extends Component {
  render() {
    return (
      <Query query={ME_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return null;
          if (error) return null;

          if (data.me) {
            return (
              <Mutation
                mutation={LOGOUT_USER}
                update={cache => {
                  cache.writeQuery({
                    query: ME_QUERY,
                    data: { me: null },
                  });
                }}
              >
                {logoutUser => {
                  if (data.me.completedProfile) {
                    return (
                      <LoggedIn me={data.me} logoutUser={logoutUser}>
                        <Switch>
                          {/* <Route path="/profile" component={Profile} /> */}
                          <Route path="/workshops/:id/members" component={WorkshopMembers} />
                          {/* <Route path="/works" component={Works} /> */}
                          {/* <Route path="/works/:studentId/:assignmentId" component={Works} /> */}
                          <Route path="/assignments/new" component={AssignmentNew} />
                          <Route path="/assignments/:id/edit" component={AssignmentEdit} />
                          {/* <Route
                          path="/assignments/:id/score/:targetUserId"
                          component={AssignmentScore}
                        /> */}
                          {/* <Route path="/assignments/:id/self_score" component={AssignmentSelfScore} /> */}
                          <Route
                            exact
                            path="/workshops/:id/assignments/:status(pending|completed)?"
                            render={() => <WorkshopAssignments me={data.me} />}
                          />
                          <Route
                            path="/assignments/:id"
                            render={() => <Assignment me={data.me} />}
                          />
                          {/* <Route
                          path="/evaluations/:assignmentId/:studentId"
                          component={Evaluation}
                        /> */}
                          {/* <Route
                          path="/evaluations/:filter(pending|completed)?"
                          component={Evaluations}
                        /> */}
                          <Route
                            path="/"
                            render={() => <Home me={data.me} logoutUser={logoutUser} />}
                          />
                        </Switch>
                      </LoggedIn>
                    );
                  } else {
                    return (
                      <Switch>
                        <Route render={() => <Register me={data.me} logoutUser={logoutUser} />} />}
                      </Switch>
                    );
                  }
                }}
              </Mutation>
            );
          } else {
            return (
              <Switch>
                <Route path="/recover_password/:recoveryToken" component={ResetPassword} />
                <Route path="/recover_password" component={RecoverPassword} />
                <Route path="/register" component={Register} />
                <Route component={Login} />
              </Switch>
            );
          }
        }}
      </Query>
    );
  }
}

export default App;
