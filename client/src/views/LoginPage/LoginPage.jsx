import React from 'react';
import { withRouter, Link } from 'react-router-dom';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
// @material-ui/icons
import Email from '@material-ui/icons/Email';
import LockOutline from '@material-ui/icons/LockOutline';
// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import Card from 'components/Card/Card.jsx';
import CardBody from 'components/Card/CardBody.jsx';
import CardHeader from 'components/Card/CardHeader.jsx';
import CardFooter from 'components/Card/CardFooter.jsx';
import CustomInput from 'components/CustomInput/CustomInput.jsx';
import ErrorList from 'components/ErrorList/ErrorList.jsx';

import loginPageStyle from 'assets/jss/material-kit-react/views/loginPage.jsx';

import image from 'assets/img/page_background.png';

import { loginUser } from 'data/service';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimation: 'cardHidden',
      email: '',
      password: '',
      errors: [],
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleLogin = () => {
    loginUser(this.state.email, this.state.password).then(res => {
      if (res.data.data.loginUser) {
        this.props.setCurrentUser(res.data.data.loginUser);
        this.props.history.push('/');
      } else {
        this.setState({ errors: [{ message: 'Usuario o clave incorrectos' }] });
      }
    });
  };

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(() => {
      this.setState({ cardAnimation: '' });
    }, 700);
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
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
              <Card className={classes[this.state.cardAnimation]}>
                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Ingresar con redes sociales</h4>
                    <div className={classes.socialLine}>
                      <Button justIcon href="/auth/twitter" color="transparent">
                        <i className="fab fa-twitter" />
                      </Button>
                      <Button
                        justIcon
                        href="/auth/facebook"
                        color="transparent"
                      >
                        <i className="fab fa-facebook" />
                      </Button>
                      <Button justIcon href="/auth/google" color="transparent">
                        <i className="fab fa-google-plus-g" />
                      </Button>
                    </div>
                  </CardHeader>
                  <p className={classes.divider}>...o e-mail</p>
                  <ErrorList errors={this.state.errors} />
                  <CardBody>
                    <CustomInput
                      labelText="e-mail"
                      id="email"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: this.state.email,
                        onChange: this.handleChange('email'),
                        type: 'email',
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
                      inputProps={{
                        type: 'password',
                        value: this.state.password,
                        onChange: this.handleChange('password'),
                        endAdornment: (
                          <InputAdornment position="end">
                            <LockOutline className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button
                      simple
                      color="primary"
                      size="lg"
                      component={Link}
                      to="/register"
                    >
                      No tengo cuenta
                    </Button>
                    <Button
                      simple
                      color="primary"
                      size="lg"
                      onClick={this.handleLogin}
                    >
                      Ingresar
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(loginPageStyle)(LoginPage));
