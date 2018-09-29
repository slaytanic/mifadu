import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import withStyles from '@material-ui/core/styles/withStyles';

// import AssignmentReturn from '@material-ui/icons/AssignmentReturn';
// import Info from '@material-ui/icons/Info';
// import Delete from '@material-ui/icons/Delete';
// import Edit from '@material-ui/icons/Edit';

// import Button from 'components/material-kit-react/CustomButtons/Button';

// import CustomTable from 'components/CustomTable/CustomTable';
// import Modal from 'components/Modal/Modal';

import Content from 'layouts/Content';

// import { assignmentFetch } from '../../actions/assignment';

const styles = {};

class Assignments extends React.Component {
  // state = {
  //   modal: false,
  //   selectedAssignmentId: '',
  // };

  componentDidMount() {
    // const { dispatchAssignmentsFetch } = this.props;
    // dispatchAssignmentsFetch();
  }

  // handleDelete = key => () => {
  //   this.setState({ modal: true, selectedAssignmentId: key });
  // };

  // deleteAssignment = () => {
  //   const { dispatchAssignmentDelete } = this.props;
  //   const { selectedAssignmentId } = this.state;
  //   dispatchAssignmentDelete(selectedAssignmentId);
  //   this.setState({
  //     modal: false,
  //   });
  // };

  render() {
    const { classes, assignments, currentUser, match } = this.props;
    // const { modal } = this.state;

    return (
      <Content title="Trabajos prácticos" subtitle="Nuevo trabajo práctico">
        <div className={classes.root}>Nuevo TP</div>
      </Content>
    );
  }
}

Assignments.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  assignments: PropTypes.object.isRequired,
  // dispatchAssignmentFetch: PropTypes.func.isRequired,
  // dispatchAssignmentDelete: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  assignments: state.assignments,
});

const mapDispatchToProps = dispatch => ({
  // dispatchAssignmentFetch: () => dispatch(assignmentFetch()),
  // dispatchAssignmentDelete: id => dispatch(assignmentDelete(id)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withStyles(styles)(Assignments)),
);
