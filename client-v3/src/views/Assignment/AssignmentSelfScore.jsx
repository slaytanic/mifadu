import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CircularGridLines } from 'react-vis';
import Nouislider from 'react-nouislider';

import withStyles from '@material-ui/core/styles/withStyles';

import Button from 'components/material-kit-react/CustomButtons/Button';
import CustomInput from 'components/material-kit-react/CustomInput/CustomInput';
import GridContainer from 'components/material-kit-react/Grid/GridContainer';
import GridItem from 'components/material-kit-react/Grid/GridItem';
// import Badge from 'components/material-kit-react/Badge/Badge';

// import Modal from 'components/Modal/Modal';
// import Autocomplete from 'components/Autocomplete/Autocomplete';
// import { RadarChart, CircularGridLines } from 'react-vis';
import RadarChart from 'components/RadarChart/RadarChart';

import Content from 'layouts/Content';

import { assignmentFetch, assignmentWorkSubmit } from 'actions/assignment';

const styles = {
  slider: {
    marginBottom: '3em',
  },
};

class Assignment extends Component {
  componentDidMount() {
    const { dispatchAssignmentFetch, match } = this.props;
    dispatchAssignmentFetch(match.params.id);
  }

  render() {
    const { currentUser, assignments, match, classes } = this.props;

    const assignment = assignments.all.find(a => a.id === match.params.id);

    return (
      <Content title="Trabajos prácticos" subtitle="Autoevaluación">
        {assignment && (
          <div>
            <h3>{assignment.name}</h3>
            <h4>{assignment.shortDescription}</h4>
            <p>{assignment.description}</p>
            <h6>Autoevaluación</h6>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <p className={classes.slider}>
                  1. Propuesta Conceptual
                  <Nouislider
                    start={[0]}
                    // start={[assignment.evaluation.score1]}
                    connect={[true, false]}
                    step={0.5}
                    range={{ min: 0, max: 2 }}
                    // onChange={this.handleChange('assignment', 'evaluation', 'score1')}
                  />
                  {/* {assignment.evaluation.score1} */}
                </p>
                <p className={classes.slider}>
                  2. Proceso
                  <Nouislider
                    start={[0]}
                    // start={[assignment.evaluation.score2]}
                    connect={[true, false]}
                    step={0.5}
                    range={{ min: 0, max: 2 }}
                    // onChange={this.handleChange('assignment', 'evaluation', 'score2')}
                  />
                  {/* {assignment.evaluation.score2} */}
                </p>
                <p className={classes.slider}>
                  3. {assignment.evaluationVariable || 'Variable'}
                  <Nouislider
                    start={[0]}
                    // start={[assignment.evaluation.score3]}
                    connect={[true, false]}
                    step={0.5}
                    range={{ min: 0, max: 2 }}
                    // onChange={this.handleChange('assignment', 'evaluation', 'score3')}
                  />
                  {/* {assignment.evaluation.score3} */}
                </p>
                <p className={classes.slider}>
                  4. Producto
                  <Nouislider
                    start={[0]}
                    // start={[assignment.evaluation.score4]}
                    connect={[true, false]}
                    step={0.5}
                    range={{ min: 0, max: 2 }}
                    // onChange={this.handleChange('assignment', 'evaluation', 'score4')}
                  />
                  {/* {assignment.evaluation.score4} */}
                </p>
                <p className={classes.slider}>
                  5. Comunicación
                  <Nouislider
                    start={[0]}
                    // start={[assignment.evaluation.score5]}
                    connect={[true, false]}
                    step={0.5}
                    range={{ min: 0, max: 2 }}
                    // onChange={this.handleChange('assignment', 'evaluation', 'score5')}
                  />
                  {/* {assignment.evaluation.score5} */}
                </p>
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <RadarChart
                  // data={[assignment.evaluation]}
                  data={[]}
                  // tickFormat={t => wideFormat(t)}
                  // startingAngle={0}
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
                // value: assignment.evaluation.observations,
                // onChange: this.handleChange('assignment', 'evaluation', 'observations'),
              }}
              // error={this.hasError('observations')}
            />
            <Button color="primary" fullWidth component={Link} to={`/assignments/${assignment.id}`}>
              Completar autoevaluación
            </Button>
          </div>
        )}
      </Content>
    );
  }
}

Assignment.propTypes = {
  currentUser: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  dispatchAssignmentFetch: PropTypes.func.isRequired,
  dispatchAssignmentWorkSubmit: PropTypes.func.isRequired,
  assignments: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  assignments: state.assignments,
});

const mapDispatchToProps = dispatch => ({
  dispatchAssignmentFetch: id => dispatch(assignmentFetch(id)),
  dispatchAssignmentWorkSubmit: (id, input) => dispatch(assignmentWorkSubmit(id, input)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Assignment));
