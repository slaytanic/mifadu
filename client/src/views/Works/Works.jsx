import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Image, Transformation } from 'cloudinary-react';

import withStyles from '@material-ui/core/styles/withStyles';

import CloudDownload from '@material-ui/icons/CloudDownload';
import Info from '@material-ui/icons/Info';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

import Button from 'components/material-kit-react/CustomButtons/Button';
import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';
import Badge from 'components/material-kit-react/Badge/Badge';

import CustomTable from 'components/CustomTable/CustomTable';
import Modal from 'components/Modal/Modal';

import Content from 'layouts/Content';

import { assignmentsFetch, assignmentFetch } from '../../actions/assignment';
import { studentsFetch } from '../../actions/student';

const styles = {
  buttonLink: {
    background: 'none !important',
    color: 'inherit',
    border: 'none',
    padding: '0 !important',
    font: 'inherit',
    /*border is optional*/
    // borderBottom: '1px solid #444',
    cursor: 'pointer',
  },
};

class Works extends React.Component {
  state = {
    selectedStudent: null,
    selectedAssignment: null,
    subtitle: '',
  };

  componentDidMount() {
    const { dispatchStudentsFetch, dispatchAssignmentsFetch } = this.props;
    dispatchStudentsFetch();
    dispatchAssignmentsFetch();
  }

  // componentDidUpdate(prevProps) {
  //   const { assignments, match } = this.props;
  //   if (
  //     assignments.loadedAt !== prevProps.assignments.loadedAt ||
  //     match.params.filter !== prevProps.match.params.filter
  //   ) {
  //     this.filterAssignments();
  //   }
  // }

  selectStudent = studentId => () => {
    this.setState({ selectedStudent: studentId, selectedAssignment: null });
  };

  selectAssignment = assignmentId => () => {
    const { dispatchAssignmentFetch } = this.props;
    dispatchAssignmentFetch(assignmentId);
    this.setState({ selectedAssignment: assignmentId });
  };

  filterAssignments = () => {
    const { assignments, match } = this.props;
    switch (match.params.filter) {
      case 'pending':
        this.setState({
          subtitle: 'Pendientes de entrega',
          filteredAssignments: assignments.all.filter(a => a.statusTags.includes('pending_work')),
        });
        break;
      case 'completed':
        this.setState({
          subtitle: 'Entregados',
          filteredAssignments: assignments.all.filter(a => a.statusTags.includes('completed_work')),
        });
        break;
      case 'pending_evaluation':
        this.setState({
          subtitle: 'Pendientes de evaluación',
          filteredAssignments: assignments.all.filter(a =>
            a.statusTags.includes('pending_evaluation'),
          ),
        });
        break;
      case 'completed_evaluation':
        this.setState({
          subtitle: 'Pendientes de evaluación',
          filteredAssignments: assignments.all.filter(a =>
            a.statusTags.includes('completed_evaluation'),
          ),
        });
        break;
      default:
        this.setState({
          subtitle: 'Todos los trabajos prácticos',
          filteredAssignments: [...assignments.all],
        });
    }
  };

  render() {
    const { classes, currentUser, assignments, students } = this.props;
    const { subtitle, selectedStudent, selectedAssignment } = this.state;

    const assignment = assignments.all.find(a => a.id === selectedAssignment);

    return (
      <Content title="Trabajos prácticos" subtitle={subtitle}>
        <div className={classes.root}>
          <GridContainer>
            <GridItem md={4}>
              <ul>
                {students.all.map(student => (
                  <li key={student.id}>
                    <button className={classes.buttonLink} onClick={this.selectStudent(student.id)}>
                      {student.id === selectedStudent ? (
                        <b>{student.fullName}</b>
                      ) : (
                        student.fullName
                      )}
                    </button>
                    {student.id === selectedStudent && (
                      <ul>
                        {assignments.all.map(assignment => (
                          <li key={`${student.id}-${assignment.id}`}>
                            <button
                              className={classes.buttonLink}
                              onClick={this.selectAssignment(assignment.id)}
                            >
                              {assignment.id === selectedAssignment ? (
                                <b>{assignment.name}</b>
                              ) : (
                                assignment.name
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </GridItem>
            <GridItem md={8}>
              {assignment ? (
                <div>
                  <h3>{assignment.name}</h3>
                  {/* <p>
                    {!currentUser.tutoredWorkshops
                      .map(tw => tw.id)
                      .includes(assignment.workshop.id) &&
                      assignment.statusTags.includes('pending_work') && (
                        <Badge color="warning">Pendiente</Badge>
                      )}
                    {!currentUser.tutoredWorkshops
                      .map(tw => tw.id)
                      .includes(assignment.workshop.id) &&
                      assignment.statusTags.includes('completed_work') && (
                        <Badge color="success">Entregado</Badge>
                      )}
                    {!currentUser.tutoredWorkshops
                      .map(tw => tw.id)
                      .includes(assignment.workshop.id) &&
                      assignment.statusTags.includes('self_evaluation_pending') && (
                        <Badge color="warning">Autoevaluación Pendiente</Badge>
                      )}
                    {!currentUser.tutoredWorkshops
                      .map(tw => tw.id)
                      .includes(assignment.workshop.id) &&
                      assignment.statusTags.includes('self_evaluation_completed') && (
                        <Badge color="success">Autoevaluación Realizada</Badge>
                      )}
                    {!currentUser.tutoredWorkshops
                      .map(tw => tw.id)
                      .includes(assignment.workshop.id) &&
                      assignment.statusTags.includes('self_evaluation_completed') &&
                      assignment.statusTags.includes('evaluation_pending') && (
                        <Badge color="warning">Evaluación Pendiente</Badge>
                      )}
                    {!currentUser.tutoredWorkshops
                      .map(tw => tw.id)
                      .includes(assignment.workshop.id) &&
                      assignment.statusTags.includes('self_evaluation_completed') &&
                      assignment.statusTags.includes('evaluation_completed') && (
                        <Badge color="success">Evaluación Realizada</Badge>
                      )}
                  </p> */}
                  <h4>{assignment.shortDescription}</h4>
                  {/* <p>{assignment.description}</p>
                  <p>
                    <b>Consigna:</b>{' '}
                    {assignment.attachment && (
                      <a href={assignment.attachment.url} target="_blank" rel="noopener noreferrer">
                        {assignment.attachment.name}
                      </a>
                    )}
                  </p> */}
                  {/* <p>
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
                  </p> */}
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
                        {rw.assignmentWorks.find(aw => aw.user.id === selectedStudent) ? (
                          <Fragment>
                            <a
                              href={
                                rw.assignmentWorks.find(aw => aw.user.id === selectedStudent)
                                  .content
                                  ? rw.assignmentWorks.find(aw => aw.user.id === selectedStudent)
                                      .content
                                  : rw.assignmentWorks.find(aw => aw.user.id === selectedStudent)
                                      .attachment &&
                                    rw.assignmentWorks.find(aw => aw.user.id === selectedStudent)
                                      .attachment.url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {rw.description} ({rw.type})
                            </a>
                            {rw.assignmentWorks.find(aw => aw.user.id === selectedStudent)
                              .attachment &&
                              rw.assignmentWorks.find(aw => aw.user.id === selectedStudent)
                                .attachment.url && (
                                <Fragment>
                                  <br />
                                  <a
                                    href={
                                      rw.assignmentWorks.find(aw => aw.user.id === selectedStudent)
                                        .attachment.url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Image
                                      publicId={`${
                                        rw.assignmentWorks.find(
                                          aw => aw.user.id === selectedStudent,
                                        ).attachment.publicId
                                      }.png`}
                                    >
                                      <Transformation width="200" crop="scale" />
                                    </Image>
                                  </a>
                                </Fragment>
                              )}
                          </Fragment>
                        ) : (
                          `${rw.description} (${rw.type})`
                        )}
                      </p>
                      {!currentUser.tutoredWorkshops
                        .map(tw => tw.id)
                        .includes(assignment.workshop.id) &&
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
                </div>
              ) : (
                <p>Elija un trabajo práctico</p>
              )}
            </GridItem>
          </GridContainer>
        </div>
      </Content>
    );
  }
}

Works.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  assignments: PropTypes.object.isRequired,
  students: PropTypes.object.isRequired,
  dispatchStudentsFetch: PropTypes.func.isRequired,
  dispatchAssignmentsFetch: PropTypes.func.isRequired,
  dispatchAssignmentFetch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  assignments: state.assignments,
  students: state.students,
});

const mapDispatchToProps = dispatch => ({
  dispatchStudentsFetch: () => dispatch(studentsFetch()),
  dispatchAssignmentsFetch: () => dispatch(assignmentsFetch()),
  dispatchAssignmentFetch: id => dispatch(assignmentFetch(id)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withStyles(styles)(Works)),
);
