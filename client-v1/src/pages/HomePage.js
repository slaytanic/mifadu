import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';

import BannerOne from '../components/BannerOne/BannerOne';
// import BannerTwo from '../components/BannerTwo/BannerTwo';

const styles = theme => ({
  root: {
    // ...theme.mixins.gutters(),
    // paddingTop: theme.spacing.unit * 2,
    // paddingBottom: theme.spacing.unit * 2,
    // marginLeft: 0,
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class HomePage extends Component {
  render() {
    const { classes } = this.props;

    let loginLogout;
    if (this.props.user) {
      loginLogout = (
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.props.logoutUser}
        >
          Salir
          <Icon className={classes.rightIcon}>send</Icon>
        </Button>
      );
    } else {
      loginLogout = (
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          component={Link}
          to="/login"
        >
          Ingresar
          <Icon className={classes.rightIcon}>send</Icon>
        </Button>
      );
    }

    return (
      // <Paper>
      <BannerOne />
      // <BannerTwo />
      // </Paper>
      // <Grid container className={classes.root} spacing={16}>
      //   <Grid item xs={12}>
      //     <Typography variant="headline" component="h3">
      //       MiFADU
      //     </Typography>
      //     <Typography component="p">
      //       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
      //       eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
      //       ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
      //       aliquip.
      //     </Typography>
      //     {loginLogout}
      //   </Grid>
      // </Grid>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
