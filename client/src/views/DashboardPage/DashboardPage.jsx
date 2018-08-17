import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';

// nodejs library that concatenates classes
import classNames from 'classnames';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Icon from '@material-ui/core/Icon';
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
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
// import CardBody from 'components/Card/CardBody';
import CardFooter from 'components/Card/CardFooter';
import CardIcon from 'components/Card/CardIcon';

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
import { container, title } from "assets/jss/material-kit-react";
import imagesStyle from "assets/jss/material-kit-react/imagesStyles";

// import dashboardStyle from 'assets/jss/material-dashboard-react/views/dashboardStyle';

// import AssignmentsSection from './Sections/AssignmentsSection';
// import UsersSection from './Sections/UsersSection';

const styles = {
  // ...dashboardStyle,
  // ...profilePageStyle,
  // card: {
  //   maxWidth: '300px',
  // },
  // container: { ...container, color: '#3C4858' },
  ...container,
  profile: {
    textAlign: "center",
    "& img": {
      maxWidth: "160px",
      width: "100%",
      margin: "0 auto",
      transform: "translate3d(0, -50%, 0)"
    }
  },
  description: {
    margin: "1.071rem auto 0",
    maxWidth: "600px",
    color: "#999",
    textAlign: "center !important"
  },
  name: {
    marginTop: "-100px"
  },
  ...imagesStyle,
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainRaised: {
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    // marginTop: "30px",
    // minHeight: "32px",
    textDecoration: "none"
  },
  subtitle: {
    marginTop: '-10px',
    marginBottom: "24px",
  },
  socials: {
    marginTop: "0",
    width: "100%",
    transform: "none",
    left: "0",
    top: "0",
    height: "100%",
    lineHeight: "41px",
    fontSize: "20px",
    color: "#999"
  },
  navWrapper: {
    margin: "20px auto 50px auto",
    textAlign: "center"
  },
  cardCategory: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitle: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontWeight: '400',
      lineHeight: '1',
    },
  },
};

class DashboardPage extends React.Component {
  render() {
    const { classes, user, logoutUser, ...rest } = this.props;
    const imageClasses = classNames(classes.imgRaised, classes.imgRoundedCircle, classes.imgFluid);
    const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);

    const mainView = (
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
    );

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
                      <h6 className={classes.subtitle}>{user.email}</h6>
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
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={4}>
                  <Card className={classes.card}>
                    <CardHeader color="warning" stats icon>
                      <CardIcon color="warning">
                        <Icon>content_copy</Icon>
                      </CardIcon>
                      <p className={classes.cardCategory}>Entregas pendientes</p>
                      <h3 className={classes.cardTitle}>49/50</h3>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <Link to="/assignments/pending">
                          Ver entregas pendientes
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Card className={classes.card}>
                    <CardHeader color="warning" stats icon>
                      <CardIcon color="warning">
                        <Icon>content_copy</Icon>
                      </CardIcon>
                      <p className={classes.cardCategory}>Entregas en evaluación</p>
                      <h3 className={classes.cardTitle}>49/50</h3>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <Link to="/assignments/complete">
                          Ver entregas realizadas
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                </GridItem>
                {/* <GridItem xs={12} sm={12} md={4}>
                  <Card className={classes.card}>
                    <CardHeader color="warning" stats icon>
                      <CardIcon color="warning">
                        <Icon>content_copy</Icon>
                      </CardIcon>
                      <p className={classes.cardCategory}>Entregas en evaluación</p>
                      <h3 className={classes.cardTitle}>49/50</h3>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <a href="#pablo" onClick={e => e.preventDefault()}>
                          Ver entregas realizadas
                        </a>
                      </div>
                    </CardFooter>
                  </Card>
                </GridItem> */}
              </GridContainer>

              <div className={classes.description}>
                <p>Lalalalala lal al la lla lal la la lal la la la lallalala</p>
                <Button component={Link} to="/assignments">
                  TPs
                </Button>
                <Button component={Link} to="/users">
                  Usuarios
                </Button>
              </div>
              {/* <Switch>
                <Route path="/" exact render={() => mainView} />
                <Route path="/users" render={() => <UsersSection />} />
                <Route path="/assignments" render={() => <AssignmentsSection />} />
              </Switch> */}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles)(DashboardPage);
