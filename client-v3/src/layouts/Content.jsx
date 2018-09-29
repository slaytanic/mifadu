import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';

import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';
import Parallax from 'components/material-kit-react/Parallax/Parallax';

import landingPageStyle from 'assets/jss/material-kit-react/views/landingPage';

import profileBg from 'assets/img/profile-bg.jpg';

const styles = {
  ...landingPageStyle,
  container: {
    ...landingPageStyle.container,
    paddingBottom: '50px',
    color: '#000',
  },
  main: {
    ...landingPageStyle.main,
  },
  title: {
    ...landingPageStyle.title,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  subtitle: {
    color: '#fff',
  },
};

class Content extends React.Component {
  render() {
    const { classes, children, title, subtitle } = this.props;
    return (
      <div>
        <Parallax small filter image={profileBg}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <h1 className={classes.title}>{title}</h1>
                <h4 className={classes.subtitle}>{subtitle}</h4>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container}>{children}</div>
        </div>
      </div>
    );
  }
}

Content.defaultProps = {
  title: 'MiFADU',
  subtitle: 'Bienvenido a MiFADU',
};

Content.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default withStyles(styles)(Content);
