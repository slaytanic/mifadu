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

import LoginForm from '../components/LoginForm';

const styles = theme => ({
  root: {
    // ...theme.mixins.gutters(),
    // paddingTop: theme.spacing.unit * 2,
    // paddingBottom: theme.spacing.unit * 2,
    // backgroundColor: '#ff0000',
    alignItems: 'center',
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

class LoginPage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        {/* <Grid container className={classes.root} spacing={16}>
          <Grid item xs={12}>
            <Typography variant="headline" component="h3">
              Ingres&aacute; a MiFADU
            </Typography>
            <Typography component="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip.
            </Typography>
          </Grid>
        </Grid> */}
        <Grid
          container
          className={classes.root}
          // spacing={16}
          direction="column"
        >
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="title">
                Ingresar con redes sociales
              </Typography>

              <Button
                // variant="contained"
                color="primary"
                className={classes.button}
                href="/auth/google"
              >
                <SvgIcon className={classes.rightIcon}>
                  <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M19.5,12H18V10.5H17V12H15.5V13H17V14.5H18V13H19.5V12M9.65,11.36V12.9H12.22C12.09,13.54 11.45,14.83 9.65,14.83C8.11,14.83 6.89,13.54 6.89,12C6.89,10.46 8.11,9.17 9.65,9.17C10.55,9.17 11.13,9.56 11.45,9.88L12.67,8.72C11.9,7.95 10.87,7.5 9.65,7.5C7.14,7.5 5.15,9.5 5.15,12C5.15,14.5 7.14,16.5 9.65,16.5C12.22,16.5 13.96,14.7 13.96,12.13C13.96,11.81 13.96,11.61 13.89,11.36H9.65Z" />
                </SvgIcon>
              </Button>
              <Button
                // variant="contained"
                color="primary"
                className={classes.button}
                href="/auth/facebook"
              >
                <SvgIcon className={classes.rightIcon}>
                  <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M18,5H15.5A3.5,3.5 0 0,0 12,8.5V11H10V14H12V21H15V14H18V11H15V9A1,1 0 0,1 16,8H18V5Z" />
                </SvgIcon>
              </Button>
              <Button
                // variant="contained"
                color="primary"
                className={classes.button}
                href="/auth/twitter"
              >
                <SvgIcon className={classes.rightIcon}>
                  <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M17.71,9.33C18.19,8.93 18.75,8.45 19,7.92C18.59,8.13 18.1,8.26 17.56,8.33C18.06,7.97 18.47,7.5 18.68,6.86C18.16,7.14 17.63,7.38 16.97,7.5C15.42,5.63 11.71,7.15 12.37,9.95C9.76,9.79 8.17,8.61 6.85,7.16C6.1,8.38 6.75,10.23 7.64,10.74C7.18,10.71 6.83,10.57 6.5,10.41C6.54,11.95 7.39,12.69 8.58,13.09C8.22,13.16 7.82,13.18 7.44,13.12C7.81,14.19 8.58,14.86 9.9,15C9,15.76 7.34,16.29 6,16.08C7.15,16.81 8.46,17.39 10.28,17.31C14.69,17.11 17.64,13.95 17.71,9.33Z" />
                </SvgIcon>
              </Button>
              {/* <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.showLoginForm}
          >
            Ingresar con e-mail
            <Icon className={classes.rightIcon}>email</Icon>
          </Button> */}
            </Paper>
            <Paper className={classes.paper}>
              <Typography variant="title">Ingresar con e-mail</Typography>

              <LoginForm setCurrentUser={this.props.setCurrentUser} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginPage);