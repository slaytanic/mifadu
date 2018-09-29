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

const styles = {
  ...dashboardStyle,
};

class Home extends Component {
  render() {
    const { classes, currentUser } = this.props;

    return (
      <Dashboard>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={4}>
            <Card className={classes.card}>
              <CardHeader color="primary" stats icon>
                <CardIcon color="primary">
                  <Icon>person</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Miembros del taller</p>
                <h3 className={classes.cardTitle}>{10}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Link to="/users">Ver miembros del taller</Link>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        <div className={classes.description}>
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
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
});

// const mapDispatchToProps = dispatch => ({
//   dispatchCurrentUserFetch: () => dispatch(currentUserFetch()),
// });

export default connect(
  mapStateToProps,
  // mapDispatchToProps,
  null,
)(withStyles(styles)(Home));
