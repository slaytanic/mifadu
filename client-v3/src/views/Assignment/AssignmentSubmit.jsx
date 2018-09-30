import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'components/material-kit-react/CustomButtons/Button';
import Badge from 'components/material-kit-react/Badge/Badge';

import Content from 'layouts/Content';

import { assignmentFetch } from 'actions/assignment';

class Assignment extends Component {
  componentDidMount() {
    const { dispatchAssignmentFetch, match } = this.props;
    dispatchAssignmentFetch(match.params.id);
  }

  render() {
    const { currentUser, assignments, match } = this.props;

    const assignment = assignments.all.find(a => a.id === match.params.id);

    return (
      <Content title="Trabajos prácticos" subtitle="Ver trabajo práctico">
        {assignment && (
          <div>
            <h3>
              {assignment.name}
              {!currentUser.tutoredWorkshops.includes(assignment.workshop) &&
                assignment.statusTags.includes('pending_work') && (
                  <Badge color="warning">Pendiente</Badge>
                )}
            </h3>
            <h4>{assignment.shortDescription}</h4>
            <p>{assignment.description}</p>
            <p>
              <b>Consigna:</b>{' '}
              {assignment.attachment && (
                <a href={assignment.attachment.url}>{assignment.attachment.name}</a>
              )}
            </p>
            <p>
              <b>Fecha de entrega:</b> {assignment.endsAt}
            </p>
            <p>
              <b>Variable de evaluación:</b> {assignment.evaluationVariable}
            </p>
            <p>
              <b>Tipo:</b> {{ Group: 'Grupal', Individual: 'Individual' }[assignment.type]}
            </p>
            <p>
              <b>Categorías / Etiquetas:</b>{' '}
              {assignment.tags ? assignment.tags.map(t => t.name).join(', ') : <i>Ninguna</i>}
            </p>
            {(assignment.requiredWork || []).map((rw, index) => (
              <div key={rw.id}>
                <h6>Componente de entrega #{index + 1}</h6>
                <p>
                  {rw.description} ({rw.type})
                </p>
              </div>
            ))}
            {currentUser.tutoredWorkshops.includes(assignment.workshop) && (
              <Button
                color="primary"
                fullWidth
                component={Link}
                to={`/assignments/${assignment.id}/edit`}
              >
                Editar trabajo práctico
              </Button>
            )}
            {/* {!currentUser.tutoredWorkshops.includes(assignment.workshop) &&
              assignment.statusTags.includes('pending_work') && (
                <Button
                  color="primary"
                  fullWidth
                  component={Link}
                  to={`/assignments/${assignment.id}/submit`}
                >
                  Realizar entrega
                </Button>
              )} */}
          </div>
        )}
      </Content>
    );
  }
}

Assignment.propTypes = {
  currentUser: PropTypes.object.isRequired,
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
)(Assignment);
