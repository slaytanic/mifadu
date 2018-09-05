/*eslint-disable*/
import React from 'react';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// nodejs library that concatenates classes
import classNames from 'classnames';
import { List, ListItem, withStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

// @material-ui/icons
import Favorite from '@material-ui/icons/Favorite';

import Button from 'components/CustomButtons/Button.jsx';

import footerStyle from 'assets/jss/material-kit-react/components/footerStyle.jsx';
import tooltip from 'assets/jss/material-kit-react/tooltipsStyle.jsx';

const styles = {
  ...tooltip,
  ...footerStyle,
};

function Footer({ ...props }) {
  const { classes, whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont,
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont,
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="http://catedrarondina.com.ar/" className={classes.block} target="_blank">
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
                  <i className={classes.socialIcons + ' fab fa-youtube'} />
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
                  <i className={classes.socialIcons + ' fab fa-facebook'} />
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
                  <i className={classes.socialIcons + ' fab fa-instagram'} />
                </Button>
              </Tooltip>
            </ListItem>

            {/* <ListItem className={classes.inlineBlock}>
              <a
                href="https://www.creative-tim.com/presentation"
                className={classes.block}
                target="_blank"
              >
                About us
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="http://blog.creative-tim.com/"
                className={classes.block}
                target="_blank"
              >
                Blog
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://www.creative-tim.com/license"
                className={classes.block}
                target="_blank"
              >
                Licenses
              </a>
            </ListItem> */}
          </List>
        </div>
        <div className={classes.right}>&copy; {1900 + new Date().getYear()} MiFADU</div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  whiteFont: PropTypes.bool,
};

export default withStyles(styles)(Footer);
