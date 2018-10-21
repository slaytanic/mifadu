import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EvaluationForm from 'components/Assignment/EvaluationForm';

import Content from 'layouts/Content';

import { assignmentFetch } from 'actions/assignment';

class Evaluation extends Component {
  state = {
    assignmentWorks: [],
    selfEvaluation: {
      observations: '',
    },
  };

  componentDidMount() {
    const { dispatchAssignmentFetch, match } = this.props;
    dispatchAssignmentFetch(match.params.assignmentId).then(action => {
      const assignmentWorks = [];
      (action.payload.requiredWork || []).forEach(rw => {
        (rw.assignmentWorks || []).forEach(aw => {
          if (aw.user.id === match.params.studentId) {
            assignmentWorks.push({
              ...aw,
              requiredWorkType: rw.type,
              requiredWorkDescription: rw.description,
            });
          }
        });
      });
      const selfEvaluation = (action.payload.evaluations || []).find(
        e => e.targetUser.id === match.params.studentId && e.user.id === match.params.studentId,
      ) || { observations: '' };
      this.setState({ assignmentWorks, selfEvaluation });
    });
  }

  render() {
    const { assignments, match, currentUser } = this.props;

    const assignment = assignments.all.find(a => a.id === match.params.assignmentId);

    if (!assignment) {
      return <Content title="Trabajos prácticos" subtitle="Evaluación" />;
    }

    const { assignmentWorks, selfEvaluation } = this.state;

    const student = assignment.completedBy.find(u => u.id === match.params.studentId);

    return (
      <Content title="Trabajos prácticos" subtitle="Evaluación">
        <h3>{assignment.name}</h3>
        <h4>{assignment.shortDescription}</h4>
        <p>{assignment.description}</p>
        <h5>Evaluando a {student.fullName}</h5>
        {assignmentWorks.map((aw, index) => (
          <div key={aw.id}>
            <h6>Componente de entrega #{index + 1}</h6>
            <p>
              {aw.content || aw.attachment ? (
                <a
                  href={aw.content ? aw.content : aw.attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {aw.requiredWorkDescription} ({aw.requiredWorkType})
                </a>
              ) : (
                <span>
                  {aw.requiredWorkDescription} ({aw.requiredWorkType})
                </span>
              )}
            </p>
          </div>
        ))}
        <h6>Reflexiones sobre el trabajo práctico</h6>
        <p>{selfEvaluation.observations}</p>
        <h6>Evaluación</h6>
        <EvaluationForm
          assignment={assignment}
          currentUser={currentUser}
          targetUserId={match.params.studentId}
        />
      </Content>
    );
  }
}

Evaluation.propTypes = {
  match: PropTypes.object.isRequired,
  dispatchAssignmentFetch: PropTypes.func.isRequired,
  assignments: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
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
)(Evaluation);
