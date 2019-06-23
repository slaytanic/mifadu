import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Image } from 'cloudinary-react';
import { Query, graphql, compose } from 'react-apollo';

import withStyles from '@material-ui/core/styles/withStyles';

import Button from 'components/material-kit-react/CustomButtons/Button';
import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';
import Badge from 'components/material-kit-react/Badge/Badge';

import EvaluationForm from 'views/Assignment/EvaluationForm';

import Content from 'layouts/Content/Content';

import WORKSHOP_ASSIGNMENT_QUERY from 'graphql/queries/WorkshopAssignment';
import WORKSHOP_MEMBERS_QUERY from 'graphql/queries/WorkshopMembers';
import WORKSHOP_ASSIGNMENTS_QUERY from 'graphql/queries/WorkshopAssignments';

const styles = {
  buttonLink: {
    background: 'none !important',
    color: 'inherit',
    border: 'none',
    padding: '0 !important',
    font: 'inherit',
    cursor: 'pointer',
  },
};

function Evaluations({ match, classes, assignments, assignment, members }) {
  if (!members) return null;
  return (
    <Content title="Trabajos prácticos" subtitle="Evaluaciones">
      <div className={classes.root}>
        <GridContainer>
          <GridItem md={4}>
            <ul>
              {members
                .filter(m => !m.isTutor)
                .map(student => (
                  <li key={student.id}>
                    <Link to={`/workshops/${match.params.id}/evaluations/${student.id}`}>
                      {student.id === match.params.studentId ? (
                        <b>{student.fullName}</b>
                      ) : (
                        student.fullName
                      )}
                    </Link>
                    {student.id === match.params.studentId && (
                      <ul>
                        {assignments.map(assignment => (
                          <li key={`${student.id}-${assignment.id}`}>
                            <Link
                              to={`/workshops/${match.params.id}/evaluations/${match.params.studentId}/${assignment.id}`}
                            >
                              {assignment.id === match.params.assignmentId ? (
                                <b>{assignment.name}</b>
                              ) : (
                                assignment.name
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
            </ul>
          </GridItem>
          <GridItem md={8}>
            {match.params.assignmentId && assignment ? (
              <div>
                <h3>{assignment.name}</h3>
                <h4>{assignment.shortDescription}</h4>
                {(assignment.requiredWork || []).map((rw, index) => (
                  <div key={rw.id}>
                    <h6>Componente de entrega #{index + 1}</h6>
                    <div className={classes.assignmentWorks}>
                      {rw.assignmentWorks.map((assignmentWork, i) => (
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
                                publicId={`${assignmentWork.attachment.publicId}.png`}
                                width="200"
                                crop="fill"
                              ></Image>
                            ) : (
                              `Link #${i + 1}`
                            )}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <h6>Evaluación</h6>
                <EvaluationForm
                  assignment={assignment}
                  targetUserId={match.params.studentId}
                  inPlace
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

Evaluations.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  assignments: PropTypes.object.isRequired,
  students: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default compose(
  // graphql(DELETE_ASSIGNMENT, {
  //   name: 'deleteAssignment',
  //   // options: {
  //   //   update: (cache, { data: { createTag } }) => {
  //   //     const data = cache.readQuery({ query: TAGS_QUERY });
  //   //     data.tags.push(createTag);
  //   //     cache.writeQuery({ query: TAGS_QUERY, data });
  //   //   },
  //   // },
  // }),
  graphql(WORKSHOP_ASSIGNMENT_QUERY, {
    options: ({ match }) => ({
      variables: { id: match.params.assignmentId, userId: match.params.studentId },
    }),
    props: ({ data }) => ({
      assignment: data.assignment,
    }),
  }),
  graphql(WORKSHOP_ASSIGNMENTS_QUERY, {
    options: ({ match }) => ({ variables: { id: match.params.id } }),
    props: ({ data }) => ({
      assignments: data && data.workshop ? data.workshop.assignments : [],
    }),
  }),
  graphql(WORKSHOP_MEMBERS_QUERY, {
    options: ({ match }) => ({ variables: { id: match.params.id } }),
    props: ({ data }) => ({
      members: data && data.workshop ? data.workshop.members : [],
    }),
  }),
  withStyles(styles),
  withRouter,
)(Evaluations);
