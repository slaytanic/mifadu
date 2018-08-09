import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

import ErrorList from './ErrorList';

import {
  getSubjects,
  getWorkshops,
  createOrUpdateUser,
  loginUser,
} from '../data/service';

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
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    width: 400 + theme.spacing.unit * 2,
    // minWidth: 120,
    // maxWidth: 300,
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
    allSubjects: [],
    subjects: [],
    workshop: '',
    allWorkshops: [],
    externalProvider: false,
    errors: [],
    previouslyOnThisChair: false,
    previousYearForThisChair: '',
    website: '',
    aboutMe: '',
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      errors: this.state.errors.filter(error => error.name != name),
    });
  };

  handleMultiSelect = name => event => {
    console.log(name);
    console.log(event.target.value);
    this.setState({
      [name]: event.target.value,
      errors: this.state.errors.filter(error => error.name != name),
    });
    console.log(this.state.subjects);
  };

  toggleCheckbox = name => () => {
    this.setState({
      [name]: !this.state[name],
    });
  };

  handleCancel = () => {
    this.props.logoutUser();
    this.props.history.push('/');
  };

  handleRegister = () => {
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

    if (this.state.lastName.length < 1) {
      errors.push({
        name: 'idNumber',
        message: 'El DNI debe ser válido',
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
        password,
        workshop,
        subjects,
        previouslyOnThisChair,
        previousYearForThisChair,
        website,
        aboutMe,
      }) => ({
        firstName,
        lastName,
        idNumber,
        email,
        acceptedTerms,
        receiveNews,
        password,
        workshop,
        subjects,
        previouslyOnThisChair,
        previousYearForThisChair,
        website,
        aboutMe,
      }))(this.state);
      createOrUpdateUser({ ...input, completedProfile: true })
        .then(response => {
          if (response.data.errors) {
            this.setState({
              errors: [{ message: 'Ese e-mail ya se encuentra en uso' }],
            });
          } else {
            this.props.setCurrentUser(response.data.data.createOrUpdateUser);
            if (!this.state.externalProvider) {
              loginUser(this.state.email, this.state.password).then(() => {
                this.props.history.push('/');
              });
            } else {
              this.props.history.push('/');
            }
          }
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
      this.setState({ allSubjects: subjects });
    });

    getWorkshops().then(res => {
      const { workshops } = res.data.data;
      this.setState({ allWorkshops: workshops });
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
              error={this.state.errors.find(
                error => error.name === 'firstName',
              )}
              margin="normal"
            />
            <TextField
              required
              id="last-name"
              label="Apellido"
              className={classes.textField}
              value={this.state.lastName}
              onChange={this.handleChange('lastName')}
              error={this.state.errors.find(error => error.name === 'lastName')}
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
              error={this.state.errors.find(error => error.name === 'email')}
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
                error={this.state.errors.find(
                  error => error.name === 'password',
                )}
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
          <Grid item xs="12">
            <TextField
              required
              id="id-number"
              label="DNI"
              className={classes.doubleWidthField}
              value={this.state.idNumber}
              onChange={this.handleChange('idNumber')}
              error={this.state.errors.find(error => error.name === 'idNumber')}
              margin="normal"
            />
          </Grid>
          <Grid item xs="12">
            <TextField
              required
              id="workshop"
              label="Taller al que pertenece"
              className={classes.doubleWidthField}
              value={this.state.workshop}
              onChange={this.handleChange('workshop')}
              margin="normal"
              select
              // InputLabelProps={{
              //   shrink: true,
              // }}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin="normal"
            >
              {this.state.allWorkshops.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs="12">
            <FormControl className={classes.formControl}>
              <InputLabel required htmlFor="subjects">
                Materias cursadas
              </InputLabel>
              <Select
                multiple
                value={this.state.subjects}
                onChange={this.handleChange('subjects')}
                input={<Input id="subjects" />}
                renderValue={selected =>
                  selected
                    .map(s =>
                      this.state.allSubjects.find(subject => s === subject.id),
                    )
                    .map(subject => subject.name)
                    .join(', ')
                }
                MenuProps={{
                  className: classes.menu,
                }}
              >
                {this.state.allSubjects.map(subject => (
                  <MenuItem key={subject.id} value={subject.id}>
                    <Checkbox
                      checked={this.state.subjects.indexOf(subject.id) > -1}
                    />
                    <ListItemText primary={subject.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <TextField
              required
              id="subjects"
              label="Materias cursadas"
              className={classes.doubleWidthField}
              value={this.state.subjects}
              onChange={this.handleMultiSelect('subjects')}
              margin="normal"
              select
              multiple
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
              {this.state.subjects.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField> */}
          </Grid>
          <Grid item xs="12">
            <FormControlLabel
              label="Cursé Rondina en un año anterior"
              control={
                <Checkbox
                  checked={this.state.previouslyOnThisChair}
                  onChange={this.toggleCheckbox('previouslyOnThisChair')}
                />
              }
            />
          </Grid>
          {this.state.previouslyOnThisChair && (
            <Grid item xs="12">
              <TextField
                id="previous-year-for-this-chair"
                label="En qué año?"
                className={classes.doubleWidthField}
                value={this.state.previousYearForThisChair}
                onChange={this.handleChange('previousYearForThisChair')}
                margin="normal"
              />
            </Grid>
          )}
          <Grid item xs="12">
            <TextField
              id="website"
              label="Tenés un blog/sitio personal?"
              className={classes.doubleWidthField}
              value={this.state.website}
              onChange={this.handleChange('website')}
              margin="normal"
            />
          </Grid>
          <Grid item xs="12">
            <TextField
              id="about-me"
              multiline
              rows="4"
              rowsMax="12"
              label="Nos querés contar algo sobre vos?"
              className={classes.doubleWidthField}
              value={this.state.aboutMe}
              onChange={this.handleChange('aboutMe')}
              margin="normal"
            />
          </Grid>

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
              color="secondary"
              className={classes.button}
              onClick={this.handleCancel}
            >
              Cancelar
            </Button>
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
