import React, { Fragment } from 'react';
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

import Dashboard from 'layouts/Dashboard/Dashboard';

const styles = {
  ...dashboardStyle,
};

const Home = ({ classes, me }) => {
  return (
    <Dashboard me={me}>
      {me.workshops.map(workshopAndYear => {
        const isTutor = me.tutoredWorkshops.map(w => w.id).includes(workshopAndYear.id);
        const { workshop, year } = workshopAndYear;

        return (
          <Fragment>
            <div className={classes.description}>
              <h3>
                {workshop.name} ({year})
              </h3>
            </div>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes.card}>
                  <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                      <Icon>person</Icon>
                    </CardIcon>
                    <p className={classes.cardCategory}>Miembros del taller</p>
                    <h3 className={classes.cardTitle}>{workshop.memberCount}</h3>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={classes.stats}>
                      {isTutor ? (
                        <Link to="/works">Ver miembros del taller</Link>
                      ) : (
                        <Link to={`/workshop/${workshop.id}/members`}>Ver miembros del taller</Link>
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
                      {/* {isTutor ? assignments.pendingEvaluationCount : assignments.pendingCount} */}
                      0
                    </h3>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={classes.stats}>
                      {isTutor ? (
                        <Link to={`/workshops/${workshop.id}/${year}/evaluations/completed`}>
                          Ver evaluaciones pendientes
                        </Link>
                      ) : (
                        <Link to={`/workshops/${workshop.id}/${year}/assignments/pending`}>
                          Ver trabajos prácticos pendientes
                        </Link>
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
                      {/* {isTutor ? assignments.completedEvaluationCount : assignments.completedCount} */}
                      0
                    </h3>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={classes.stats}>
                      {isTutor ? (
                        <Link to={`/workshops/${workshop.id}/${year}/evaluations/completed`}>
                          Ver evaluaciones realizadas
                        </Link>
                      ) : (
                        <Link to={`/workshops/${workshop.id}/${year}/assignments/completed`}>
                          Ver trabajos prácticos entregados
                        </Link>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </GridItem>
            </GridContainer>
            {isTutor && (
              <Button color="primary" component={Link} to="/assignments/new">
                Crear nuevo Trabajo Práctico
              </Button>
            )}
          </Fragment>
        );
      })}
    </Dashboard>
  );
};

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
