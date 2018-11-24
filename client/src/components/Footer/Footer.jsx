import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { List, ListItem, withStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import Button from 'components/material-kit-react/CustomButtons/Button';

import footerStyle from 'assets/jss/material-kit-react/components/footerStyle';
import tooltipsStyle from 'assets/jss/material-kit-react/tooltipsStyle';

const styles = {
  ...tooltipsStyle,
  ...footerStyle,
};

function Footer({ ...props }) {
  const { classes, whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont,
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                href="http://catedrarondina.com.ar/"
                className={classes.block}
                rel="noopener noreferrer"
                target="_blank"
              >
                Cátedra Rondina
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Tooltip
                id="youtube-tooltip"
                title="Nuestro canal de YouTube"
                placement={window.innerWidth > 959 ? 'top' : 'left'}
                classes={{ tooltip: classes.tooltip }}
              >
                <Button
                  href="https://www.youtube.com/channel/UCgvrvNshrfaboi5FDVwOmOw"
                  target="_blank"
                  color="transparent"
                  className={classes.navLink}
                >
                  <i className={`${classes.socialIcons} fab fa-youtube`} />
                </Button>
              </Tooltip>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Tooltip
                id="facebook-tooltip"
                title="Nuestro Facebook"
                placement={window.innerWidth > 959 ? 'top' : 'left'}
                classes={{ tooltip: classes.tooltip }}
              >
                <Button
                  color="transparent"
                  href="https://www.facebook.com/CatedraRondina/"
                  target="_blank"
                  className={classes.navLink}
                >
                  <i className={`${classes.socialIcons} fab fa-facebook`} />
                </Button>
              </Tooltip>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Tooltip
                id="instagram-tooltip"
                title="Nuestro Instagram"
                placement={window.innerWidth > 959 ? 'top' : 'left'}
                classes={{ tooltip: classes.tooltip }}
              >
                <Button
                  color="transparent"
                  href="https://www.instagram.com/catedrarondina/"
                  target="_blank"
                  className={classes.navLink}
                >
                  <i className={`${classes.socialIcons} fab fa-instagram`} />
                </Button>
              </Tooltip>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>&copy; {1900 + new Date().getYear()} MiFADU</div>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  whiteFont: false,
};

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  whiteFont: PropTypes.bool,
};

export default withStyles(styles)(Footer);
