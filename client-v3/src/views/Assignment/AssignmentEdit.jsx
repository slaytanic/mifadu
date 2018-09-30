import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AssignmentForm from 'components/Assignment/AssignmentForm';

import Content from 'layouts/Content';

import { assignmentFetch } from 'actions/assignment';

class AssignmentNew extends Component {
  componentDidMount() {
    const { dispatchAssignmentFetch, match } = this.props;
    dispatchAssignmentFetch(match.params.id);
  }

  render() {
    const { currentUser, assignments, match } = this.props;

    const assignment = assignments.all.find(a => a.id === match.params.id);

    return (
      <Content title="Trabajos prácticos" subtitle="Nuevo trabajo práctico">
        <AssignmentForm currentUser={currentUser} assignment={assignment} />
      </Content>
    );
  }
}

AssignmentNew.propTypes = {
  currentUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  dispatchAssignmentFetch: PropTypes.func.isRequired,
  assignments: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  assignments: state.assignments,
});

const mapDispatchToProps = dispatch => ({
  dispatchAssignmentFetch: id => dispatch(assignmentFetch(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssignmentNew);
