import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Mutation } from 'react-apollo';

import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';

import Email from '@material-ui/icons/Email';

import Button from 'components/material-kit-react/CustomButtons/Button';
import CardBody from 'components/material-kit-react/Card/CardBody';
import CardFooter from 'components/material-kit-react/Card/CardFooter';
import CustomInput from 'components/material-kit-react/CustomInput/CustomInput';
import SnackbarContent from 'components/material-kit-react/Snackbar/SnackbarContent';

import ErrorList from 'components/ErrorList/ErrorList';

import loginPageStyle from 'assets/jss/material-kit-react/views/loginPage';

import RECOVER_PASSWORD from 'graphql/mutations/RecoverPassword';

const RecoverPasswordForm = classes => {
  const [emailSent, setEmailSent] = useState(false);

  return (
    <Mutation mutation={RECOVER_PASSWORD}>
      {(recoverPassword, { loading, error }) => (
        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('No es un formato de e-mail válido')
              .required('Debe ingresar un e-mail'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            const response = await recoverPassword({ variables: values });
            if (response.data.recoverPassword === true) {
              setEmailSent(true);
            }
            setSubmitting(false);
          }}
          render={({ values, touched, handleChange, handleBlur, errors, dirty, isSubmitting }) => (
            <Form>
              <CardBody>
                {emailSent && (
                  <SnackbarContent
                    message="Se ha enviado un e-mail a la dirección provista con instrucciones para recuperar su clave"
                    color="info"
                    icon="info_outline"
                  />
                )}
                <ErrorList
                  errors={{
                    ...errors,
                    error: error && 'Ha ocurrido un error, por favor intente nuevamente más tarde',
                  }}
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
                  Recuperar Clave
                </Button>
              </CardFooter>
            </Form>
          )}
        />
      )}
    </Mutation>
  );
};

RecoverPasswordForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(loginPageStyle)(RecoverPasswordForm);
