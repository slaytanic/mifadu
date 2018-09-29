/*eslint-disable*/
import React from 'react';
// react components for routing our app without refresh
import { Link } from 'react-router-dom';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import Tooltip from '@material-ui/core/Tooltip';

// @material-ui/icons
// import { Apps, CloudDownload } from '@material-ui/icons';

// core components
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.jsx';
import Button from 'components/CustomButtons/Button.jsx';

import headerLinksStyle from 'assets/jss/material-kit-react/components/headerLinksStyle.jsx';
import navbarsStyle from 'assets/jss/material-kit-react/views/componentsSections/navbarsStyle.jsx';

import profileImage from 'assets/img/faces/avatar.jpg';

const styles = theme => ({
  ...navbarsStyle(theme),
  ...headerLinksStyle(theme),
});

console.log('styles', styles);
console.log('headerLinksStyle', headerLinksStyle);

function HeaderLinks({ ...props }) {
  const { classes, user, logoutUser } = props;

  const links = [
    <ListItem className={classes.listItem} key="home">
      <Button component={Link} to="/" color="transparent" className={classes.navLink}>
        Inicio
      </Button>
    </ListItem>,
  ];
  if (user.tutoredWorkshops.length > 0) {
    links.push(
      <ListItem className={classes.listItem}>
        <Button
          component={Link}
          to="/assignments/pendingEvaluation"
          color="transparent"
          className={classes.navLink}
        >
          Pendientes
        </Button>
      </ListItem>,
    );
    links.push(
      <ListItem className={classes.listItem}>
        <Button
          component={Link}
          to="/assignments/completedEvaluation"
          color="transparent"
          className={classes.navLink}
        >
          Evaluados
        </Button>
      </ListItem>,
    );
  } else {
    links.push(
      <ListItem className={classes.listItem}>
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
      <ListItem className={classes.listItem}>
        <Button
          component={Link}
          to="/assignments/complete"
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
      {/* <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          buttonText="Components"
          buttonProps={{
            className: classes.navLink,
            color: "transparent"
          }}
          buttonIcon={Apps}
          dropdownList={[
            <Link to="/" className={classes.dropdownLink}>
              All components
            </Link>,
            <a
              href="https://creativetimofficial.github.io/material-kit-react/#/documentation"
              target="_blank"
              className={classes.dropdownLink}
            >
              Documentation
            </a>
          ]}
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          href="https://www.creative-tim.com/product/material-kit-react"
          color="transparent"
          target="_blank"
          className={classes.navLink}
        >
          <CloudDownload className={classes.icons} /> Download
        </Button>
      </ListItem> */}
      {links}
      <ListItem className={classes.listItem}>
        <CustomDropdown
          left
          caret={false}
          hoverColor="black"
          dropdownHeader={user.email}
          buttonText={<img src={profileImage} className={classes.img} alt="profile" />}
          buttonProps={{
            className: classes.navLink + ' ' + classes.imageDropdownButton,
            color: 'transparent',
          }}
          dropdownList={[
            <Link to="/" className={classes.dropdownLink}>
              Perfil
            </Link>,
            <a onClick={logoutUser} className={classes.dropdownLink}>
              Salir
            </a>,
          ]}
        />
      </ListItem>
    </List>
  );
}

export default withStyles(styles)(HeaderLinks);
