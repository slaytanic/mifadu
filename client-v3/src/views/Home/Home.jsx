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

const styles = {
  ...dashboardStyle,
};

class Home extends Component {
  componentDidMount() {
    const { dispatchStudentsFetch } = this.props;
    dispatchStudentsFetch();
  }

  render() {
    const { classes, currentUser, students } = this.props;

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
                  <Link to="/students">Ver miembros del taller</Link>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card className={classes.card}>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>person</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Miembros del taller</p>
                <h3 className={classes.cardTitle}>{students.all.length}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Link to="/students">Ver miembros del taller</Link>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card className={classes.card}>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Icon>person</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Miembros del taller</p>
                <h3 className={classes.cardTitle}>{students.all.length}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Link to="/students">Ver miembros del taller</Link>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        <div className={classes.description}>
          <Button color="primary" component={Link} to="/assignments/new">
            Crear nuevo Trabajo Práctico
          </Button>
          {currentUser.tutoredWorkshops.map(() => (
            <Button color="primary" component={Link} to="/assignments/new">
              Crear nuevo Trabajo Práctico
            </Button>
          ))}
        </div>
      </Dashboard>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  students: PropTypes.object.isRequired,
  dispatchStudentsFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  students: state.students,
});

const mapDispatchToProps = dispatch => ({
  dispatchStudentsFetch: () => dispatch(studentsFetch()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Home));
