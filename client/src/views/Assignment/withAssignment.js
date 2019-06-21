import React from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';

import ASSIGNMENT_QUERY from 'graphql/queries/Assignment';

function withAssignment(WrappedComponent) {
  return withRouter(({ match, ...rest }) => {
    return (
      <Query
        query={ASSIGNMENT_QUERY}
        variables={{
          id: match.params.id,
        }}
      >
        {({ data: { assignment }, loading, error }) => {
          if (loading) return null;
          if (error) return null;

          return <WrappedComponent assignment={assignment} {...rest} />;
        }}
      </Query>
    );
  });
}

export default withAssignment;
