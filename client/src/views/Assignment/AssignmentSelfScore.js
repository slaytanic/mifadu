import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';

import EvaluationForm from 'views/Assignment/EvaluationForm';

import Content from 'layouts/Content/Content';

import AssignmentLead from './AssignmentLead';
import withAssignment from './withAssignment';

// import { assignmentFetch } from 'actions/assignment';

function AssignmentSelfScore({ assignment }) {
  return (
    <Content title="Trabajos prácticos" subtitle="Autoevaluación">
      <AssignmentLead>
        <h6>Autoevaluación</h6>
        {/* <EvaluationForm assignment={assignment} self /> */}
      </AssignmentLead>
    </Content>
  );
  // }
}

AssignmentSelfScore.propTypes = {
  // match: PropTypes.object.isRequired,
  // dispatchAssignmentFetch: PropTypes.func.isRequired,
  // assignment: PropTypes.object.isRequired,
};

// const mapStateToProps = state => ({
//   currentUser: state.currentUser,
//   assignments: state.assignments,
// });

// const mapDispatchToProps = dispatch => ({
//   dispatchAssignmentFetch: id => dispatch(assignmentFetch(id)),
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(AssignmentSelfScore);
export default withAssignment(AssignmentSelfScore);
