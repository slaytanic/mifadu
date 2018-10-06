import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';

import LockOutlined from '@material-ui/icons/LockOutlined';

import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';
import Button from 'components/material-kit-react/CustomButtons/Button';
import Card from 'components/material-kit-react/Card/Card';
import CardBody from 'components/material-kit-react/Card/CardBody';
import CardHeader from 'components/material-kit-react/Card/CardHeader';
import CardFooter from 'components/material-kit-react/Card/CardFooter';
import CustomInput from 'components/material-kit-react/CustomInput/CustomInput';

import ErrorList from 'components/Error/ErrorList';

import loginPageStyle from 'assets/jss/material-kit-react/views/loginPage';

import image from 'assets/img/page_background.png';

import { currentUserResetPassword } from '../../actions/current-user';

class ResetPassword extends React.Component {
  state = {
    cardAnimation: 'cardHidden',
  };

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(() => {
      this.setState({ cardAnimation: '' });
    }, 700);
  }

  render() {
    const { classes, dispatchCurrentUserResetPassword, match } = this.props;
    const { cardAnimation } = this.state;

    const { recoveryToken } = match.params;

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
                  <h4>Ingresar nueva clave</h4>
                </CardHeader>
                <p className={classes.divider}>Para completar el proceso elija una nueva clave</p>
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
                  onSubmit={(values, actions) =>
                    dispatchCurrentUserResetPassword(values.password, recoveryToken).then(
                      action => {
                        if (action.payload.errors) {
                          actions.setError('Ha ocurrido un error');
                        }
                        actions.setSubmitting(false);
                      },
                    )
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
                        <ErrorList
                          errors={{ ...errors, error }}
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
                          disabled={!dirty || isSubmitting || !!Object.keys(errors).length}
                        >
                          Cambiar Clave
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

ResetPassword.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatchCurrentUserResetPassword: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  dispatchCurrentUserResetPassword: (password, recoveryToken) =>
    dispatch(currentUserResetPassword(password, recoveryToken)),
});

export default connect(
  null,
  mapDispatchToProps,
)(withStyles(loginPageStyle)(ResetPassword));
