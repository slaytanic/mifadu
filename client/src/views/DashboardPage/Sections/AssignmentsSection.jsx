import React from 'react';
// import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';

const styles = {};

class AssignmentsSection extends React.Component {
  propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;
    return <div className={classes.root} />;
  }
}

export default withStyles(styles)(AssignmentsSection);
