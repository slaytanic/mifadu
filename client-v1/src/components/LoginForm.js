import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ErrorList from './ErrorList';

import { loginUser } from '../data/service';

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
    errors: [],
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleLogin = () => {
    loginUser(this.state.email, this.state.password).then(res => {
      if (res.data.data.loginUser) {
        this.props.setCurrentUser(res.data.data.loginUser);
        this.props.history.push('/');
      } else {
        this.setState({ errors: [{ message: 'Usuario o clave incorrectos' }] });
      }
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <Grid container>
          <Grid item xs="12">
            <ErrorList errors={this.state.errors} />
          </Grid>

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
              value={this.state.password}
              onChange={this.handleChange('password')}
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
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(LoginForm));
