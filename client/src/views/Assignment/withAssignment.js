import React from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';

import ASSIGNMENT_QUERY from 'graphql/queries/Assignment';

function withAssignment(WrappedComponent) {
  return withRouter(({ match, assignment, ...rest }) => {
    if (assignment) return <WrappedComponent assignment={assignment} {...rest} />;

    return (
      <Query
        query={ASSIGNMENT_QUERY}
        variables={{
          id: match.params.id,
        }}
      >
        {({ data, loading, error }) => {
          if (loading) return null;
          if (error) return null;
          if (!data || !data.assignment) return null;

          return <WrappedComponent assignment={data.assignment} {...rest} />;
        }}
      </Query>
    );
  });
}

export default withAssignment;
