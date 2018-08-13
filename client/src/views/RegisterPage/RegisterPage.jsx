import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// @material-ui/icons
import Email from '@material-ui/icons/Email';
import LockOutline from '@material-ui/icons/LockOutline';
import People from '@material-ui/icons/People';
import Check from "@material-ui/icons/Check";
import PermIdentity from '@material-ui/icons/PermIdentity';
// core components
import Header from 'components/Header/Header.jsx';
import HeaderLinks from 'components/Header/HeaderLinks.jsx';
import Footer from 'components/Footer/Footer.jsx';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import Card from 'components/Card/Card.jsx';
import CardBody from 'components/Card/CardBody.jsx';
import CardHeader from 'components/Card/CardHeader.jsx';
import CardFooter from 'components/Card/CardFooter.jsx';
import CustomInput from 'components/CustomInput/CustomInput.jsx';

import loginPageStyle from 'assets/jss/material-kit-react/views/loginPage.jsx';

import image from 'assets/img/page_background.png';

import {
  getSubjects,
  getWorkshops,
  createOrUpdateUser,
  loginUser,
} from 'data/service';

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: 'cardHidden',
      user: {},
      passwordConfirmation: '',
      errors: [],
    };
  }

  handleChange = (name, sub) => event => {
    if (sub) {
      this.setState({
        [name]: { ...this.state[name], [sub]: event.target.value },
        errors: this.state.errors.filter(error => error.name !== name),
      });
    } else {
      this.setState({
        [name]: event.target.value,
        errors: this.state.errors.filter(error => error.name !== name),
      });
    }
  };

  handleRegister = () => {
    const errors = [];

    if (this.state.user.password !== this.state.passwordConfirmation) {
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

    if (this.state.user.email.length < 1) {
      errors.push({
        name: 'email',
        message: 'El e-mail debe ser válido',
      });
    }

    if (this.state.user.firstName.length < 1) {
      errors.push({
        name: 'firstName',
        message: 'El nombre debe ser válido',
      });
    }

    if (this.state.user.lastName.length < 1) {
      errors.push({
        name: 'lastName',
        message: 'El apellido debe ser válido',
      });
    }

    if (this.state.user.lastName.length < 1) {
      errors.push({
        name: 'idNumber',
        message: 'El DNI debe ser válido',
      });
    }

    if (this.state.user.acceptedTerms !== true) {
      errors.push({
        name: 'acceptedTerms',
        message: 'Debe aceptar los términos y condiciones de uso',
      });
    }

    if (errors.length < 1) {
      const input = this.state.user;
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

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: '' });
      }.bind(this),
      700,
    );

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
    const { classes, ...rest } = this.props;
    return (
      <div>
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: 'url(' + image + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
          }}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Registrarse en MiFADU</h4>
                    </CardHeader>
                    {/* <p className={classes.divider}>...o e-mail</p> */}
                    <CardBody>
                      <CustomInput
                        labelText="e-mail"
                        id="email"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: 'email',
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                        }}
                        value={this.state.user.email}
                        onChange={this.handleChange('user', 'email')}
                        error={this.hasError('email')}
                      />
                      <CustomInput
                        labelText="Clave"
                        id="password"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: 'password',
                          endAdornment: (
                            <InputAdornment position="end">
                              <LockOutline
                                className={classes.inputIconsColor}
                              />
                            </InputAdornment>
                          ),
                        }}
                        value={this.state.user.password}
                        onChange={this.handleChange('user', 'password')}
                                                error={this.hasError('password')}

                      />
                      <CustomInput
                        labelText="Confirmar clave"
                        id="password-confirmation"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: 'password',
                          endAdornment: (
                            <InputAdornment position="end">
                              <LockOutline
                                className={classes.inputIconsColor}
                              />
                            </InputAdornment>
                          ),
                        }}
                        value={this.state.passwordConfirmation}
                        onChange={this.handleChange('passwordConfirmation')}
                                                error={this.hasError('password-confirmation')}
                      />
                                            <CustomInput
                        labelText="Nombre"
                        id="first-name"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <PermIdentity className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                        }}
                        value={this.state.user.firstName}
                        onChange={this.handleChange('user', 'firstName')}
                        error={this.hasError('firstName')}
                      />
                      <CustomInput
                        labelText="Apellido"
                        id="last-name"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <PermIdentity className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                        }}
                        value={this.state.user.lastName}
                        onChange={this.handleChange('user', 'lastName')}
                        error={this.hasError('lastName')}
                      />
                <div
                  className={
                    classes.checkboxAndRadio +
                    " " +
                    classes.checkboxAndRadioHorizontal
                  }
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => this.handleToggle(22)}
                        checked={
                          this.state.checked.indexOf(22) !== -1 ? true : false
                        }
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{ checked: classes.checked }}
                      />
                    }
                    classes={{ label: classes.label }}
                    label="Checked"
                  />
                </div>

                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button simple color="primary" size="lg">
                        Cancelar
                      </Button>
                      <Button simple color="primary" size="lg">
                        Registrarse
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          {/* <Footer whiteFont /> */}
        </div>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(RegisterPage);
