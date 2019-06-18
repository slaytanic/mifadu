import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Query, graphql, compose } from 'react-apollo';

import AssignmentForm from './AssignmentForm';

import Content from 'layouts/Content/Content';

import ASSIGNMENT_QUERY from 'graphql/queries/Assignment';
import UPDATE_ASSIGNMENT from 'graphql/mutations/UpdateAssignment';

function AssignmentEdit({ me, match, history, updateAssignment }) {
  return (
    <Content title="Trabajos prácticos" subtitle="Editar trabajo práctico">
      <Query
        query={ASSIGNMENT_QUERY}
        variables={{
          id: match.params.id,
        }}
      >
        {({ data: { assignment }, loading, error }) => {
          if (loading) return null;
          if (error) return null;

          return (
            <AssignmentForm
              me={me}
              assignment={assignment}
              onSubmit={async input => {
                const response = await updateAssignment({
                  variables: { id: match.params.id, input },
                });
                if (response.data) {
                  history.push(`/assignments/${response.data.updateAssignment.id}`);
                }
              }}
            />
          );
        }}
      </Query>
    </Content>
  );
}

AssignmentEdit.propTypes = {
  me: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default compose(
  graphql(UPDATE_ASSIGNMENT, {
    name: 'updateAssignment',
  }),
  withRouter,
)(AssignmentEdit);
