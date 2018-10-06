import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EvaluationForm from 'components/Assignment/EvaluationForm';

import Content from 'layouts/Content';

import { assignmentFetch } from 'actions/assignment';

class AssignmentSelfScore extends Component {
  componentDidMount() {
    const { dispatchAssignmentFetch, match } = this.props;
    dispatchAssignmentFetch(match.params.id);
  }

  render() {
    const { assignments, match } = this.props;

    const assignment = assignments.all.find(a => a.id === match.params.id);

    return (
      <Content title="Trabajos prácticos" subtitle="Autoevaluación">
        {assignment && (
          <div>
            <h3>{assignment.name}</h3>
            <h4>{assignment.shortDescription}</h4>
            <p>{assignment.description}</p>
            <h6>Autoevaluación</h6>
            <EvaluationForm assignment={assignment} self />
          </div>
        )}
      </Content>
    );
  }
}

AssignmentSelfScore.propTypes = {
  match: PropTypes.object.isRequired,
  dispatchAssignmentFetch: PropTypes.func.isRequired,
  assignments: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  assignments: state.assignments,
});

const mapDispatchToProps = dispatch => ({
  dispatchAssignmentFetch: id => dispatch(assignmentFetch(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssignmentSelfScore);
