import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';

import AssignmentForm from './AssignmentForm';

import Content from 'layouts/Content/Content';

import ASSIGNMENT_QUERY from 'graphql/queries/Assignment';

const AssignmentNew = (me, match) => {
  return (
    <Content title="Trabajos prácticos" subtitle="Nuevo trabajo práctico">
      <Query
        query={ASSIGNMENT_QUERY}
        variables={{
          id: match.params.id,
        }}
      >
        {({ data: { assignment }, loading, error }) => {
          if (loading) return null;
          if (error) return null;

          return <AssignmentForm me={me} assignment={assignment} />;
        }}
      </Query>
    </Content>
  );
};

AssignmentNew.propTypes = {
  me: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withRouter(AssignmentNew);
