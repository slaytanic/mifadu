import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Image, Transformation } from 'cloudinary-react';

import withStyles from '@material-ui/core/styles/withStyles';

import Button from 'components/material-kit-react/CustomButtons/Button';
import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';
import Badge from 'components/material-kit-react/Badge/Badge';

import EvaluationForm from 'components/Assignment/EvaluationForm';

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

  selectStudent = studentId => () => {
    this.setState({ selectedStudent: studentId, selectedAssignment: null });
  };

  selectAssignment = assignmentId => () => {
    const { dispatchAssignmentFetch } = this.props;
    this.setState({ selectedAssignment: null }, () => {
      dispatchAssignmentFetch(assignmentId).then(() => {
        this.setState({ selectedAssignment: assignmentId });
      });
    });
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
                  <h4>{assignment.shortDescription}</h4>
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
                  <h6>Evaluación</h6>
                  <EvaluationForm
                    assignment={assignment}
                    currentUser={currentUser}
                    targetUserId={selectedStudent}
                    inPlace={true}
                  />
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
