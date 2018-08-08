import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

import ErrorList from './ErrorList';

import { getSubjects, getWorkshops, createOrUpdateUser } from '../data/service';

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
});

const userTypes = [
  { value: 'student', label: 'Estudiante' },
  { value: 'tutor', label: 'Profesor' },
];

const genders = [
  { value: 'female', label: 'Femenino' },
  { value: 'male', label: 'Masculino' },
  { value: 'other', label: 'Otro' },
];

const states = [
  { value: 'CABA', label: 'Ciudad Aut&oacute;noma de Buenos Aires' },
  { value: 'BA', label: 'Buenos Aires' },
];

const cities = {
  CABA: [{ value: 'CABA', label: 'Ciudad Aut&oacute;noma de Buenos Aires' }],
  BA: [{ value: 'Campana', label: 'Campana' }],
};

class RegistrationForm extends Component {
  state = {
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    acceptedTerms: false,
    receiveNews: false,
    subjects: [],
    workshops: [],
    externalProvider: false,
    errors: [],
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      errors: this.state.errors.filter(error => error.name != name),
    });
  };

  toggleCheckbox = name => () => {
    this.setState({
      [name]: !this.state[name],
    });
  };

  handleRegister = history => {
    const errors = [];

    if (this.state.password != this.state.passwordConfirmation) {
      errors.push({
        name: 'passwordConfirmation',
        message: 'La confirmación de la clave no coincide',
      });
    }

    if (!this.state.externalProvider && this.state.password.length < 8) {
      errors.push({
        name: 'password',
        message: 'La clave debe tener al menos 8 caracteres',
      });
    }

    if (this.state.email.length < 1) {
      errors.push({
        name: 'email',
        message: 'El e-mail debe ser válido',
      });
    }

    if (this.state.firstName.length < 1) {
      errors.push({
        name: 'firstName',
        message: 'El nombre debe ser válido',
      });
    }

    if (this.state.lastName.length < 1) {
      errors.push({
        name: 'lastName',
        message: 'El apellido debe ser válido',
      });
    }

    if (this.state.acceptedTerms !== true) {
      errors.push({
        name: 'acceptedTerms',
        message: 'Debe aceptar los términos y condiciones de uso',
      });
    }

    if (errors.length < 1) {
      const input = (({
        firstName,
        lastName,
        idNumber,
        email,
        acceptedTerms,
        receiveNews,
      }) => ({
        firstName,
        lastName,
        idNumber,
        email,
        acceptedTerms,
        receiveNews,
      }))(this.state);
      createOrUpdateUser({ ...input, completedProfile: true })
        .then(response => {
          this.props.setCurrentUser(response.data.data.createOrUpdateUser);
          this.props.history.push('/');
        })
        .catch(() => {});
    }
    this.setState({ errors });
  };

  hasError = name => () => {
    console.log(name);
    const error = this.state.errors.find(error => error.name === name);
    if (error) {
      console.log(error.message);
    }
    return error ? error.message : '';
  };

  constructor(props) {
    super(props);
    if (props.user) {
      this.state = { ...this.state, ...props.user, externalProvider: true };
    }
  }

  componentDidMount() {
    getSubjects().then(res => {
      const { subjects } = res.data.data;
      this.setState({ subjects });
    });

    getWorkshops().then(res => {
      const { workshops } = res.data.data;
      this.setState({ workshops });
    });
  }

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
              id="first-name"
              label="Nombre"
              className={classes.textField}
              value={this.state.firstName}
              onChange={this.handleChange('firstName')}
              margin="normal"
            />
            <TextField
              required
              id="last-name"
              label="Apellido"
              className={classes.textField}
              value={this.state.lastName}
              onChange={this.handleChange('lastName')}
              margin="normal"
            />
          </Grid>
          <Grid item xs="12">
            <TextField
              required
              id="email"
              label="e-mail"
              disabled={this.state.externalProvider}
              className={classes.doubleWidthField}
              value={this.state.email}
              onChange={this.handleChange('email')}
              helperText={
                this.state.externalProvider
                  ? 'No se puede cambiar ya que viene de un proovedor externo'
                  : 'Será usado como usuario del sitio web'
              }
              margin="normal"
            />
          </Grid>
          {!this.state.externalProvider && (
            <Grid item xs="12">
              <TextField
                required
                id="password"
                label="Clave"
                className={classes.textField}
                onChange={this.handleChange('password')}
                type="password"
                margin="normal"
              />
              <TextField
                required
                id="password-confirmation"
                label="Confirmar clave"
                className={classes.textField}
                onChange={this.handleChange('passwordConfirmation')}
                error={this.state.errors.find(
                  error => error.name === 'passwordConfirmation',
                )}
                type="password"
                margin="normal"
              />
            </Grid>
          )}
          {/* <Grid item xs="12">
            <TextField
              required
              id="user-type"
              select
              label="Tipo de usuario"
              className={classes.textField}
              value={this.state.userType}
              onChange={this.handleChange('userType')}
              InputLabelProps={{
                shrink: true,
              }}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin="normal"
            >
              {userTypes.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required
              id="gender"
              select
              label="G&eacute;nero"
              className={classes.textField}
              value={this.state.gender}
              onChange={this.handleChange('gender')}
              InputLabelProps={{
                shrink: true,
              }}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin="normal"
            >
              {genders.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs="12">
            <TextField
              required
              id="birthday"
              label="Fecha de nacimiento"
              type="date"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
          </Grid>
          <Grid item xs="12">
            <Typography variant="headline" component="h3">
              Informaci&oacute;n Academica
            </Typography>
            <TextField
              required
              id="user-type"
              select
              label="Tipo de usuario"
              className={classes.textField}
              value={this.state.userType}
              onChange={this.handleChange('userType')}
              InputLabelProps={{
                shrink: true,
              }}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin="normal"
            >
              {userTypes.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required
              id="gender"
              label="G&eacute;nero"
              className={classes.textField}
              margin="normal"
            />
            <TextField
              required
              id="birthday"
              label="Fecha de nacimiento"
              type="date"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
          </Grid> */}
          <Grid item xs="12">
            <FormControlLabel
              label="Acepto recibir informaci&oacute;n y novedades de MIFADU"
              control={
                <Checkbox
                  checked={this.state.receiveNews}
                  onChange={this.toggleCheckbox('receiveNews')}
                />
              }
            />
          </Grid>
          <Grid item xs="12">
            <FormControlLabel
              label="Acepto los t&eacute;rminos y condiciones de uso"
              control={
                <Checkbox
                  checked={this.state.acceptedTerms}
                  onChange={this.toggleCheckbox('acceptedTerms')}
                />
              }
            />
          </Grid>
          <Grid item xs="12">
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.handleRegister}
            >
              Registrarme
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}

RegistrationForm.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(RegistrationForm));
