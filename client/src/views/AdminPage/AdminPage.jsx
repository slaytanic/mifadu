import React from "react";
import { Switch, Route, Link } from 'react-router-dom';
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components
import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button";
import HeaderLinks from "components/Header/HeaderLinks";
import Parallax from "components/Parallax/Parallax";

import landingPageStyle from "assets/jss/material-kit-react/views/landingPage";

// Sections for this page
import AssignmentsSection from "./Sections/AssignmentsSection";
// import AssignmentSection from "./Sections/AssignmentSection";
import AssignmentForm from "./Forms/AssignmentForm";
import UsersSection from "./Sections/UsersSection";
// import ProductSection from "./Sections/ProductSection";
// import TeamSection from "./Sections/TeamSection";
// import WorkSection from "./Sections/WorkSection";

// import { container, title } from 'assets/jss/material-kit-react.jsx';

// const landingPageStyle = {
  // container: {
  //   zIndex: '12',
  //   color: '#FFFFFF',
  //   ...container,
  // },
  // title: {
  //   ...title,
  //   display: 'inline-block',
  //   position: 'relative',
  //   marginTop: '30px',
  //   minHeight: '32px',
  //   color: '#FFFFFF',
  //   textDecoration: 'none',
  // },
  // subtitle: {
  //   fontSize: '1.313rem',
  //   maxWidth: '500px',
  //   margin: '10px auto 0',
  // },
  // main: {
  //   background: '#FFFFFF',
  //   position: 'relative',
  //   zIndex: '3',
  // },
  // mainRaised: {
  //   margin: '-60px 30px 0px',
  //   borderRadius: '6px',
  //   boxShadow:
  //     '0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
  // },
// };

const dashboardRoutes = [];

class LandingPage extends React.Component {
  render() {
    const { classes, user, logoutUser, ...rest } = this.props;
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
        <Parallax small filter image={require("assets/img/profile-bg.jpg")}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <h1 className={classes.title}>Admin</h1>
                {/* <h4>
                  Every landing page needs a small description after the big
                  bold title, that's why we added this text here. Add here all
                  the information that can make you or your product create the
                  first impression.
                </h4> */}
                {/* <br />
                <Button
                  color="danger"
                  size="lg"
                  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-play" />Watch video
                </Button> */}
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container}>
          <Button component={Link} to="/assignments">
                  TPs
                </Button>

          <Button component={Link} to="/assignments/new">
                  Crear TP
                </Button>
                <Button component={Link} to="/users">
                  Usuarios
                </Button>
            <Switch>
                <Route path="/users" exact render={() => <UsersSection />} />
                <Route path="/assignments" exact render={() => <AssignmentsSection />} />
                <Route path="/assignments/new" render={() => <AssignmentForm />} />
                {/* <Route path="/assignments/:id" render={() => <AssignmentForm />} />
                <Route path="/assignments/:id/edit" render={() => <AssignmentForm />} /> */}
              </Switch>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(landingPageStyle)(LandingPage);
