import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CircularGridLines } from 'react-vis';
import Nouislider from 'react-nouislider';
import { push } from 'connected-react-router';

import withStyles from '@material-ui/core/styles/withStyles';

import Button from 'components/material-kit-react/CustomButtons/Button';
import CustomInput from 'components/material-kit-react/CustomInput/CustomInput';
import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';

import RadarChart from 'components/RadarChart/RadarChart';

import { assignmentFetch, assignmentSelfEvaluationSubmit } from 'actions/assignment';

const styles = {
  slider: {
    marginBottom: '3em',
  },
};

class EvaluationForm extends Component {
  constructor(props) {
    super(props);

    const { selfEvaluation } = props.assignment;
    if (selfEvaluation && props.self === true) {
      this.state = {
        evaluation: {
          score1: selfEvaluation.score1 || 0,
          score2: selfEvaluation.score2 || 0,
          score3: selfEvaluation.score3 || 0,
          score4: selfEvaluation.score4 || 0,
          score5: selfEvaluation.score5 || 0,
          observations: selfEvaluation.observations || '',
        },
      };
    } else {
      this.state = {
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

  handleChange = name => event => {
    if (event.target) {
      const { value } = event.target;
      this.setState(prevState => ({
        evaluation: { ...prevState.evaluation, [name]: value },
      }));
    } else {
      this.setState(prevState => ({
        evaluation: { ...prevState.evaluation, [name]: parseFloat(event[0]) },
      }));
    }
  };

  handleSubmit = () => {
    const { assignment, historyPush, dispatchAssignmentSelfEvaluationSubmit, self } = this.props;
    const { evaluation } = this.state;

    if (self) {
      dispatchAssignmentSelfEvaluationSubmit(assignment.id, evaluation).then(() => {
        historyPush(`/assignments/${assignment.id}`);
      });
    }
  };

  render() {
    const { assignment, classes, dispatchAssignmentSelfEvaluationSubmit, historyPush } = this.props;
    const { evaluation } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <p className={classes.slider}>
              1. Propuesta Conceptual
              <Nouislider
                name="score1"
                start={[evaluation.score1]}
                connect={[true, false]}
                step={0.5}
                range={{ min: 0, max: 2 }}
                onChange={this.handleChange('score1')}
              />
            </p>
            <p className={classes.slider}>
              2. Proceso
              <Nouislider
                start={[evaluation.score2]}
                connect={[true, false]}
                step={0.5}
                range={{ min: 0, max: 2 }}
                onChange={this.handleChange('score2')}
              />
            </p>
            <p className={classes.slider}>
              3. {assignment.evaluationVariable || 'Variable'}
              <Nouislider
                start={[evaluation.score3]}
                connect={[true, false]}
                step={0.5}
                range={{ min: 0, max: 2 }}
                onChange={this.handleChange('score3')}
              />
            </p>
            <p className={classes.slider}>
              4. Producto
              <Nouislider
                start={[evaluation.score4]}
                connect={[true, false]}
                step={0.5}
                range={{ min: 0, max: 2 }}
                onChange={this.handleChange('score4')}
              />
            </p>
            <p className={classes.slider}>
              5. Comunicación
              <Nouislider
                start={[evaluation.score5]}
                connect={[true, false]}
                step={0.5}
                range={{ min: 0, max: 2 }}
                onChange={this.handleChange('score5')}
              />
            </p>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <RadarChart
              data={[evaluation]}
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
          labelText="Reflexiones sobre el trabajo práctico"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            multiline: true,
            rows: 4,
            value: evaluation.observations,
            onChange: this.handleChange('observations'),
          }}
        />
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <Button
              simple
              color="primary"
              fullWidth
              component={Link}
              to={`/assignments/${assignment.id}`}
            >
              Cancelar
            </Button>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Button color="primary" fullWidth onClick={this.handleSubmit}>
              Completar autoevaluación
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

EvaluationForm.defaultProps = {
  self: false,
};

EvaluationForm.propTypes = {
  currentUser: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  dispatchAssignmentFetch: PropTypes.func.isRequired,
  dispatchAssignmentWorkSubmit: PropTypes.func.isRequired,
  assignment: PropTypes.object.isRequired,
  self: PropTypes.boolean,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  assignments: state.assignments,
});

const mapDispatchToProps = dispatch => ({
  dispatchAssignmentFetch: id => dispatch(assignmentFetch(id)),
  dispatchAssignmentSelfEvaluationSubmit: (id, input) =>
    dispatch(assignmentSelfEvaluationSubmit(id, input)),
  historyPush: path => {
    dispatch(push(path));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(EvaluationForm));
