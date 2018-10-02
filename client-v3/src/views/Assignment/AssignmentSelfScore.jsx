import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import withStyles from '@material-ui/core/styles/withStyles';

import EvaluationForm from 'components/Assignment/EvaluationForm';

import Content from 'layouts/Content';

import { assignmentFetch, assignmentSelfEvaluationSubmit } from 'actions/assignment';

const styles = {
  slider: {
    marginBottom: '3em',
  },
};

class AssignmentSelfScore extends Component {
  componentDidMount() {
    const { dispatchAssignmentFetch, match } = this.props;
    dispatchAssignmentFetch(match.params.id);
  }

  render() {
    const {
      currentUser,
      assignments,
      match,
      classes,
      dispatchAssignmentSelfEvaluationSubmit,
      historyPush,
    } = this.props;

    const assignment = assignments.all.find(a => a.id === match.params.id);

    return (
      <Content title="Trabajos prácticos" subtitle="Autoevaluación">
        {assignment && (
          <div>
            <h3>{assignment.name}</h3>
            <h4>{assignment.shortDescription}</h4>
            <p>{assignment.description}</p>
            <h6>Autoevaluación</h6>
            <EvaluationForm assignment={assignment} />
          </div>
        )}
      </Content>
    );
  }
}

AssignmentSelfScore.propTypes = {
  currentUser: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  dispatchAssignmentFetch: PropTypes.func.isRequired,
  dispatchAssignmentWorkSubmit: PropTypes.func.isRequired,
  assignments: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  assignments: state.assignments,
});

const mapDispatchToProps = dispatch => ({
  dispatchAssignmentFetch: id => dispatch(assignmentFetch(id)),
  dispatchAssignmentSelfEvaluationSubmit: (id, input) =>
    dispatch(assignmentSelfEvaluationSubmit(id, input)),
  historyPush: path => {
    dispatch(push(path));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(AssignmentSelfScore));
