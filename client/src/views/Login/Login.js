import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';

import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';
import Button from 'components/material-kit-react/CustomButtons/Button';
import Card from 'components/material-kit-react/Card/Card';
import CardHeader from 'components/material-kit-react/Card/CardHeader';

import LoginForm from './LoginForm';

import loginPageStyle from 'assets/jss/material-kit-react/views/loginPage';

import image from 'assets/img/page_background.png';

class Login extends Component {
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
    const { classes } = this.props;
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
                <LoginForm />
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
};

export default withStyles(loginPageStyle)(Login);
