import React from 'react';
import PropTypes from 'prop-types';

import withAssignment from './withAssignment';

function AssignmentLead({ assignment, children }) {
  return (
    <div>
      <h3>{assignment.name}</h3>
      <h4>{assignment.shortDescription}</h4>
      <p>{assignment.description}</p>
      {children}
    </div>
  );
}

AssignmentLead.defaultProps = {
  children: null,
};

AssignmentLead.propTypes = {
  assignment: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default withAssignment(AssignmentLead);
