import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import withStyles from '@material-ui/core/styles/withStyles';

import Parallax from 'components/material-kit-react/Parallax/Parallax';
import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';

import profilePageStyle from 'assets/jss/material-kit-react/views/profilePage';

import profile from 'assets/img/faces/avatar.jpg';
import profileBg from 'assets/img/profile-bg.jpg';

const styles = {
  ...profilePageStyle,
  container: {
    ...profilePageStyle.container,
    paddingBottom: '20px',
  },
};

class Dashboard extends Component {
  render() {
    const { children, classes, currentUser } = this.props;

    const imageClasses = classNames(classes.imgRaised, classes.imgRoundedCircle, classes.imgFluid);

    return (
      <div>
        <Parallax small filter image={profileBg} />
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <div className={classes.profile}>
                    <div>
                      <img src={profile} alt="..." className={imageClasses} />
                    </div>
                    <div className={classes.name}>
                      <h3>
                        {currentUser.firstName} {currentUser.lastName}
                      </h3>
                      <h6 className={classes.subtitle}>{currentUser.email}</h6>
                    </div>
                  </div>
                </GridItem>
              </GridContainer>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
});

export default connect(
  mapStateToProps,
  null,
)(withStyles(styles)(Dashboard));
