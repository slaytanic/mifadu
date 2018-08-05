import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
    name: 'Cat in the Hat',
    age: '',
    multiline: 'Controlled',
    currency: 'EUR',
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
              id="e-mail"
              label="e-mail"
              className={classes.doubleWidthField}
              value={this.state.eMail}
              onChange={this.handleChange('eMail')}
              helperText="Ser&aacute; usado como usuario del sitio web"
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
            <TextField
              required
              id="password-confirmation"
              label="Confirmar clave"
              className={classes.textField}
              type="password"
              margin="normal"
            />
          </Grid>
          <Grid item xs="12">
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
          </Grid>
          <Grid item xs="12">
            <FormControlLabel
              label="Acepto recibir informacion y novedades de MIFADU"
              control={
                <Checkbox
                  checked={this.state.receiveNews}
                  onChange={this.handleChange('receiveNews')}
                  value="true"
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
                  onChange={this.handleChange('acceptedTerms')}
                  value="true"
                />
              }
            />
          </Grid>
        </Grid>
      </form>
    );
  }
}

RegistrationForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegistrationForm);
