import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';

import Email from '@material-ui/icons/Email';
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

import { currentUserLogin } from '../../actions/current-user';

class Login extends React.Component {
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
    const { classes, dispatchCurrentUserLogin } = this.props;
    const { cardAnimation } = this.state;

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
                  <h4>Ingresar con redes sociales</h4>
                  <div className={classes.socialLine}>
                    <Button justIcon href="/auth/twitter" color="transparent">
                      <i className="fab fa-twitter" />
                    </Button>
                    <Button justIcon href="/auth/facebook" color="transparent">
                      <i className="fab fa-facebook" />
                    </Button>
                    <Button justIcon href="/auth/google" color="transparent">
                      <i className="fab fa-google-plus-g" />
                    </Button>
                  </div>
                </CardHeader>
                <p className={classes.divider}>o e-mail</p>
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
                  onSubmit={(values, actions) => {
                    dispatchCurrentUserLogin(values.email, values.password);
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
                      <CardBody>
                        <ErrorList errors={errors} touched={touched} />
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
                              disabled={!dirty || isSubmitting || !!Object.keys(errors).length}
                            >
                              Ingresar
                            </Button>
                          </GridItem>

                          <GridItem xs={12} sm={12} md={6}>
                            <Button
                              simple
                              color="primary"
                              component={Link}
                              to="/register"
                              fullWidth
                            >
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
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatchCurrentUserLogin: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  hasErrored: state.currentUserHasErrored,
  isLoading: state.currentUserIsLoading,
});

const mapDispatchToProps = dispatch => ({
  dispatchCurrentUserLogin: (email, password) => {
    dispatch(currentUserLogin(email, password));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(loginPageStyle)(Login));
