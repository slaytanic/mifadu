import React from 'react';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
// nodejs library that concatenates classes
import classNames from 'classnames';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

// @material-ui/icons

// core components
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Button from 'components/CustomButtons/Button';
import HeaderLinks from 'components/Header/HeaderLinks';
import Parallax from 'components/Parallax/Parallax';

import landingPageStyle from 'assets/jss/material-kit-react/views/landingPage';

// Sections for this page
import AssignmentsSection from './Sections/AssignmentsSection';
// import AssignmentSection from "./Sections/AssignmentSection";
import AssignmentForm from './Forms/AssignmentForm';
import AssignmentWorkForm from './Forms/AssignmentWorkForm';
import UsersSection from './Sections/UsersSection';
// import ProductSection from "./Sections/ProductSection";
// import TeamSection from "./Sections/TeamSection";
// import WorkSection from "./Sections/WorkSection";

// import { container, title } from 'assets/jss/material-kit-react.jsx';

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
  subtitle: {
    color: '#fff',
  }
};

class AdminPage extends React.Component {
  render() {
    const { classes, user, logoutUser, match, location, ...rest } = this.props;
    let title = 'MiFADU';
    let subtitle = 'Bienvenido a MiFADU';
    if (match.params.collection === 'assignments') {
      title = 'Trabajos prácticos';
      subtitle = 'Todos los trabajos prácticos';
      if (match.params.action === 'edit') {
        title = 'Trabajo práctico';
        subtitle = 'Editar';
      } else if (match.params.action === 'new') {
        title = 'Trabajo práctico';
        subtitle = 'Nuevo';
      } else if (match.params.action === 'submit') {
        title = 'Trabajo práctico';
        subtitle = 'Realizar entrega';
      } else if (match.params.action === 'pending') {
        subtitle = 'Pendientes de entrega';
      } else if (match.params.action === 'complete') {
        subtitle = 'Entregados';
      } else if (match.params.id) {
        title = 'Trabajo práctico';
        subtitle = 'Detalle';
      }
    } else if (match.params.collection === 'users') {
      if (match.params.action === 'edit') {
        title = 'Editar usuario';
      } else if (match.params.id) {
        title = 'Usuario';
      } else {
        title = 'Usuarios';
      }
    }
    return (
      <div>
        <Header
          brand={<Link to="/">MiFADU</Link>}
          rightLinks={<HeaderLinks user={user} logoutUser={logoutUser} />}
          fixed
          changeColorOnScroll={{
            height: 200,
            color: 'white',
          }}
          {...rest}
        />
        <Parallax small filter image={require('assets/img/profile-bg.jpg')}>
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
          <div className={classes.container}>
            {/* <Button component={Link} to="/assignments">
              TPs
            </Button>

            <Button component={Link} to="/assignments/new">
              Crear TP
            </Button>
            <Button component={Link} to="/users">
              Usuarios
            </Button> */}
            <Switch>
              <Route path="/users/:id?/:action" render={() => <UsersSection />} />
              <Route path="/users" render={() => <UsersSection />} />
              <Route
                path="/assignments/:action(complete|pending)"
                render={() => <AssignmentsSection />}
              />
              <Route
                path="/assignments/:id?/:action(submit)"
                render={() => <AssignmentWorkForm />}
              />
              <Route path="/assignments/:id?/:action" render={() => <AssignmentForm />} />
            </Switch>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(AdminPage));
