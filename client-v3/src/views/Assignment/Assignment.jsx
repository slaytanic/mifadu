import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';

import Button from 'components/material-kit-react/CustomButtons/Button';
import CustomInput from 'components/material-kit-react/CustomInput/CustomInput';
import Badge from 'components/material-kit-react/Badge/Badge';

import Modal from 'components/Modal/Modal';

import Content from 'layouts/Content';

import { assignmentFetch, assignmentWorkSubmit } from 'actions/assignment';

const styles = {
  input: {
    display: 'none',
  },
  modalInput: {
    minWidth: '30em',
  },
};

class Assignment extends Component {
  state = {
    modal: false,
    requiredWorkId: '',
    content: '',
  };

  componentDidMount() {
    const { dispatchAssignmentFetch, match } = this.props;
    dispatchAssignmentFetch(match.params.id);
  }

  handleUpload = requiredWorkId => event => {
    const { match, dispatchAssignmentWorkSubmit } = this.props;
    dispatchAssignmentWorkSubmit(match.params.id, {
      assignmentWork: [{ requiredWorkId, attachment: event.target.files[0] }],
    });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleLink = requiredWorkId => () => {
    this.setState({ requiredWorkId, modal: true, content: '' });
  };

  handleOk = () => {
    const { match, dispatchAssignmentWorkSubmit } = this.props;
    const { requiredWorkId, content } = this.state;
    dispatchAssignmentWorkSubmit(match.params.id, {
      assignmentWork: [{ requiredWorkId, content }],
    });
    this.setState({ modal: false });
  };

  render() {
    const { currentUser, assignments, match, classes } = this.props;
    const { modal, content } = this.state;

    const assignment = assignments.all.find(a => a.id === match.params.id);

    return (
      <Content title="Trabajos prácticos" subtitle="Ver trabajo práctico">
        <Modal
          open={modal}
          titleText="Subir componente"
          bodyText="Ingrese un link"
          cancelText="Cancelar"
          handleOk={this.handleOk}
          handleCancel={() => this.setState({ modal: false })}
        >
          <CustomInput
            labelText="Link"
            formControlProps={{
              className: classes.modalInput,
              fullWidth: true,
            }}
            inputProps={{
              value: content,
              onChange: this.handleChange('content'),
            }}
          />
        </Modal>
        {assignment && (
          <div>
            <h3>{assignment.name}</h3>
            <p>
              {!currentUser.tutoredWorkshops.map(tw => tw.id).includes(assignment.workshop.id) &&
                assignment.statusTags.includes('pending_work') && (
                  <Badge color="warning">Pendiente</Badge>
                )}
              {!currentUser.tutoredWorkshops.map(tw => tw.id).includes(assignment.workshop.id) &&
                assignment.statusTags.includes('completed_work') && (
                  <Badge color="success">Entregado</Badge>
                )}
              {!currentUser.tutoredWorkshops.map(tw => tw.id).includes(assignment.workshop.id) &&
                assignment.statusTags.includes('self_evaluation_pending') && (
                  <Badge color="warning">Autoevaluación Pendiente</Badge>
                )}
              {!currentUser.tutoredWorkshops.map(tw => tw.id).includes(assignment.workshop.id) &&
                assignment.statusTags.includes('self_evaluation_completed') && (
                  <Badge color="success">Autoevaluación Realizada</Badge>
                )}
              {!currentUser.tutoredWorkshops.map(tw => tw.id).includes(assignment.workshop.id) &&
                assignment.statusTags.includes('self_evaluation_completed') &&
                assignment.statusTags.includes('evaluation_pending') && (
                  <Badge color="warning">Evaluación Pendiente</Badge>
                )}
              {!currentUser.tutoredWorkshops.map(tw => tw.id).includes(assignment.workshop.id) &&
                assignment.statusTags.includes('self_evaluation_completed') &&
                assignment.statusTags.includes('evaluation_completed') && (
                  <Badge color="success">Evaluación Realizada</Badge>
                )}
            </p>
            <h4>{assignment.shortDescription}</h4>
            <p>{assignment.description}</p>
            <p>
              <b>Consigna:</b>{' '}
              {assignment.attachment && (
                <a href={assignment.attachment.url} target="_blank" rel="noopener noreferrer">
                  {assignment.attachment.name}
                </a>
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
                  {!currentUser.tutoredWorkshops
                    .map(tw => tw.id)
                    .includes(assignment.workshop.id) &&
                    (rw.assignmentWork ? (
                      <Badge color="success">Entregado</Badge>
                    ) : (
                      <Badge color="warning">Pendiente</Badge>
                    ))}
                </p>
                <p>
                  {rw.assignmentWork ? (
                    <a
                      href={
                        rw.assignmentWork.content
                          ? rw.assignmentWork.content
                          : rw.assignmentWork.attachment.url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {rw.description} ({rw.type})
                    </a>
                  ) : (
                    `${rw.description} (${rw.type})`
                  )}
                </p>
                {!currentUser.tutoredWorkshops.map(tw => tw.id).includes(assignment.workshop.id) &&
                  (['PDF', 'JPG'].includes(rw.type) ? (
                    <label htmlFor={`attachment.${rw.id}`}>
                      <input
                        accept={rw.type === 'PDF' ? 'application/pdf' : 'image/jpeg'}
                        className={classes.input}
                        id={`attachment.${rw.id}`}
                        name={`attachment.${rw.id}`}
                        type="file"
                        onChange={this.handleUpload(rw.id)}
                      />
                      <Button component="span">Subir componente</Button>
                    </label>
                  ) : (
                    <Button onClick={this.handleLink(rw.id)}>Subir componente</Button>
                  ))}
              </div>
            ))}
            {currentUser.tutoredWorkshops.map(tw => tw.id).includes(assignment.workshop.id) && (
              <Button
                color="primary"
                fullWidth
                component={Link}
                to={`/assignments/${assignment.id}/edit`}
              >
                Editar trabajo práctico
              </Button>
            )}
            {!currentUser.tutoredWorkshops.map(tw => tw.id).includes(assignment.workshop.id) &&
              assignment.statusTags.includes('completed_work') && (
                <Button
                  color="primary"
                  fullWidth
                  component={Link}
                  to={`/assignments/${assignment.id}/self_score`}
                >
                  Autoevaluación
                </Button>
              )}
          </div>
        )}
      </Content>
    );
  }
}

Assignment.propTypes = {
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
  dispatchAssignmentWorkSubmit: (id, input) => dispatch(assignmentWorkSubmit(id, input)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Assignment));
