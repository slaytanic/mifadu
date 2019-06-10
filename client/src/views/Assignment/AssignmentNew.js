import React from 'react';
import PropTypes from 'prop-types';

import AssignmentForm from './AssignmentForm';

import Content from 'layouts/Content/Content';

const AssignmentNew = ({ me }) => {
  return (
    <Content title="Trabajos prácticos" subtitle="Nuevo trabajo práctico">
      <AssignmentForm me={me} />
    </Content>
  );
};

AssignmentNew.propTypes = {
  me: PropTypes.object.isRequired,
};

export default AssignmentNew;
