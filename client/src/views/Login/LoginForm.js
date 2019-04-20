import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Mutation } from 'react-apollo';

import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';

import Email from '@material-ui/icons/Email';
import LockOutlined from '@material-ui/icons/LockOutlined';

import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';
import Button from 'components/material-kit-react/CustomButtons/Button';
import CardBody from 'components/material-kit-react/Card/CardBody';
import CardFooter from 'components/material-kit-react/Card/CardFooter';
import CustomInput from 'components/material-kit-react/CustomInput/CustomInput';

import ErrorList from 'components/ErrorList/ErrorList';

import loginPageStyle from 'assets/jss/material-kit-react/views/loginPage';

import ME_QUERY from 'graphql/queries/Me';
import LOGIN_USER from 'graphql/mutations/LoginUser';

const LoginForm = ({ classes }) => {
  return (
    <Mutation
      mutation={LOGIN_USER}
      update={(cache, { data: { loginUser } }) => {
        cache.writeQuery({
          query: ME_QUERY,
          data: { me: loginUser },
        });
      }}
    >
      {(loginUser, { loading, error }) => (
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('No es un formato de e-mail válido')
              .required('Debe ingresar un e-mail'),
            password: Yup.string().required('Debe ingresar una clave'),
          })}
          onSubmit={async (values, actions) => {
            try {
              await loginUser({ variables: values });
            } finally {
              actions.setSubmitting(false);
            }
          }}
          render={({ values, touched, handleChange, handleBlur, errors, dirty, isSubmitting }) => (
            <Form>
              <CardBody>
                <ErrorList
                  errors={{ ...errors, error: error && 'Usuario o clave incorrectos' }}
                  touched={{ ...touched, error: !!error }}
                />
                <CustomInput
                  labelText="e-mail"
                  id="email"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  error={!!errors.email && touched.email}
                  inputProps={{
                    value: values.email,
                    onChange: handleChange,
                    onBlur: handleBlur,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className={classes.inputIconsColor} />
                      </InputAdornment>
                    ),
                  }}
                />
                <CustomInput
                  labelText="Clave"
                  id="password"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  error={!!errors.password && touched.password}
                  inputProps={{
                    type: 'password',
                    value: values.password,
                    onChange: handleChange,
                    onBlur: handleBlur,
                    endAdornment: (
                      <InputAdornment position="end">
                        <LockOutlined className={classes.inputIconsColor} />
                      </InputAdornment>
                    ),
                  }}
                />
              </CardBody>
              <CardFooter className={classes.cardFooter}>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={12}>
                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      fullWidth
                      disabled={!dirty || isSubmitting || loading || !!Object.keys(errors).length}
                    >
                      Ingresar
                    </Button>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6}>
                    <Button simple color="primary" component={Link} to="/register" fullWidth>
                      No tengo cuenta
                    </Button>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <Button
                      simple
                      color="primary"
                      component={Link}
                      to="/recover_password"
                      fullWidth
                    >
                      No recuerdo mi clave
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardFooter>
            </Form>
          )}
        />
      )}
    </Mutation>
  );
};

export default withStyles(loginPageStyle)(LoginForm);
