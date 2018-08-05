import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { getSubjects, getWorkshops } from '../data/service';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  doubleWidthField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400 + theme.spacing.unit * 2,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  navLink: {
    textDecoration: 'none',
    color: 'unset',
  },
});

class LoginForm extends Component {
  state = {
    email: '',
    password: '',
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <Grid container>
          <Grid item xs="12">
            <TextField
              required
              id="email"
              label="e-mail"
              className={classes.textField}
              value={this.state.email}
              onChange={this.handleChange('email')}
              margin="normal"
            />
          </Grid>

          <Grid item xs="12">
            <TextField
              required
              id="password"
              label="Clave"
              className={classes.textField}
              type="password"
              margin="normal"
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleLogin}
        >
          Ingresar
        </Button>
        <NavLink to="/register" className={classes.navLink}>
          <ListItem button>
            <ListItemText primary="¿No ten&eacute;s cuenta?" />
          </ListItem>
        </NavLink>
      </form>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginForm);
