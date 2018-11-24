import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AssignmentForm from 'components/Assignment/AssignmentForm';

import Content from 'layouts/Content';

class AssignmentNew extends Component {
  render() {
    const { currentUser } = this.props;

    return (
      <Content title="Trabajos prácticos" subtitle="Nuevo trabajo práctico">
        <AssignmentForm currentUser={currentUser} />
      </Content>
    );
  }
}

AssignmentNew.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
});

export default connect(
  mapStateToProps,
  null,
)(AssignmentNew);
