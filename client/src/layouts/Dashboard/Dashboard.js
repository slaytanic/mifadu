import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Image, Transformation } from 'cloudinary-react';

import withStyles from '@material-ui/core/styles/withStyles';

import Parallax from 'components/material-kit-react/Parallax/Parallax';
import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';

import profilePageStyle from 'assets/jss/material-kit-react/views/profilePage';

import profile from 'assets/img/avatar.jpg';
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
    const { children, classes, me } = this.props;

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
                      {me.avatar && me.avatar.publicId ? (
                        <Image publicId={me.avatar.publicId} className={imageClasses}>
                          <Transformation width="160" height="160" gravity="faces" crop="fill" />
                        </Image>
                      ) : (
                        <img src={profile} alt="..." className={imageClasses} />
                      )}
                    </div>
                    <div className={classes.name}>
                      <h3>
                        {me.firstName} {me.lastName}
                      </h3>
                      <h6 className={classes.subtitle}>{me.email}</h6>
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
  me: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
