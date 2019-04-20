import React from 'react';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';

import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';
import Card from 'components/material-kit-react/Card/Card';
import CardHeader from 'components/material-kit-react/Card/CardHeader';

import loginPageStyle from 'assets/jss/material-kit-react/views/loginPage';
import customInputStyle from 'assets/jss/material-kit-react/components/customInputStyle';
import customCheckboxRadioSwitch from 'assets/jss/material-kit-react/customCheckboxRadioSwitch';

import RegisterForm from './RegisterForm';

import image from 'assets/img/page_background.png';

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

class Register extends React.Component {
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
    const { classes, me, logoutUser } = this.props;
    const { cardAnimation } = this.state;

    return (
      <div>
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
          }}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <Card className={classes[cardAnimation]}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Registrarse en MiFADU</h4>
                  </CardHeader>
                  <RegisterForm me={me} logoutUser={logoutUser} />
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    );
  }
}

Register.defaultProps = {
  me: null,
};

Register.propTypes = {
  classes: PropTypes.object.isRequired,
  me: PropTypes.object,
};

export default withStyles(styles)(Register);
