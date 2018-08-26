import React from 'react';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// nodejs library that concatenates classes
import classNames from 'classnames';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';

// core components

import buttonStyle from 'assets/jss/material-kit-react/components/buttonStyle';

const styles = {
  ...buttonStyle,
  wrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
};

function RegularButton({ ...props }) {
  const {
    classes,
    color,
    round,
    children,
    fullWidth,
    disabled,
    simple,
    size,
    block,
    link,
    justIcon,
    className,
    loading,
    ...rest
  } = props;
  const btnClasses = classNames({
    [classes.button]: true,
    [classes[size]]: size,
    [classes[color]]: color,
    [classes.round]: round,
    [classes.fullWidth]: fullWidth,
    [classes.disabled]: disabled || loading,
    [classes.simple]: simple,
    [classes.block]: block,
    [classes.link]: link,
    [classes.justIcon]: justIcon,
    [className]: className,
  });
  return (
    <div className={classes.wrapper}>
      <Button {...rest} className={btnClasses}>
        {children}
      </Button>
      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  );
}

RegularButton.defaultProps = {
  color: 'primary',
  size: '',
  simple: false,
  round: false,
  fullWidth: false,
  disabled: false,
  block: false,
  link: false,
  justIcon: false,
};

RegularButton.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    'primary',
    'info',
    'success',
    'warning',
    'danger',
    'rose',
    'white',
    'facebook',
    'twitter',
    'google',
    'github',
    'transparent',
  ]),
  size: PropTypes.oneOf(['', 'sm', 'lg']),
  simple: PropTypes.bool,
  round: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  link: PropTypes.bool,
  justIcon: PropTypes.bool,
};

export default withStyles(styles)(RegularButton);
