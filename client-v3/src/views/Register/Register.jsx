import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { Persist } from 'formik-persist';
import * as Yup from 'yup';

import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

import Email from '@material-ui/icons/Email';
import LockOutlined from '@material-ui/icons/LockOutlined';
import Check from '@material-ui/icons/Check';
import PermIdentity from '@material-ui/icons/PermIdentity';

import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';
import Button from 'components/material-kit-react/CustomButtons/Button';
import Card from 'components/material-kit-react/Card/Card';
import CardBody from 'components/material-kit-react/Card/CardBody';
import CardHeader from 'components/material-kit-react/Card/CardHeader';
import CardFooter from 'components/material-kit-react/Card/CardFooter';
import CustomInput from 'components/material-kit-react/CustomInput/CustomInput';

import CustomSelect from 'components/CustomSelect/CustomSelect';
import ErrorList from 'components/Error/ErrorList';

import loginPageStyle from 'assets/jss/material-kit-react/views/loginPage';
import customInputStyle from 'assets/jss/material-kit-react/components/customInputStyle';
import customCheckboxRadioSwitch from 'assets/jss/material-kit-react/customCheckboxRadioSwitch';

import image from 'assets/img/page_background.png';

import { subjectsFetch } from '../../actions/subject';
import { workshopsFetch } from '../../actions/workshop';
import { currentUserRegister, currentUserLogout } from '../../actions/current-user';

import filterObjectByKeys from '../../lib/filter-object-by-keys';

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

class Register extends React.Component {
  state = {
    cardAnimation: 'cardHidden',
  };

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(() => {
      this.setState({ cardAnimation: '' });
    }, 700);

    const { dispatchSubjectsFetch, dispatchWorkshopsFetch } = this.props;
    dispatchSubjectsFetch();
    dispatchWorkshopsFetch();
  }

  render() {
    const {
      classes,
      dispatchCurrentUserRegister,
      dispatchCurrentUserLogout,
      currentUser,
      workshops,
      subjects,
    } = this.props;
    const { cardAnimation } = this.state;

    const externalProvider = !!currentUser;

    return (
      <div>
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
          }}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <Card className={classes[cardAnimation]}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Registrarse en MiFADU</h4>
                  </CardHeader>
                  <Formik
                    initialValues={{
                      email: '',
                      password: '',
                      passwordConfirm: '',
                      firstName: '',
                      lastName: '',
                      idNumber: '',
                      subjects: [],
                      workshop: null,
                      previouslyOnThisChair: false,
                      previousYearOnThisChair: '',
                      receiveNews: false,
                      acceptedTerms: false,
                      website: '',
                      aboutMe: '',
                      completedProfile: true,
                    }}
                    validationSchema={Yup.object().shape({
                      email: Yup.string()
                        .email('No es un formato de e-mail válido')
                        .required('Debe ingresar un e-mail'),
                      password: Yup.string().required('Debe ingresar una clave'),
                      passwordConfirm: Yup.string()
                        .oneOf([Yup.ref('password'), null], 'La confirmación de clave no coincide')
                        .required('Debe confirmar la clave'),
                      firstName: Yup.string().required('Debe introducir un nombre'),
                      lastName: Yup.string().required('Debe introducir un apellido'),
                      idNumber: Yup.string().required('Debe introducir un DNI'),
                      workshop: Yup.string().required('Debe elegir un taller'),
                      previouslyOnThisChair: Yup.boolean(),
                      previousYearOnThisChair: Yup.string().when('previouslyOnThisChair', {
                        is: true,
                        then: Yup.string().required('Debe introducir un año'),
                      }),
                      acceptedTerms: Yup.boolean().oneOf(
                        [true],
                        'Debe aceptar los términos y condiciones',
                      ),
                    })}
                    onSubmit={(values, actions) => {
                      dispatchCurrentUserRegister(
                        filterObjectByKeys(values, ['passwordConfirm'], true),
                      );
                      actions.setSubmitting(false);
                    }}
                    render={({
                      values,
                      touched,
                      handleChange,
                      handleBlur,
                      errors,
                      dirty,
                      isSubmitting,
                    }) => (
                      <Form>
                        <Persist name="register-form" debounce={1000} />
                        <CardBody>
                          <ErrorList errors={errors} touched={touched} />
                          <CustomInput
                            labelText="e-mail"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            helperText={
                              currentUser.externalProvider
                                ? 'No se puede cambiar debido al uso de un proveedor externo'
                                : ''
                            }
                            error={!!errors.email && touched.email}
                            inputProps={{
                              name: 'email',
                              value: values.email,
                              onChange: handleChange,
                              onBlur: handleBlur,
                              disabled: currentUser.externalProvider,
                              type: 'email',
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Email className={classes.inputIconsColor} />
                                </InputAdornment>
                              ),
                            }}
                          />
                          {!currentUser.externalProvider && (
                            <GridContainer>
                              <GridItem xs={12} sm={12} md={6}>
                                <CustomInput
                                  labelText="Clave"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    name: 'password',
                                    value: values.password,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    type: 'password',
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <LockOutlined className={classes.inputIconsColor} />
                                      </InputAdornment>
                                    ),
                                  }}
                                  error={!!errors.password && touched.password}
                                />
                              </GridItem>
                              <GridItem xs={12} sm={12} md={6}>
                                <CustomInput
                                  labelText="Confirmar clave"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    name: 'passwordConfirm',
                                    value: values.passwordConfirm,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    type: 'password',
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <LockOutlined className={classes.inputIconsColor} />
                                      </InputAdornment>
                                    ),
                                  }}
                                  error={!!errors.passwordConfirm && touched.passwordConfirm}
                                />
                              </GridItem>
                            </GridContainer>
                          )}
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={6}>
                              <CustomInput
                                labelText="Nombre"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  name: 'firstName',
                                  value: values.firstName,
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <PermIdentity className={classes.inputIconsColor} />
                                    </InputAdornment>
                                  ),
                                }}
                                error={!!errors.firstName && touched.firstName}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                              <CustomInput
                                labelText="Apellido"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  name: 'lastName',
                                  value: values.lastName,
                                  onChange: handleChange,
                                  onBlur: handleBlur,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <PermIdentity className={classes.inputIconsColor} />
                                    </InputAdornment>
                                  ),
                                }}
                                error={!!errors.lastName && touched.lastName}
                              />
                            </GridItem>
                          </GridContainer>
                          <CustomInput
                            labelText="DNI"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              name: 'idNumber',
                              value: values.idNumber,
                              onChange: handleChange,
                              onBlur: handleBlur,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <PermIdentity className={classes.inputIconsColor} />
                                </InputAdornment>
                              ),
                            }}
                            error={!!errors.idNumber && touched.idNumber}
                          />
                          <CustomSelect
                            labelText="Taller al que pertenece"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              name: 'workshop',
                              value: values.workshop,
                              onChange: handleChange,
                              onBlur: handleBlur,
                            }}
                            error={!!errors.workshop && touched.workshop}
                          >
                            {workshops.all.map(option => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </CustomSelect>
                          <CustomSelect
                            labelText="Materias cursadas"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              name: 'subjects',
                              value: values.subjects,
                              onChange: handleChange,
                              onBlur: handleBlur,
                              multiple: true,
                              renderValue: selected =>
                                selected
                                  .map(s => subjects.all.find(subject => s === subject.id))
                                  .filter(subject => subject)
                                  .map(subject => subject.name)
                                  .join(', '),
                            }}
                          >
                            {subjects.all.map(subject => (
                              <MenuItem key={subject.id} value={subject.id}>
                                <Checkbox checked={values.subjects.indexOf(subject.id) > -1} />
                                <ListItemText primary={subject.name} />
                              </MenuItem>
                            ))}
                          </CustomSelect>
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={8}>
                              <div className={classes.checkboxAndRadio}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name="previouslyOnThisChair"
                                      onChange={handleChange}
                                      checked={values.previouslyOnThisChair}
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
                              className={values.previouslyOnThisChair ? '' : classes.hidden}
                            >
                              <CustomInput
                                labelText="Año anterior"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  name: 'previousYearOnThisChair',
                                  value: values.previousYearOnThisChair,
                                  onChange: handleChange,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <PermIdentity className={classes.inputIconsColor} />
                                    </InputAdornment>
                                  ),
                                }}
                                error={
                                  !!errors.previousYearOnThisChair &&
                                  touched.previousYearOnThisChair
                                }
                              />
                            </GridItem>
                          </GridContainer>
                          <CustomInput
                            labelText="Blog / Sitio personal"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              name: 'website',
                              value: values.website,
                              onChange: handleChange,
                              onBlur: handleBlur,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <PermIdentity className={classes.inputIconsColor} />
                                </InputAdornment>
                              ),
                            }}
                            error={!!errors.website && touched.website}
                          />
                          <CustomInput
                            labelText="Algo para contarnos de vos"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              name: 'aboutMe',
                              multiline: true,
                              rows: 4,
                              value: values.aboutMe,
                              onChange: handleChange,
                              onBlur: handleBlur,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <PermIdentity className={classes.inputIconsColor} />
                                </InputAdornment>
                              ),
                            }}
                            error={!!errors.aboutMe && touched.aboutMe}
                          />
                          <div
                            className={`${classes.checkboxAndRadio} ${
                              classes.checkboxAndRadioHorizontal
                            }`}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="receiveNews"
                                  onChange={handleChange}
                                  checked={values.receiveNews}
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
                                  name="acceptedTerms"
                                  onChange={handleChange}
                                  checked={values.acceptedTerms}
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
                          <Button
                            simple
                            color="primary"
                            size="lg"
                            onClick={dispatchCurrentUserLogout}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            disabled={!dirty || isSubmitting || Object.keys(errors).length}
                            simple
                            color="primary"
                            size="lg"
                          >
                            Registrarse
                          </Button>
                        </CardFooter>
                      </Form>
                    )}
                  />
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  workshops: PropTypes.object.isRequired,
  subjects: PropTypes.object.isRequired,
  dispatchCurrentUserRegister: PropTypes.func.isRequired,
  dispatchCurrentUserLogout: PropTypes.func.isRequired,
  dispatchSubjectsFetch: PropTypes.func.isRequired,
  dispatchWorkshopsFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  workshops: state.workshops,
  subjects: state.subjects,
  hasErrored: state.currentUserHasErrored,
  isLoading: state.currentUserIsLoading,
});

const mapDispatchToProps = dispatch => ({
  dispatchCurrentUserRegister: input => {
    dispatch(currentUserRegister(input));
  },
  dispatchSubjectsFetch: () => {
    dispatch(subjectsFetch());
  },
  dispatchWorkshopsFetch: () => {
    dispatch(workshopsFetch());
  },
  dispatchCurrentUserLogout: () => {
    dispatch(currentUserLogout());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Register));
