import React from 'react';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';

import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';
import Card from 'components/material-kit-react/Card/Card';
import CardHeader from 'components/material-kit-react/Card/CardHeader';

import RecoverPasswordForm from './RecoverPasswordForm';

import loginPageStyle from 'assets/jss/material-kit-react/views/loginPage';

import image from 'assets/img/page_background.png';

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
                  <h4>Recuperar clave</h4>
                </CardHeader>
                <p className={classes.divider}>Para recuperar su clave ingrese su e-mail</p>
                <RecoverPasswordForm />
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