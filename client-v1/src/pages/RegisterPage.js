import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import RegistrationForm from '../components/RegistrationForm';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

class RegisterPage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          {/* <Paper className={classes.root} elevation={1}> */}
          <Typography variant="headline" component="h3">
            Registrarse en MiFADU
          </Typography>
          <Typography component="p">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip.
          </Typography>
          {/* </Paper> */}
        </Grid>
        <Grid item xs={8}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="headline" component="h3">
                Registro
              </Typography>
              <RegistrationForm
                user={this.props.user}
                setCurrentUser={this.props.setCurrentUser}
                logoutUser={this.props.logoutUser}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="headline" component="h3">
                Informaci&oacute;n
              </Typography>
              <Typography component="p">
                Bienvenidos a la plataforma digital de diseño 3 de Cátedra
                Rondina. Regístrate por única vez necesitamos que completes tus
                datos personales. Todos los campos son obligatorios, la
                información que te pedimos es únicamente para fines
                estadísticos.
              </Typography>
              <Typography component="p" color="textSecondary">
                Todos los datos son obligatorios
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

RegisterPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterPage);
