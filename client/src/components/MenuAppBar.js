import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';

import Logo from '../logo.svg';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
  flex: {
    flexGrow: 1,
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    // display: 'flex',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-left': {
    marginLeft: -drawerWidth,
  },
  'content-right': {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  },
  button: {
    marginRight: theme.spacing.unit * 2,
  },
});

class MenuAppBar extends React.Component {
  state = {
    auth: false,
    menuAnchor: null,
    drawerAnchor: 'left',
    drawerOpen: false,
  };

  static getDerivedStateFromProps(props, state) {
    return { auth: props.user ? true : false };
  }

  handleDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };

  handleMenu = event => {
    this.setState({ menuAnchor: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ menuAnchor: null });
  };

  render() {
    const { classes, theme, user } = this.props;
    const { auth, menuAnchor, drawerAnchor, drawerOpen } = this.state;
    const menuOpen = Boolean(menuAnchor);

    return (
      <div className={classes.root}>
        <AppBar
          className={classNames(classes.appBar, {
            [classes.appBarShift]: drawerOpen,
            [classes[`appBarShift-${drawerAnchor}`]]: drawerOpen,
          })}
        >
          <Toolbar disableGutters={!drawerOpen}>
            <IconButton
              color="inherit"
              aria-label="Menu"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                drawerOpen && classes.hide,
              )}
            >
              <MenuIcon />
            </IconButton>
            <div className={classes.flex}>
              <Link to="/">
                <img src={Logo} height="48" alt="MiFADU" />
              </Link>
            </div>
            {/* <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              MIFADU
            </Typography> */}
            {auth ? (
              <div>
                <IconButton
                  aria-owns={menuOpen ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                  className={classes.button}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={menuAnchor}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={menuOpen}
                  onClose={this.handleClose}
                >
                  <List>
                    <ListItem>
                      <ListItemText
                        primary={`${user.firstName} ${user.lastName}`}
                        secondary={user.email}
                      />
                    </ListItem>
                  </List>
                  <Divider />

                  <MenuItem onClick={this.props.logoutUser}>Salir</MenuItem>
                </Menu>
              </div>
            ) : (
              <Button
                color="inherit"
                className={classes.button}
                component={Link}
                to="/login"
              >
                Ingresar
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="persistent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor={drawerAnchor}
          open={drawerOpen}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List component="nav">
            <ListItem button>
              <Avatar>
                <ImageIcon />
              </Avatar>
              <ListItemText primary="Photos" />
            </ListItem>
            <ListItem button>
              <Avatar>
                <WorkIcon />
              </Avatar>
              <ListItemText primary="Work" />
            </ListItem>
            <ListItem button>
              <Avatar>
                <BeachAccessIcon />
              </Avatar>
              <ListItemText primary="Vacation" />
            </ListItem>
          </List>
          <Divider />
          <List />
        </Drawer>
        <main
          className={classNames(
            classes.content,
            classes[`content-${drawerAnchor}`],
            {
              [classes.contentShift]: drawerOpen,
              [classes[`contentShift-${drawerAnchor}`]]: drawerOpen,
            },
          )}
        >
          <div className={classes.drawerHeader} />
          {this.props.children}
        </main>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MenuAppBar);
