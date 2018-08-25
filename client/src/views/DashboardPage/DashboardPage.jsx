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

import logo from 'logo.svg';

// import { container, title } from 'assets/jss/material-kit-react';
// import imagesStyle from 'assets/jss/material-kit-react/imagesStyles';

import profilePageStyle from 'assets/jss/material-kit-react/views/profilePage';
import dashboardStyle from 'assets/jss/material-dashboard-react/views/dashboardStyle';

import {
  getMyStudents,
  getPendingAssignments,
  getCompletedAssignments,
  getMyWorkshops,
} from '../../data/service';

// import AssignmentsSection from './Sections/AssignmentsSection';
// import UsersSection from './Sections/UsersSection';

const styles = {
  ...dashboardStyle,
  ...profilePageStyle,
  container: {
    ...profilePageStyle.container,
    paddingBottom: '50px',
  },
  subtitle: {
    marginTop: '-10px',
    marginBottom: '24px',
  },
  cardCategory: {
    ...dashboardStyle.cardCategory,
    color: '#FFFFFF',
  },
  cardTitle: {
    ...dashboardStyle.cardTitle,
    color: '#FFFFFF',
  },
};

class DashboardPage extends React.Component {
  state = {
    userCount: 0,
    pendingCount: 0,
    completedCount: 0,
    workshops: [],
  };

  componentDidMount() {
    getMyStudents().then(res => {
      this.setState({ userCount: res.data.data.myStudents.length });
    });
    getPendingAssignments().then(res => {
      this.setState({ pendingCount: res.data.data.pendingAssignments.length });
    });
    getCompletedAssignments().then(res => {
      this.setState({ completedCount: res.data.data.completedAssignments.length });
    });
    getMyWorkshops().then(res => {
      this.setState({ workshops: res.data.data.myWorkshops });
    });
  }

  render() {
    const { classes, user, logoutUser, ...rest } = this.props;
    const { userCount, pendingCount, completedCount, workshops } = this.state;
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
          brand={<Link to="/">MiFADU</Link>}
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
                    <CardHeader color="primary" stats icon>
                      <CardIcon color="primary">
                        <Icon>person</Icon>
                      </CardIcon>
                      <p className={classes.cardCategory}>Miembros del taller</p>
                      <h3 className={classes.cardTitle}>{userCount}</h3>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <Link to="/users">Ver miembros del taller</Link>
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
                      <p className={classes.cardCategory}>Entregas pendientes</p>
                      <h3 className={classes.cardTitle}>{pendingCount}</h3>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <Link to="/assignments/pending">Ver entregas pendientes</Link>
                      </div>
                    </CardFooter>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Card className={classes.card}>
                    <CardHeader color="success" stats icon>
                      <CardIcon color="success">
                        <Icon>content_copy</Icon>
                      </CardIcon>
                      <p className={classes.cardCategory}>Entregas realizadas</p>
                      <h3 className={classes.cardTitle}>{completedCount}</h3>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <Link to="/assignments/complete">Ver entregas realizadas</Link>
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
                {/* <p>Lalalalala lal al la lla lal la la lal la la la lallalala</p> */}
                {workshops.map(() => (
                  <Button color="primary" component={Link} to="/assignments/new">
                    Crear nuevo Trabajo Práctico
                  </Button>
                ))}
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
