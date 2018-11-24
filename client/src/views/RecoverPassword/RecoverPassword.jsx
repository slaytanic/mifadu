import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';

import Email from '@material-ui/icons/Email';

import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';
import Button from 'components/material-kit-react/CustomButtons/Button';
import Card from 'components/material-kit-react/Card/Card';
import CardBody from 'components/material-kit-react/Card/CardBody';
import CardHeader from 'components/material-kit-react/Card/CardHeader';
import CardFooter from 'components/material-kit-react/Card/CardFooter';
import CustomInput from 'components/material-kit-react/CustomInput/CustomInput';
import SnackbarContent from 'components/material-kit-react/Snackbar/SnackbarContent';

import ErrorList from 'components/Error/ErrorList';

import loginPageStyle from 'assets/jss/material-kit-react/views/loginPage';

import image from 'assets/img/page_background.png';

import { recoverPassword } from '../../api/current-user';

class RecoverPassword extends React.Component {
  state = {
    cardAnimation: 'cardHidden',
    emailSent: false,
  };

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(() => {
      this.setState({ cardAnimation: '' });
    }, 700);
  }

  render() {
    const { classes } = this.props;
    const { cardAnimation, emailSent } = this.state;

    return (
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={5}>
              <Card className={classes[cardAnimation]}>
                <CardHeader color="primary" className={classes.cardHeader}>
                  <h4>Recuperar clave</h4>
                </CardHeader>
                <p className={classes.divider}>Para recuperar su clave ingrese su e-mail</p>
                <Formik
                  initialValues={{
                    email: '',
                  }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string()
                      .email('No es un formato de e-mail válido')
                      .required('Debe ingresar un e-mail'),
                  })}
                  onSubmit={(values, actions) =>
                    recoverPassword(values.email).then(response => {
                      if (response.data.errors) {
                        actions.setError('Ha ocurrido un error');
                      } else {
                        this.setState({ emailSent: true });
                      }
                      actions.setSubmitting(false);
                    })
                  }
                  render={({
                    values,
                    touched,
                    handleChange,
                    handleBlur,
                    error,
                    errors,
                    dirty,
                    isSubmitting,
                  }) => (
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
                          errors={{ ...errors, error }}
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
                          disabled={!dirty || isSubmitting || !!Object.keys(errors).length}
                        >
                          Recuperar Clave
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
    );
  }
}

RecoverPassword.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(loginPageStyle)(RecoverPassword);
