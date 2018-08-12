import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { NavLink, withRouter } from 'react-router-dom';

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
import GridContainer from '../components/Grid/GridContainer';
import GridItem from '../components/Grid/GridItem';

import dashboardStyle from '../assets/jss/material-dashboard-react/views/dashboardStyle';

import AssignmentForm from '../components/AssignmentForm';

import { getMyAssignments, getAssignment } from '../data/service';

// import LoginForm from '../components/LoginForm';

const styles = theme => ({
  ...dashboardStyle,
  root: {
    display: 'flex',
  },
});

class AssignmentPage extends Component {
  state = {
    assignments: [],
    assignment: null,
  };

  componentDidMount() {
    if (this.props.match.params.action === 'new') {
      this.setState({ assignment: {} });
    } else if (this.props.match.params.id) {
      getAssignment(this.props.match.params.id).then(res => {
        this.setState({ assignment: res.data.data.assignment });
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <GridContainer>
          <GridItem xs={12}>
            <AssignmentForm />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

AssignmentPage.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AssignmentPage));
