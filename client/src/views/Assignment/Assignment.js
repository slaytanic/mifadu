import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Query, compose, graphql } from 'react-apollo';
import { Image } from 'cloudinary-react';

import withStyles from '@material-ui/core/styles/withStyles';
import Delete from '@material-ui/icons/Delete';

import Button from 'components/CustomButton/CustomButton';
import CustomInput from 'components/material-kit-react/CustomInput/CustomInput';
import Badge from 'components/material-kit-react/Badge/Badge';

import Modal from 'components/Modal/Modal';

import Content from 'layouts/Content/Content';

import ASSIGNMENT_QUERY from 'graphql/queries/Assignment';
import SUBMIT_ASSIGNMENT_WORK from 'graphql/mutations/SubmitAssignmentWork';
import DELETE_ASSIGNMENT_WORK from 'graphql/mutations/DeleteAssignmentWork';

const styles = {
  assignmentWorks: {
    display: 'flex',
  },
  assignmentWork: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.25rem',
  },
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
    deleteModal: false,
    requiredWorkId: '',
    assignmentWorkId: '',
    content: '',
    submitting: {},
  };

  handleUpload = requiredWorkId => async event => {
    const { match, submitAssignmentWork } = this.props;
    this.setState(prevState => ({
      submitting: { ...prevState.submitting, [requiredWorkId]: true },
    }));
    await submitAssignmentWork({
      variables: {
        id: match.params.id,
        requiredWorkId,
        input: {
          attachment: event.target.files[0],
        },
      },
    });
    this.setState(prevState => ({
      submitting: { ...prevState.submitting, [requiredWorkId]: false },
    }));
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
    const { match, submitAssignmentWork } = this.props;
    const { requiredWorkId, content } = this.state;
    submitAssignmentWork({
      variables: {
        id: match.params.id,
        requiredWorkId,
        input: {
          content,
        },
      },
    });
    this.setState({ modal: false });
  };

  render() {
    const { match, classes, deleteAssignmentWork } = this.props;
    const { modal, content, deleteModal, requiredWorkId, assignmentWorkId } = this.state;

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
        <Modal
          color="danger"
          open={deleteModal}
          titleText="Eliminar componente"
          bodyText="Está seguro que desea borrar el componente de entrega?"
          okText="Borrar"
          cancelText="Cancelar"
          handleOk={async () => {
            await deleteAssignmentWork({
              variables: {
                id: match.params.id,
                requiredWorkId: requiredWorkId,
                assignmentWorkId: assignmentWorkId,
              },
            });
            this.setState({ deleteModal: false });
          }}
          handleCancel={() => this.setState({ deleteModal: false })}
        ></Modal>
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
                  <div key={rw.id} className={classes.requiredWork}>
                    <h6>Componente de entrega #{index + 1}</h6>
                    <p>
                      {!assignment.canEdit &&
                        (rw.myAssignmentWorks.length ? (
                          <Badge color="success">Entregado</Badge>
                        ) : (
                          <Badge color="warning">Pendiente</Badge>
                        ))}
                    </p>
                    <p>
                      {rw.description} ({rw.type})
                    </p>
                    <div className={classes.assignmentWorks}>
                      {rw.myAssignmentWorks.map((assignmentWork, i) => (
                        <div className={classes.assignmentWork}>
                          <a
                            href={
                              assignmentWork.attachment
                                ? assignmentWork.attachment.secureUrl
                                : assignmentWork.content
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {assignmentWork.attachment ? (
                              <Image
                                publicId={assignmentWork.attachment.publicId}
                                width="200"
                              ></Image>
                            ) : (
                              `Link #${i + 1}`
                            )}
                          </a>

                          <Button justIcon round color="danger">
                            <Delete
                              style={{ color: '#FFFFFF' }}
                              onClick={() => {
                                this.setState({
                                  deleteModal: true,
                                  requiredWorkId: rw.id,
                                  assignmentWorkId: assignmentWork.id,
                                });
                              }}
                            />
                          </Button>
                        </div>
                      ))}
                    </div>

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

export default compose(
  graphql(SUBMIT_ASSIGNMENT_WORK, {
    name: 'submitAssignmentWork',
  }),
  graphql(DELETE_ASSIGNMENT_WORK, {
    name: 'deleteAssignmentWork',
  }),
  withRouter,
  withStyles(styles),
)(Assignment);
