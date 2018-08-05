import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ErrorIcon from '@material-ui/icons/Error';

const styles = theme => {
  return {
    root: {
      width: '100%',
      // maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    listItemText: {
      color: theme.palette.error.main,
    },
    listItemIcon: {
      color: theme.palette.error.main,
    },
  };
};

function ErrorList(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <List component="nav">
        {props.errors.map(error => (
          <ListItem>
            <ListItemIcon>
              <ErrorIcon className={classes.listItemIcon} />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary={error.message}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

ErrorList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ErrorList);
