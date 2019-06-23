import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';

import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import CustomDropdown from 'components/material-kit-react/CustomDropdown/CustomDropdown';
import Button from 'components/material-kit-react/CustomButtons/Button';

import headerLinksStyle from 'assets/jss/material-kit-react/components/headerLinksStyle';
import navbarsStyle from 'assets/jss/material-kit-react/views/componentsSections/navbarsStyle';

import profileImage from 'assets/img/avatar.jpg';

const styles = theme => ({
  ...navbarsStyle(theme),
  ...headerLinksStyle(theme),
});

function HeaderLinks({ ...props }) {
  const { classes, me, logoutUser } = props;

  const links = [
    <ListItem className={classes.listItem} key="home">
      <Button component={Link} to="/" color="transparent" className={classes.navLink}>
        Inicio
      </Button>
    </ListItem>,
  ];
  if (me.workshops.filter(w => w.isTutor).length) {
    links.push(
      <ListItem className={classes.listItem} key="assignments">
        <Button
          component={Link}
          to={`/workshops/${me.workshop.id}/assignments`}
          color="transparent"
          className={classes.navLink}
        >
          Trabajos prácticos
        </Button>
      </ListItem>,
    );
    links.push(
      <ListItem className={classes.listItem} key="assignments">
        <Button
          component={Link}
          to={`/workshops/${me.workshop.id}/evaluations`}
          color="transparent"
          className={classes.navLink}
        >
          Evaluaciones
        </Button>
      </ListItem>,
    );

    // links.push(
    //   <ListItem className={classes.listItem} key="pending-evaluation">
    //     <Button
    //       component={Link}
    //       to={`/workshops/${me.workshop.id}/evaluations/pending`}
    //       color="transparent"
    //       className={classes.navLink}
    //     >
    //       Pendientes
    //     </Button>
    //   </ListItem>,
    // );
    // links.push(
    //   <ListItem className={classes.listItem} key="completed-evaluation">
    //     <Button
    //       component={Link}
    //       to={`/workshops/${me.workshop.id}/evaluations/completed`}
    //       color="transparent"
    //       className={classes.navLink}
    //     >
    //       Evaluados
    //     </Button>
    //   </ListItem>,
    // );
  } else {
    links.push(
      <ListItem className={classes.listItem} key="pending">
        <Button
          component={Link}
          to={`/workshops/${me.workshop.id}/assignments/pending`}
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
          to={`/workshops/${me.workshop.id}/assignments/completed`}
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
          dropdownHeader={me.email}
          buttonText={
            me.avatar && me.avatar.publicId ? (
              <Image publicId={me.avatar.publicId} className={classes.img}>
                <Transformation width="40" height="40" gravity="faces" crop="fill" />
              </Image>
            ) : (
              <img src={profileImage} className={classes.img} alt="profile" />
            )
          }
          buttonProps={{
            className: `${classes.navLink} ${classes.imageDropdownButton}`,
            color: 'transparent',
          }}
          dropdownList={[
            <Button onClick={logoutUser} fullWidth simple className={classes.dropdownLink}>
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
  me: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

export default withStyles(styles)(HeaderLinks);
