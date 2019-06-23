import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CircularGridLines } from 'react-vis';
import Slider from '@material-ui/lab/Slider';
import { graphql, compose } from 'react-apollo';

import withStyles from '@material-ui/core/styles/withStyles';

import CustomButton from 'components/CustomButton/CustomButton';
import CustomInput from 'components/material-kit-react/CustomInput/CustomInput';
import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';

import RadarChart from 'components/RadarChart/RadarChart';

import withAssignment from './withAssignment';

import SUBMIT_ASSIGNMENT_EVALUATION from 'graphql/mutations/SubmitAssignmentEvaluation';
import SUBMIT_ASSIGNMENT_SELF_EVALUATION from 'graphql/mutations/SubmitAssignmentSelfEvaluation';

const styles = {
  slider: {
    marginTop: '1rem',
    marginBottom: '3rem',
  },
};

class EvaluationForm extends Component {
  constructor(props) {
    super(props);
    const { assignment, self } = props;
    const { selfEvaluation, evaluation } = assignment;
    if (selfEvaluation && self === true) {
      this.state = {
        submitting: false,
        dirty: false,
        evaluation: {
          score1: selfEvaluation.score1 || 0,
          score2: selfEvaluation.score2 || 0,
          score3: selfEvaluation.score3 || 0,
          score4: selfEvaluation.score4 || 0,
          score5: selfEvaluation.score5 || 0,
          observations: selfEvaluation.observations || '',
        },
      };
    } else if (self !== true && evaluation) {
      this.state = {
        submitting: false,
        dirty: false,
        evaluation: {
          score1: (evaluation && evaluation.score1) || 0,
          score2: (evaluation && evaluation.score2) || 0,
          score3: (evaluation && evaluation.score3) || 0,
          score4: (evaluation && evaluation.score4) || 0,
          score5: (evaluation && evaluation.score5) || 0,
          observations: (evaluation && evaluation.observations) || '',
        },
      };
    } else {
      this.state = {
        submitting: false,
        dirty: false,
        evaluation: {
          score1: 0,
          score2: 0,
          score3: 0,
          score4: 0,
          score5: 0,
          observations: '',
        },
      };
    }
  }

  handleChange = name => (event, value) => {
    this.setState(prevState => ({
      dirty: true,
      evaluation: { ...prevState.evaluation, [name]: value },
    }));
  };

  handleChangeObservations = event => {
    event.persist();
    this.setState(prevState => ({
      dirty: true,
      evaluation: { ...prevState.evaluation, observations: event.target.value },
    }));
  };

  handleSubmit = async () => {
    const {
      submitAssignmentEvaluation,
      submitAssignmentSelfEvaluation,
      assignment,
      history,
      self,
      targetUserId,
      inPlace,
    } = this.props;
    const { evaluation } = this.state;

    this.setState({ submitting: true });
    if (self) {
      await submitAssignmentSelfEvaluation({ variables: { id: assignment.id, input: evaluation } });
      if (!inPlace) history.push(`/assignments/${assignment.id}`);
      this.setState({ submitting: false, dirty: false });
    } else {
      await submitAssignmentEvaluation({
        variables: { id: assignment.id, targetUser: targetUserId, input: evaluation },
      });
      if (!inPlace) history.push(`/evaluations/completed`);
      this.setState({ submitting: false, dirty: false });
    }
  };

  render() {
    const { assignment, classes, self, inPlace } = this.props;
    const { evaluation, dirty, submitting } = this.state;

    const chartData = [evaluation];
    if (self !== true) {
      const { selfEvaluation } = assignment;
      if (selfEvaluation) chartData.push(selfEvaluation);
    }

    console.log('chartData', chartData);

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            {[
              'Propuesta Conceptual',
              'Proceso',
              assignment.evaluationVariable || 'Variable',
              'Producto',
              'Comunicación',
            ].map((title, i) => (
              <p>
                {i + 1}. {title} ({evaluation[`score${i + 1}`]})
                <Slider
                  className={classes.slider}
                  value={evaluation[`score${i + 1}`]}
                  onChange={this.handleChange(`score${i + 1}`)}
                  step={0.5}
                  min={0}
                  max={2}
                />
              </p>
            ))}
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <RadarChart
              data={chartData}
              animation
              domains={[
                { name: 'Propuesta Conceptual', domain: [0, 2], getValue: d => d.score1 },
                { name: 'Comunicación', domain: [0, 2], getValue: d => d.score5 },
                {
                  name: 'Producto',
                  domain: [0, 2],
                  getValue: d => d.score4,
                },
                {
                  name: assignment.evaluationVariable || 'Variable',
                  domain: [0, 2],
                  getValue: d => d.score3,
                },
                { name: 'Proceso', domain: [0, 2], getValue: d => d.score2 },
              ]}
              margin={{ left: 55, right: 55, top: 55, bottom: 55 }}
              width={400}
              height={400}
            >
              <CircularGridLines tickValues={[...new Array(5)].map((v, i) => i / 4 - 1)} />
            </RadarChart>
          </GridItem>
        </GridContainer>
        <CustomInput
          id="observations"
          labelText={self ? 'Reflexiones sobre el trabajo práctico' : 'Observaciones'}
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            multiline: true,
            rows: 4,
            value: evaluation.observations,
            onChange: this.handleChangeObservations,
          }}
        />
        {inPlace ? (
          <CustomButton
            color="primary"
            fullWidth
            onClick={this.handleSubmit}
            disabled={!dirty}
            loading={submitting}
          >
            Guardar {self ? 'autoevaluación' : 'evaluación'}
          </CustomButton>
        ) : (
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <CustomButton
                simple
                color="primary"
                fullWidth
                component={Link}
                to={self ? `/assignments/${assignment.id}` : '/evaluations/pending'}
              >
                Cancelar
              </CustomButton>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <CustomButton color="primary" fullWidth onClick={this.handleSubmit}>
                Completar {self ? 'autoevaluación' : 'evaluación'}
              </CustomButton>
            </GridItem>
          </GridContainer>
        )}
      </div>
    );
  }
}

EvaluationForm.defaultProps = {
  self: false,
  targetUserId: undefined,
  inPlace: false,
};

EvaluationForm.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  assignment: PropTypes.object.isRequired,
  targetUserId: PropTypes.string,
  self: PropTypes.bool,
  inPlace: PropTypes.bool,
};

export default compose(
  graphql(SUBMIT_ASSIGNMENT_EVALUATION, {
    name: 'submitAssignmentEvaluation',
  }),
  graphql(SUBMIT_ASSIGNMENT_SELF_EVALUATION, {
    name: 'submitAssignmentSelfEvaluation',
  }),
  withStyles(styles),
  withRouter,
  withAssignment,
)(EvaluationForm);
