import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import withStyles from '@material-ui/core/styles/withStyles';

import Button from 'components/CustomButton/CustomButton';
import CustomInput from 'components/material-kit-react/CustomInput/CustomInput';
import Badge from 'components/material-kit-react/Badge/Badge';

import Modal from 'components/Modal/Modal';

import Content from 'layouts/Content/Content';

import ASSIGNMENT_QUERY from 'graphql/queries/Assignment';

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
    submitting: {},
  };

  handleUpload = requiredWorkId => event => {
    const { match, dispatchAssignmentWorkSubmit } = this.props;
    this.setState(prevState => ({
      submitting: { ...prevState.submitting, [requiredWorkId]: true },
    }));
    dispatchAssignmentWorkSubmit(match.params.id, {
      assignmentWork: [{ requiredWorkId, attachment: event.target.files[0] }],
    }).then(() => {
      this.setState(prevState => ({
        submitting: { ...prevState.submitting, [requiredWorkId]: false },
      }));
    });
  };

  isSubmitting = requiredWorkId => {
    const { submitting } = this.state;
    if (submitting[requiredWorkId]) {
      return submitting[requiredWorkId];
    }
    return false;
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
    const { match, classes } = this.props;
    const { modal, content } = this.state;

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
        <Query
          query={ASSIGNMENT_QUERY}
          variables={{
            id: match.params.id,
          }}
        >
          {({ data: { assignment }, loading, error }) => {
            if (loading) return null;
            if (error) return null;

            return (
              <div>
                <h3>{assignment.name}</h3>
                <p>
                  {assignment.statusTags.includes('pending_work') && (
                    <Badge color="warning">Entrega Pendiente</Badge>
                  )}
                  {assignment.statusTags.includes('completed_work') && (
                    <Badge color="success">Entregado</Badge>
                  )}
                  {assignment.statusTags.includes('self_evaluation_pending') && (
                    <Badge color="warning">Autoevaluación Pendiente</Badge>
                  )}
                  {assignment.statusTags.includes('self_evaluation_completed') && (
                    <Badge color="success">Autoevaluación Realizada</Badge>
                  )}
                  {assignment.statusTags.includes('evaluation_pending') && (
                    <Badge color="warning">Evaluación Pendiente</Badge>
                  )}
                  {assignment.statusTags.includes('evaluation_completed') && (
                    <Badge color="success">Evaluación Realizada</Badge>
                  )}
                </p>
                <h4>{assignment.shortDescription}</h4>
                <p>{assignment.description}</p>
                <p>
                  <b>Consigna:</b>{' '}
                  {assignment.attachment && (
                    <a
                      href={assignment.attachment.secureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {assignment.attachment.filename}
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
                      {!assignment.canEdit &&
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
                              : rw.assignmentWork.attachment && rw.assignmentWork.attachment.url
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
                    {!assignment.canEdit &&
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
                          <Button component="span" loading={this.isSubmitting(rw.id)}>
                            Subir componente
                          </Button>
                        </label>
                      ) : (
                        <Button onClick={this.handleLink(rw.id)}>Subir componente</Button>
                      ))}
                  </div>
                ))}
                {assignment.canEdit && (
                  <Button
                    color="primary"
                    fullWidth
                    component={Link}
                    to={`/assignments/${assignment.id}/edit`}
                  >
                    Editar trabajo práctico
                  </Button>
                )}
                {!assignment.canEdit && (
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
            );
          }}
        </Query>
      </Content>
    );
  }
}

Assignment.propTypes = {
  me: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Assignment));
