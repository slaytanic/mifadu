import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import CustomDropdown from 'components/material-kit-react/CustomDropdown/CustomDropdown';
import Button from 'components/material-kit-react/CustomButtons/Button';

import headerLinksStyle from 'assets/jss/material-kit-react/components/headerLinksStyle';
import navbarsStyle from 'assets/jss/material-kit-react/views/componentsSections/navbarsStyle';

import profileImage from 'assets/img/faces/avatar.jpg';

import { currentUserLogout } from 'actions/current-user';

const styles = theme => ({
  ...navbarsStyle(theme),
  ...headerLinksStyle(theme),
});

function HeaderLinks({ ...props }) {
  const { classes, currentUser, dispatchCurrentUserLogout } = props;

  const links = [
    <ListItem className={classes.listItem} key="home">
      <Button component={Link} to="/" color="transparent" className={classes.navLink}>
        Inicio
      </Button>
    </ListItem>,
  ];
  if (currentUser.tutoredWorkshops.length > 0) {
    links.push(
      <ListItem className={classes.listItem} key="assignments">
        <Button
          component={Link}
          to="/assignments"
          color="transparent"
          className={classes.navLink}
        >
          Trabajos prácticos
        </Button>
      </ListItem>,
    );
    links.push(
      <ListItem className={classes.listItem} key="pending-evaluation">
        <Button
          component={Link}
          to="/evaluations/pending"
          color="transparent"
          className={classes.navLink}
        >
          Pendientes
        </Button>
      </ListItem>,
    );
    links.push(
      <ListItem className={classes.listItem} key="completed-evaluation">
        <Button
          component={Link}
          to="/evaluations/completed"
          color="transparent"
          className={classes.navLink}
        >
          Evaluados
        </Button>
      </ListItem>,
    );
  } else {
    links.push(
      <ListItem className={classes.listItem} key="pending">
        <Button
          component={Link}
          to="/assignments/pending"
          color="transparent"
          className={classes.navLink}
        >
          Pendientes
        </Button>
      </ListItem>,
    );
    links.push(
      <ListItem className={classes.listItem} key="completed">
        <Button
          component={Link}
          to="/assignments/completed"
          color="transparent"
          className={classes.navLink}
        >
          Entregados
        </Button>
      </ListItem>,
    );
  }

  return (
    <List className={classes.list}>
      {links}
      <ListItem className={classes.listItem}>
        <CustomDropdown
          left
          caret={false}
          hoverColor="black"
          dropdownHeader={currentUser.email}
          buttonText={<img src={profileImage} className={classes.img} alt="profile" />}
          buttonProps={{
            className: `${classes.navLink} ${classes.imageDropdownButton}`,
            color: 'transparent',
          }}
          dropdownList={[
            <Button
              onClick={dispatchCurrentUserLogout}
              fullWidth
              simple
              className={classes.dropdownLink}
            >
              Salir
            </Button>,
          ]}
        />
      </ListItem>
    </List>
  );
}

HeaderLinks.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  dispatchCurrentUserLogout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
});

const mapDispatchToProps = dispatch => ({
  dispatchCurrentUserLogout: () => dispatch(currentUserLogout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(HeaderLinks));
