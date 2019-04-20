import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Query, Mutation } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';

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
import CardBody from 'components/material-kit-react/Card/CardBody';
import CardFooter from 'components/material-kit-react/Card/CardFooter';

import CustomInput from 'components/CustomInput/CustomInput';
import CustomSelect from 'components/CustomSelect/CustomSelect';
import ErrorList from 'components/ErrorList/ErrorList';
import AvatarUpload from 'components/AvatarUpload/AvatarUpload';

import loginPageStyle from 'assets/jss/material-kit-react/views/loginPage';
import customInputStyle from 'assets/jss/material-kit-react/components/customInputStyle';
import customCheckboxRadioSwitch from 'assets/jss/material-kit-react/customCheckboxRadioSwitch';

import filterObjectByKeys from 'lib/filterObjectByKeys';

import ME_QUERY from 'graphql/queries/Me';
import SUBJECTS_QUERY from 'graphql/queries/Subjects';
import WORKSHOPS_QUERY from 'graphql/queries/Workshops';
import CREATE_OR_UPDATE_USER from 'graphql/mutations/CreateOrUpdateUser';

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

const RegisterForm = ({ classes, history, me, logoutUser }) => {
  const externalProvider = me && me.loggedIn;

  const validationSchema = {
    email: Yup.string()
      .email('No es un formato de e-mail válido')
      .required('Debe ingresar un e-mail'),
    firstName: Yup.string().required('Debe introducir un nombre'),
    lastName: Yup.string().required('Debe introducir un apellido'),
    idNumber: Yup.string().required('Debe introducir un DNI'),
    workshop: Yup.string().required('Debe elegir un taller'),
    previouslyOnThisChair: Yup.boolean(),
    previousYearOnThisChair: Yup.string().when('previouslyOnThisChair', {
      is: true,
      then: Yup.string().required('Debe introducir un año'),
    }),
    acceptedTerms: Yup.boolean().oneOf([true], 'Debe aceptar los términos y condiciones'),
  };

  if (!externalProvider) {
    validationSchema.password = Yup.string().required('Debe ingresar una clave');
    validationSchema.passwordConfirm = Yup.string()
      .oneOf([Yup.ref('password'), null], 'La confirmación de clave no coincide')
      .required('Debe confirmar la clave');
  }

  return (
    <Query query={SUBJECTS_QUERY}>
      {({ data: { subjects } }) => (
        <Query query={WORKSHOPS_QUERY}>
          {({ data: { workshops } }) => {
            if (!subjects || !workshops) return null;

            return (
              <Mutation
                mutation={CREATE_OR_UPDATE_USER}
                update={(cache, { data: { createOrUpdateUser } }) => {
                  cache.writeQuery({
                    query: ME_QUERY,
                    data: { me: createOrUpdateUser },
                  });
                }}
              >
                {(createOrUpdateUser, { loading, error }) => (
                  <Formik
                    initialValues={{
                      email: (me && me.email) || '',
                      password: '',
                      passwordConfirm: '',
                      firstName: '',
                      lastName: '',
                      idNumber: '',
                      subjects: [],
                      workshop: '',
                      previouslyOnThisChair: false,
                      previousYearOnThisChair: '',
                      receiveNews: false,
                      acceptedTerms: false,
                      website: '',
                      aboutMe: '',
                      completedProfile: true,
                      avatar: null,
                    }}
                    validationSchema={Yup.object().shape(validationSchema)}
                    onSubmit={async (values, { setSubmitting }) => {
                      try {
                        await createOrUpdateUser({
                          variables: {
                            input: filterObjectByKeys(values, ['passwordConfirm'], true),
                          },
                        });
                        history.push('/');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    render={({
                      values,
                      touched,
                      handleChange,
                      handleBlur,
                      errors,
                      dirty,
                      isSubmitting,
                      setFieldValue,
                    }) => (
                      <Form>
                        <CardBody>
                          <ErrorList
                            errors={{
                              ...errors,
                              error: error && 'El usuario ya se encuentra registrado',
                            }}
                            touched={{ ...touched, error: !!error }}
                          />
                          <CustomInput
                            labelText="e-mail"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            helperText={
                              externalProvider
                                ? 'No se puede cambiar debido al uso de un proveedor externo'
                                : ''
                            }
                            error={!!errors.email && touched.email}
                            inputProps={{
                              name: 'email',
                              value: values.email,
                              onChange: handleChange,
                              onBlur: handleBlur,
                              disabled: externalProvider,
                              type: 'email',
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Email className={classes.inputIconsColor} />
                                </InputAdornment>
                              ),
                            }}
                          />
                          {!externalProvider && (
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
                            <GridItem xs={12} sm={12} md={12}>
                              <AvatarUpload
                                onChange={data => {
                                  setFieldValue('avatar', data.id);
                                }}
                              />
                            </GridItem>
                          </GridContainer>
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
                            {workshops.map(option => (
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
                                  .map(s => subjects.find(subject => s === subject.id))
                                  .filter(subject => subject)
                                  .map(subject => subject.name)
                                  .join(', '),
                            }}
                          >
                            {subjects.map(subject => (
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
                                      onBlur={handleBlur}
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
                                  onBlur={handleBlur}
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
                                  onBlur={handleBlur}
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
                          {me ? (
                            <Button simple color="primary" size="lg" onClick={logoutUser}>
                              Cancelar
                            </Button>
                          ) : (
                            <Button simple color="primary" size="lg" component={Link} to="/">
                              Cancelar
                            </Button>
                          )}
                          <Button
                            type="submit"
                            disabled={
                              !dirty || isSubmitting || loading || !!Object.keys(errors).length
                            }
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
                )}
              </Mutation>
            );
          }}
        </Query>
      )}
    </Query>
  );
};

export default withRouter(withStyles(styles)(RegisterForm));
