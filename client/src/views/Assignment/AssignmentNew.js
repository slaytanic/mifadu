import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import AssignmentForm from './AssignmentForm';

import Content from 'layouts/Content/Content';

import CREATE_ASSIGNMENT from 'graphql/mutations/CreateAssignment';

const AssignmentNew = ({ me, createAssignment, history }) => {
  return (
    <Content title="Trabajos prácticos" subtitle="Nuevo trabajo práctico">
      <AssignmentForm
        me={me}
        onSubmit={async input => {
          const response = await createAssignment({ variables: { input } });
          if (response.data) {
            history.push(`/assignments/${response.data.createAssignment.id}`);
          }
        }}
      />
    </Content>
  );
};

AssignmentNew.propTypes = {
  me: PropTypes.object.isRequired,
  createAssignment: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  graphql(CREATE_ASSIGNMENT, {
    name: 'createAssignment',
  }),
  withRouter,
)(AssignmentNew);
