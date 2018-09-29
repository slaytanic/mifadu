import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import SnackbarContent from 'components/material-kit-react/Snackbar/SnackbarContent';

const styles = {
  list: { listStyle: 'none' },
};

function ErrorList(props) {
  const { errors, touched, classes } = props;

  const errorKeys = touched
    ? Object.keys(errors).filter(key => Object.keys(touched).includes(key))
    : Object.keys(errors);

  return (
    errorKeys.length > 0 && (
      <SnackbarContent
        message={
          <ul className={classes.list}>
            {errorKeys.map(key => (
              <li key={key}>{errors[key]}</li>
            ))}
          </ul>
        }
        color="danger"
        icon="info_outline"
      />
    )
  );
}

ErrorList.propTypes = {
  classes: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object,
};

export default withStyles(styles)(ErrorList);
