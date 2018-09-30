import React from 'react';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';

import Close from '@material-ui/icons/Close';

import Button from 'components/material-kit-react/CustomButtons/Button';

import modalStyle from 'assets/jss/material-kit-react/modalStyle';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class Modal extends React.Component {
  render() {
    const {
      classes,
      handleOk,
      handleCancel,
      okText,
      cancelText,
      bodyText,
      titleText,
      open,
    } = this.props;

    return (
      <div>
        <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal,
          }}
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCancel}
          aria-labelledby="modal-slide-title"
          aria-describedby="modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <IconButton
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={handleCancel}
            >
              <Close className={classes.modalClose} />
            </IconButton>
            <h4 className={classes.modalTitle}>{titleText}</h4>
          </DialogTitle>
          <DialogContent id="modal-slide-description" className={classes.modalBody}>
            <h5>{bodyText}</h5>
          </DialogContent>
          <DialogActions className={`${classes.modalFooter} ${classes.modalFooterCenter}`}>
            <Button onClick={handleCancel}>{cancelText || 'Cancel'}</Button>
            <Button onClick={handleOk} color="successNoBackground">
              {okText || 'Ok'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Modal.defaultProps = {
  okText: undefined,
  cancelText: undefined,
};

Modal.propTypes = {
  classes: PropTypes.object.isRequired,
  handleOk: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  bodyText: PropTypes.string.isRequired,
  titleText: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withStyles(modalStyle)(Modal);