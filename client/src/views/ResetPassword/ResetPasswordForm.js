import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Mutation } from 'react-apollo';

import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';

import LockOutlined from '@material-ui/icons/LockOutlined';

import Button from 'components/material-kit-react/CustomButtons/Button';
import CardBody from 'components/material-kit-react/Card/CardBody';
import CardFooter from 'components/material-kit-react/Card/CardFooter';
import CustomInput from 'components/material-kit-react/CustomInput/CustomInput';

import ErrorList from 'components/ErrorList/ErrorList';

import loginPageStyle from 'assets/jss/material-kit-react/views/loginPage';

import ME_QUERY from 'graphql/queries/Me';
import RESET_PASSWORD from 'graphql/mutations/ResetPassword';

const ResetPasswordForm = ({ classes, recoveryToken }) => {
  return (
    <Mutation
      mutation={RESET_PASSWORD}
      update={(cache, { data: { resetPassword } }) => {
        cache.writeQuery({
          query: ME_QUERY,
          data: { me: resetPassword },
        });
      }}
    >
      {(resetPassword, { loading, error }) => (
        <Formik
          initialValues={{
            password: '',
            passwordConfirm: '',
          }}
          validationSchema={Yup.object().shape({
            password: Yup.string().required('Debe ingresar una clave'),
            passwordConfirm: Yup.string()
              .oneOf([Yup.ref('password'), null], 'La confirmación de clave no coincide')
              .required('Debe confirmar la clave'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            await resetPassword({ variables: { password: values.password, recoveryToken } });
            setSubmitting(false);
          }}
          render={({ values, touched, handleChange, handleBlur, errors, dirty, isSubmitting }) => (
            <Form>
              <CardBody>
                <ErrorList
                  errors={{ ...errors, error: error && 'Ha ocurrido un error' }}
                  touched={{ ...touched, error: !!error }}
                />
                <CustomInput
                  labelText="Clave"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  error={!!errors.password && touched.password}
                  inputProps={{
                    name: 'password',
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
                <CustomInput
                  labelText="Confirmar clave"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  error={!!errors.passwordConfirm && touched.passwordConfirm}
                  inputProps={{
                    name: 'passwordConfirm',
                    type: 'password',
                    value: values.passwordConfirm,
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
                <Button simple color="primary" component={Link} to="/" fullWidth>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  fullWidth
                  disabled={!dirty || isSubmitting || loading || !!Object.keys(errors).length}
                >
                  Cambiar Clave
                </Button>
              </CardFooter>
            </Form>
          )}
        />
      )}
    </Mutation>
  );
};

ResetPasswordForm.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  recoveryToken: PropTypes.string.isRequired,
};

export default withStyles(loginPageStyle)(ResetPasswordForm);
