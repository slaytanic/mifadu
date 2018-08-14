import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';

// nodejs library that concatenates classes
import classNames from 'classnames';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// @material-ui/icons
// import Camera from '@material-ui/icons/Camera';
import Palette from '@material-ui/icons/Palette';
import Favorite from '@material-ui/icons/Favorite';
// core components
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import Button from 'components/CustomButtons/Button';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import HeaderLinks from 'components/Header/HeaderLinks';
import NavPills from 'components/NavPills/NavPills';
import Parallax from 'components/Parallax/Parallax';

import profile from 'assets/img/faces/christian.jpg';

import studio1 from 'assets/img/examples/studio-1.jpg';
// import studio2 from 'assets/img/examples/studio-2.jpg';
import studio3 from 'assets/img/examples/studio-3.jpg';
// import studio4 from 'assets/img/examples/studio-4.jpg';
// import studio5 from 'assets/img/examples/studio-5.jpg';
import work1 from 'assets/img/examples/olu-eletu.jpg';
import work2 from 'assets/img/examples/clem-onojeghuo.jpg';
import work3 from 'assets/img/examples/cynthia-del-rio.jpg';
import work4 from 'assets/img/examples/mariya-georgieva.jpg';
import work5 from 'assets/img/examples/clem-onojegaw.jpg';

import profileBg from 'assets/img/profile-bg.jpg';

import profilePageStyle from 'assets/jss/material-kit-react/views/profilePage';

import SectionAssignments from './Sections/AssignmentsSection';
import SectionUsers from './Sections/UsersSection';

const styles = {
  ...profilePageStyle,
};

class DashboardPage extends React.Component {
  render() {
    const { classes, user, logoutUser, ...rest } = this.props;
    const imageClasses = classNames(classes.imgRaised, classes.imgRoundedCircle, classes.imgFluid);
    const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
    return (
      <div>
        <Header
          // color="transparent"
          brand="MiFADU"
          rightLinks={<HeaderLinks user={user} logoutUser={logoutUser} />}
          fixed
          changeColorOnScroll={{
            height: 200,
            color: 'white',
          }}
          {...rest}
        />
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
                      <h3 className={classes.title}>
                        {user.firstName} {user.lastName}
                      </h3>
                      <h6>{user.email}</h6>
                      {/* <Button justIcon link className={classes.margin5}>
                        <i className={'fab fa-twitter'} />
                      </Button>
                      <Button justIcon link className={classes.margin5}>
                        <i className={'fab fa-instagram'} />
                      </Button>
                      <Button justIcon link className={classes.margin5}>
                        <i className={'fab fa-facebook'} />
                      </Button> */}
                    </div>
                  </div>
                </GridItem>
              </GridContainer>
              <div className={classes.description}>
                <p>Lalalalala lal al la lla lal la la lal la la la lallalala</p>
                <Button component={Link} to='/assignments'>TPs</Button>
                <Button component={Link} to='/users'>Usuarios</Button>
              </div>
              <Switch>
                <Route path="/users" render={() => <SectionUsers />} />
                <Route path="/assignments" render={() => <SectionAssignments />} />
              </Switch>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={8} className={classes.navWrapper}>
                  <NavPills
                    alignCenter
                    color="primary"
                    tabs={[
                      {
                        tabButton: 'Trabajos',
                        tabIcon: Palette,
                        tabContent: (
                          <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={4}>
                              <img alt="..." src={work1} className={navImageClasses} />
                              <img alt="..." src={work2} className={navImageClasses} />
                              <img alt="..." src={work3} className={navImageClasses} />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                              <img alt="..." src={work4} className={navImageClasses} />
                              <img alt="..." src={work5} className={navImageClasses} />
                            </GridItem>
                          </GridContainer>
                        ),
                      },
                      {
                        tabButton: 'Favoritos',
                        tabIcon: Favorite,
                        tabContent: (
                          <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={4}>
                              <img alt="..." src={work4} className={navImageClasses} />
                              <img alt="..." src={studio3} className={navImageClasses} />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                              <img alt="..." src={work2} className={navImageClasses} />
                              <img alt="..." src={work1} className={navImageClasses} />
                              <img alt="..." src={studio1} className={navImageClasses} />
                            </GridItem>
                          </GridContainer>
                        ),
                      },
                    ]}
                  />
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles)(DashboardPage);
