import React from 'react';

import EvaluationForm from 'views/Assignment/EvaluationForm';

import Content from 'layouts/Content/Content';

import AssignmentLead from './AssignmentLead';

function AssignmentSelfScore() {
  return (
    <Content title="Trabajos prácticos" subtitle="Autoevaluación">
      <AssignmentLead>
        <h6>Autoevaluación</h6>
        <EvaluationForm self />
      </AssignmentLead>
    </Content>
  );
}

export default AssignmentSelfScore;
