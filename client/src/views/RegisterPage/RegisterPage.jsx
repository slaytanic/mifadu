import React from 'react';
import { withRouter } from 'react-router-dom';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
// @material-ui/icons
import Email from '@material-ui/icons/Email';
import LockOutline from '@material-ui/icons/LockOutline';
import People from '@material-ui/icons/People';
import Check from '@material-ui/icons/Check';
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
import CustomSelect from 'components/CustomSelect/CustomSelect.jsx';
import ErrorList from 'components/ErrorList/ErrorList.jsx';

import loginPageStyle from 'assets/jss/material-kit-react/views/loginPage.jsx';
import customInputStyle from 'assets/jss/material-kit-react/components/customInputStyle.jsx';
import customCheckboxRadioSwitch from 'assets/jss/material-kit-react/customCheckboxRadioSwitch.jsx';

import image from 'assets/img/page_background.png';

import { getSubjects, getWorkshops, createOrUpdateUser, loginUser } from 'data/service';

const styles = {
  ...customInputStyle,
  ...loginPageStyle,
  ...customCheckboxRadioSwitch,
  container: {
    ...loginPageStyle.container,
    paddingTop: '10vh',
  },
  hidden: {
    visibility: 'hidden',
  },
};

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cardAnimaton: 'cardHidden',
      user: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        workshop: '',
        idNumber: '',
        subjects: [],
        receiveNews: '',
        acceptedTerms: '',
        previouslyOnThisChair: false,
        previousYearOnThisChair: '',
        website: '',
        aboutMe: '',
        ...props.user,
      },
      passwordConfirmation: '',
      errors: [],
      externalProvider: !!props.user,
      workshops: [],
      subjects: [],
    };
    console.log(this.state);
  }

  handleChange = (name, sub) => event => {
    if (sub) {
      this.setState({
        [name]: { ...this.state[name], [sub]: event.target.value },
        errors: this.state.errors.filter(error => error.name !== sub),
      });
    } else {
      this.setState({
        [name]: event.target.value,
        errors: this.state.errors.filter(error => error.name !== name),
      });
    }
  };

  handleMultiSelect = name => event => {
    this.setState({
      [name]: event.target.value,
      errors: this.state.errors.filter(error => error.name !== name),
    });
  };

  handleToggle = (name, sub) => () => {
    if (sub) {
      this.setState({
        [name]: { ...this.state[name], [sub]: !this.state[name][sub] },
        errors: this.state.errors.filter(error => error.name !== sub),
      });
    } else {
      this.setState({
        [name]: !this.state[name],
        errors: this.state.errors.filter(error => error.name !== name),
      });
    }
  };

  handleCancel = () => {
    this.props.logoutUser();
    this.props.history.push('/');
  };

  handleRegister = () => {
    const errors = [];
    const { user } = this.state;

    if (
      !this.state.externalProvider &&
      (!user.password || user.password !== this.state.passwordConfirmation)
    ) {
      errors.push({
        name: 'passwordConfirmation',
        message: 'La confirmación de la clave no coincide',
      });
    }

    if (!this.state.externalProvider && (!user.password || user.password.length < 8)) {
      errors.push({
        name: 'password',
        message: 'La clave debe tener al menos 8 caracteres',
      });
    }

    if (!user.email || user.email.length < 1) {
      errors.push({
        name: 'email',
        message: 'El e-mail debe ser válido',
      });
    }

    if (!user.firstName || user.firstName.length < 1) {
      errors.push({
        name: 'firstName',
        message: 'El nombre debe ser válido',
      });
    }

    if (!user.lastName || user.lastName.length < 1) {
      errors.push({
        name: 'lastName',
        message: 'El apellido debe ser válido',
      });
    }

    if (!user.idNumber || user.idNumber.length < 1) {
      errors.push({
        name: 'idNumber',
        message: 'El DNI debe ser válido',
      });
    }

    if (!user.workshop || user.workshop.length < 1) {
      errors.push({
        name: 'workshop',
        message: 'Debe elegir el taller al que pertenece',
      });
    }

    if (!user.subjects || user.subjects.length < 1) {
      errors.push({
        name: 'subjects',
        message: 'Debe elegir las materias cursadas',
      });
    }

    if (user.acceptedTerms !== true) {
      errors.push({
        name: 'acceptedTerms',
        message: 'Debe aceptar los términos y condiciones de uso',
      });
    }

    if (errors.length < 1) {
      const newUser = { ...user };
      delete user.id;
      createOrUpdateUser({ ...newUser, completedProfile: true })
        .then(response => {
          if (response.data.errors) {
            this.setState({
              errors: [{ message: 'Ese e-mail ya se encuentra en uso' }],
            });
          } else {
            this.props.setCurrentUser(response.data.data.createOrUpdateUser);
            // if (!this.state.externalProvider) {
              // loginUser(user.email, user.password).then(() => {
                // this.props.history.push('/');
              // });
            // } else {
              this.props.history.push('/');
            // }
          }
        })
        .catch(() => {});
    }
    this.setState({ errors });
  };

  hasError = name => {
    const errors = this.state.errors.find(error => error.name === name);
    return !!errors;
  };

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(() => {
      this.setState({ cardAnimaton: '' });
    }, 700);

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
    const { classes, ...rest } = this.props;
    const { errors } = this.state;

    return (
      <div>
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            // backgroundPosition: 'top center',
          }}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Registrarse en MiFADU</h4>
                    </CardHeader>
                    <CardBody>
                      <ErrorList errors={errors} />
                      <CustomInput
                        labelText="e-mail"
                        id="email"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        helperText={
                          this.state.externalProvider
                            ? 'No se puede cambiar debido al uso de un proveedor externo'
                            : ''
                        }
                        inputProps={{
                          value: this.state.user.email,
                          onChange: this.handleChange('user', 'email'),
                          disabled: this.state.externalProvider,
                          type: 'email',
                          endAdornment: !this.hasError('email') && (
                            <InputAdornment position="end">
                              <Email className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                        }}
                        error={this.hasError('email')}
                      />
                      {!this.state.externalProvider && (
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={6}>
                            <CustomInput
                              labelText="Clave"
                              id="password"
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                value: this.state.user.password,
                                onChange: this.handleChange('user', 'password'),
                                type: 'password',
                                endAdornment: !this.hasError('password') && (
                                  <InputAdornment position="end">
                                    <LockOutline className={classes.inputIconsColor} />
                                  </InputAdornment>
                                ),
                              }}
                              error={this.hasError('password')}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6}>
                            <CustomInput
                              labelText="Confirmar clave"
                              id="password-confirmation"
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                value: this.state.passwordConfirmation,
                                onChange: this.handleChange('passwordConfirmation'),
                                type: 'password',
                                endAdornment: !this.hasError('password-confirmation') && (
                                  <InputAdornment position="end">
                                    <LockOutline className={classes.inputIconsColor} />
                                  </InputAdornment>
                                ),
                              }}
                              error={this.hasError('passwordConfirmation')}
                            />
                          </GridItem>
                        </GridContainer>
                      )}
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                          <CustomInput
                            labelText="Nombre"
                            id="first-name"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: this.state.user.firstName,
                              onChange: this.handleChange('user', 'firstName'),
                              endAdornment: !this.hasError('firstName') && (
                                <InputAdornment position="end">
                                  <PermIdentity className={classes.inputIconsColor} />
                                </InputAdornment>
                              ),
                            }}
                            error={this.hasError('firstName')}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                          <CustomInput
                            labelText="Apellido"
                            id="last-name"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: this.state.user.lastName,
                              onChange: this.handleChange('user', 'lastName'),
                              endAdornment: !this.hasError('lastName') && (
                                <InputAdornment position="end">
                                  <PermIdentity className={classes.inputIconsColor} />
                                </InputAdornment>
                              ),
                            }}
                            error={this.hasError('lastName')}
                          />
                        </GridItem>
                      </GridContainer>
                      <CustomInput
                        labelText="DNI"
                        id="id-number"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          value: this.state.user.idNumber,
                          onChange: this.handleChange('user', 'idNumber'),
                          endAdornment: !this.hasError('idNumber') && (
                            <InputAdornment position="end">
                              <PermIdentity className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                        }}
                        error={this.hasError('idNumber')}
                      />
                      <CustomSelect
                        id="workshop"
                        labelText="Taller al que pertenece"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          value: this.state.user.workshop,
                          onChange: this.handleChange('user', 'workshop'),
                        }}
                        error={this.hasError('workshop')}
                      >
                        {this.state.workshops.map(option => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                      <CustomSelect
                        id="subjects"
                        labelText="Materias cursadas"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          value: this.state.user.subjects,
                          onChange: this.handleChange('user', 'subjects'),
                          multiple: true,
                          renderValue: selected =>
                            selected
                              .map(s => this.state.subjects.find(subject => s === subject.id))
                              .map(subject => subject.name)
                              .join(', '),
                        }}
                      >
                        {this.state.subjects.map(subject => (
                          <MenuItem key={subject.id} value={subject.id}>
                            <Checkbox checked={this.state.user.subjects.indexOf(subject.id) > -1} />
                            <ListItemText primary={subject.name} />
                          </MenuItem>
                        ))}
                      </CustomSelect>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={8}>
                          <div
                            className={
                              classes.checkboxAndRadio // +
                              // ' ' +
                              // classes.checkboxAndRadioHorizontal
                            }
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onClick={this.handleToggle('user', 'previouslyOnThisChair')}
                                  checked={this.state.user.previouslyOnThisChair}
                                  checkedIcon={<Check className={classes.checkedIcon} />}
                                  icon={<Check className={classes.uncheckedIcon} />}
                                  classes={{ checked: classes.checked }}
                                />
                              }
                              classes={{ label: classes.label }}
                              label="Ya cursé Rondina en un año anterior"
                            />
                          </div>
                        </GridItem>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={4}
                          className={this.state.user.previouslyOnThisChair ? '' : classes.hidden}
                        >
                          <CustomInput
                            // className={this.state.user.previouslyOnThisChair ? '' : classes.hidden}
                            labelText="Año anterior"
                            id="previous-year-on-this-chair"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: this.state.user.previousYearOnThisChair,
                              onChange: this.handleChange('user', 'previousYearOnThisChair'),
                              endAdornment: !this.hasError('previousYearOnThisChair') && (
                                <InputAdornment position="end">
                                  <PermIdentity className={classes.inputIconsColor} />
                                </InputAdornment>
                              ),
                            }}
                            error={this.hasError('previousYearOnThisChair')}
                          />
                        </GridItem>
                      </GridContainer>
                      <CustomInput
                        labelText="Blog / Sitio personal"
                        id="website"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          value: this.state.user.website,
                          onChange: this.handleChange('user', 'website'),
                          endAdornment: !this.hasError('website') && (
                            <InputAdornment position="end">
                              <PermIdentity className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                        }}
                        error={this.hasError('website')}
                      />
                      <CustomInput
                        labelText="Algo para contarnos de vos"
                        id="about-me"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          multiline: true,
                          rows: 4,
                          value: this.state.user.aboutMe,
                          onChange: this.handleChange('user', 'aboutMe'),
                          endAdornment: !this.hasError('aboutMe') && (
                            <InputAdornment position="end">
                              <PermIdentity className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                        }}
                        error={this.hasError('aboutMe')}
                      />
                      <div
                        className={`${classes.checkboxAndRadio} ${
                          classes.checkboxAndRadioHorizontal
                        }`}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              onClick={this.handleToggle('user', 'receiveNews')}
                              checked={this.state.user.receiveNews}
                              checkedIcon={<Check className={classes.checkedIcon} />}
                              icon={<Check className={classes.uncheckedIcon} />}
                              classes={{ checked: classes.checked }}
                            />
                          }
                          classes={{ label: classes.label }}
                          label="Deseo recibir noticias de MiFADU"
                        />
                      </div>
                      <div
                        className={`${classes.checkboxAndRadio} ${
                          classes.checkboxAndRadioHorizontal
                        }`}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              onClick={this.handleToggle('user', 'acceptedTerms')}
                              checked={this.state.user.acceptedTerms}
                              checkedIcon={<Check className={classes.checkedIcon} />}
                              icon={<Check className={classes.uncheckedIcon} />}
                              classes={{ checked: classes.checked }}
                            />
                          }
                          classes={{ label: classes.label }}
                          label="Acepto los términos y condiciones"
                        />
                      </div>
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button simple color="primary" size="lg" onClick={this.handleCancel}>
                        Cancelar
                      </Button>
                      <Button simple color="primary" size="lg" onClick={this.handleRegister}>
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

export default withRouter(withStyles(styles)(RegisterPage));
