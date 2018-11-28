import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import Icon from '@material-ui/core/Icon';

import Button from 'components/material-kit-react/CustomButtons/Button';
import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';

import Card from 'components/material-dashboard-react/Card/Card';
import CardHeader from 'components/material-dashboard-react/Card/CardHeader';
import CardFooter from 'components/material-dashboard-react/Card/CardFooter';
import CardIcon from 'components/material-dashboard-react/Card/CardIcon';

import dashboardStyle from 'assets/jss/material-dashboard-react/views/dashboardStyle';

import Dashboard from '../../layouts/Dashboard';

import { studentsFetch } from '../../actions/student';
import { assignmentsFetch } from '../../actions/assignment';

const styles = {
  ...dashboardStyle,
};

class Home extends Component {
  componentDidMount() {
    const { dispatchStudentsFetch, dispatchAssignmentsFetch } = this.props;
    dispatchStudentsFetch();
    dispatchAssignmentsFetch();
  }

  render() {
    const { classes, currentUser, students, assignments } = this.props;

    const isTutor = !!currentUser.tutoredWorkshops.length;

    return (
      <Dashboard>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={4}>
            <Card className={classes.card}>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Icon>person</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Miembros del taller</p>
                <h3 className={classes.cardTitle}>{students.all.length}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  {isTutor ? (
                    <Link to="/works">Ver miembros del taller</Link>
                  ) : (
                    <Link to="/students">Ver miembros del taller</Link>
                  )}
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card className={classes.card}>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>
                  {isTutor ? 'Evaluaciones pendientes' : 'Trabajos prácticos pendientes'}
                </p>
                <h3 className={classes.cardTitle}>
                  {isTutor ? assignments.pendingEvaluationCount : assignments.pendingCount}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  {isTutor ? (
                    <Link to="/evaluations/pending">Ver evaluaciones pendientes</Link>
                  ) : (
                    <Link to="/assignments/pending">Ver trabajos prácticos pendientes</Link>
                  )}
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card className={classes.card}>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>
                  {isTutor ? 'Evaluaciones realizadas' : 'Trabajos prácticos entregados'}
                </p>
                <h3 className={classes.cardTitle}>
                  {isTutor ? assignments.completedEvaluationCount : assignments.completedCount}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  {isTutor ? (
                    <Link to="/evaluations/completed">Ver evaluaciones realizadas</Link>
                  ) : (
                    <Link to="/assignments/completed">Ver trabajos prácticos entregados</Link>
                  )}
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        {currentUser.tutoredWorkshops.map(workshop => (
          <div className={classes.description}>
            <h3>{workshop.name}</h3>
            <Button color="primary" component={Link} to="/assignments/new">
              Crear nuevo Trabajo Práctico
            </Button>
          </div>
        ))}
      </Dashboard>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  students: PropTypes.object.isRequired,
  assignments: PropTypes.object.isRequired,
  dispatchStudentsFetch: PropTypes.func.isRequired,
  dispatchAssignmentsFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  students: state.students,
  assignments: state.assignments,
});

const mapDispatchToProps = dispatch => ({
  dispatchStudentsFetch: () => dispatch(studentsFetch()),
  dispatchAssignmentsFetch: () => dispatch(assignmentsFetch()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Home));
