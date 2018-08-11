import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import Icon from '@material-ui/core/Icon';
import SvgIcon from '@material-ui/core/SvgIcon';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';

import Store from '@material-ui/icons/Store';
import Warning from '@material-ui/icons/Warning';
import DateRange from '@material-ui/icons/DateRange';
import LocalOffer from '@material-ui/icons/LocalOffer';
import Update from '@material-ui/icons/Update';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import AccessTime from '@material-ui/icons/AccessTime';
import Accessibility from '@material-ui/icons/Accessibility';
import BugReport from '@material-ui/icons/BugReport';
import Code from '@material-ui/icons/Code';
import Cloud from '@material-ui/icons/Cloud';

import Card from '../components/Card/Card';
import CardHeader from '../components/Card/CardHeader';
import CardIcon from '../components/Card/CardIcon';
import CardBody from '../components/Card/CardBody';
import CardFooter from '../components/Card/CardFooter';
import Danger from '../components/Typography/Danger';
import GridItem from '../components/Grid/GridItem';
import GridContainer from '../components/Grid/GridContainer';

import dashboardStyle from '../assets/jss/material-dashboard-react/views/dashboardStyle';

import { getMyAssignments } from '../data/service';

// import LoginForm from '../components/LoginForm';

const styles = theme => ({
  ...dashboardStyle,
  root: {
    // ...theme.mixins.gutters(),
    // paddingTop: theme.spacing.unit * 2,
    // paddingBottom: theme.spacing.unit * 2,
    // backgroundColor: '#ff0000',
    // alignItems: 'center',
    // justifyContent: 'center',
    display: 'flex',
  },
  card: {
    // maxWidth: '75%',
    // margin: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    // marginRight: theme.spacing.unit,
  },
  rightIcon: {
    // marginLeft: theme.spacing.unit,
  },
  paper: {
    maxWidth: '400px',
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
    // display: 'flex',
    // 'flex-direction': 'column',
  },
});

class StudentDashboardPage extends Component {
  componentDidMount() {
    getMyAssignments().then(res => {
      this.setState({ assignments: res.data.data.myAssignments });
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <GridContainer>
          <GridItem xs={6}>
            <Card className={classes.card}>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Entregas pendientes</p>
                <h3 className={classes.cardTitle}>49/50</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Danger>
                    <Warning />
                  </Danger>
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    Ver entregas pendientes
                  </a>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={6}>
            <Card className={classes.card}>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Entregas realizadas</p>
                <h3 className={classes.cardTitle}>
                  49/50 <small>GB</small>
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Danger>
                    <Warning />
                  </Danger>
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    Ver entregas realizadas
                  </a>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={6}>
            <Card className={classes.card}>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Used Space</p>
                <h3 className={classes.cardTitle}>
                  49/50 <small>GB</small>
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Danger>
                    <Warning />
                  </Danger>
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    Get more space
                  </a>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

StudentDashboardPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudentDashboardPage);
