import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Nouislider from 'react-nouislider';

import withStyles from '@material-ui/core/styles/withStyles';

import CustomInput from 'components/CustomInput/CustomInput';
import ErrorList from 'components/ErrorList/ErrorList';
import Button from 'components/CustomButtons/Button';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';

import { CircularGridLines } from 'react-vis';
import RadarChart from 'components/RadarChart/RadarChart';

import { getUser, getAssignmentWithWorks, submitAssignmentEvaluation } from 'data/service';

const styles = {
  input: {
    display: 'none',
  },
  slider: {
    marginBottom: '3em',
  },
};

class AssignmentSection extends React.Component {
  state = {
    assignment: null,
    errors: [],
    targetUser: null,
    selfEvaluation: {
      score1: 0.0,
      score2: 0.0,
      score3: 0.0,
      score4: 0.0,
      score5: 0.0,
      observations: '',
    },
    evaluation: {
      score1: 0.0,
      score2: 0.0,
      score3: 0.0,
      score4: 0.0,
      score5: 0.0,
      observations: '',
    },
    requiredWork: [],
  };

  componentDidMount() {
    const { match, user } = this.props;

    if (match.params.userId) {
      getUser(match.params.userId).then(userRes => {
        this.setState({ targetUser: userRes.data.data.user }, () => {
          if (match.params.id) {
            getAssignmentWithWorks(match.params.id).then(res => {
              const { assignment } = res.data.data;
              const { targetUser } = this.state;

              const selfEvaluation = assignment.evaluations.find(
                e => e.user.id === targetUser.id && e.targetUser.id === targetUser.id,
              );
              if (selfEvaluation) {
                this.setState({ selfEvaluation });
              }
              const evaluation = assignment.evaluations.find(
                e => e.targetUser.id === targetUser.id && e.user.id === user.id,
              );
              if (evaluation) {
                this.setState({ evaluation });
              }

              const requiredWork = [];
              assignment.requiredWork.forEach(rw => {
                const assignmentWork = rw.assignmentWorks.find(
                  aw => aw.user && aw.user.id === targetUser.id,
                );
                if (assignmentWork) {
                  requiredWork.push({ ...rw, ...assignmentWork });
                }
              });

              this.setState({ assignment, requiredWork });
            });
          }
        });
      });
    }
  }

  handleChange = (name, sub, key, subkey, id) => event => {
    let value;
    if (event.target) {
      ({ value } = event.target);
    } else {
      [value] = event;
    }

    if (id) {
      this.setState(prevState => ({
        [name]: {
          ...prevState[name],
          [sub]: prevState[name][sub].map((item, index) => {
            if (item.id === id) {
              return { ...item, [key]: { ...prevState[name][sub][index][key], [subkey]: value } };
            }
            return item;
          }),
        },
        errors: prevState.errors.filter(error => error.name !== key),
      }));
    } else if (key) {
      this.setState(prevState => ({
        [name]: { ...prevState[name], [sub]: { ...prevState[name][sub], [key]: value } },
        errors: prevState.errors.filter(error => error.name !== key),
      }));
    } else if (sub) {
      this.setState(prevState => ({
        [name]: { ...prevState[name], [sub]: value },
        errors: prevState.errors.filter(error => error.name !== sub),
      }));
    } else {
      this.setState(prevState => ({
        [name]: value,
        errors: prevState.errors.filter(error => error.name !== name),
      }));
    }
  };

  hasError = name => {
    const { errors } = this.state;
    const error = errors.find(e => e.name === name);
    return error || false;
  };

  handleFile = id => event => {
    const file = event.target.files[0];
    if (!(file.type === 'application/pdf' || file.type === 'image/jpeg')) {
      this.setState(prevState => ({
        errors: [
          ...prevState.errors,
          { id: 'attachment', message: 'Formato de archivo incorrecto' },
        ],
      }));
      return;
    }
    this.setState(prevState => ({
      assignment: {
        ...prevState.assignment,
        requiredWork: prevState.assignment.requiredWork.map(rw => {
          if (rw.id === id) {
            return { ...rw, assignmentWork: { ...rw.assignmentWork, attachment: file } };
          }
          return rw;
        }),
      },
      errors: prevState.errors.filter(error => error.name !== 'attachment'),
    }));
  };

  handleSubmit = () => {
    const { history } = this.props;
    const { assignment, evaluation, targetUser } = this.state;

    submitAssignmentEvaluation(assignment.id, {
      evaluation,
      targetUser: targetUser.id,
    }).then(() => {
      history.push(`/assignments/completedEvaluation`);
    });
  };

  acceptFor = type => {
    if (type === 'PDF') {
      return 'application/pdf';
    }

    if (type === 'JPG') {
      return 'image/jpeg';
    }

    return 'application/octet-stream';
  };

  render() {
    const { classes } = this.props;
    const { assignment, errors, targetUser, evaluation, selfEvaluation, requiredWork } = this.state;

    if (!assignment) {
      return <div />;
    }

    return (
      <div className={classes.root}>
        <ErrorList errors={errors} />
        <p>
          <h3>{assignment.name}</h3>
        </p>
        <p>
          <h4>{assignment.shortDescription}</h4>
        </p>
        <p>
          <b>Descripción:</b>
        </p>
        <p>{assignment.description}</p>
        <p>
          <b>Consigna</b>: <a href={assignment.attachment.url}>{assignment.attachment.name}</a>
        </p>
        <p>
          <b>Fecha de entrega:</b> {assignment.endsAt && assignment.endsAt.toString()}
        </p>
        <p>
          <b>Etiquetas:</b> {assignment.tags.map(t => t.name).join(', ')}
        </p>
        {targetUser && (
          <div>
            <p>
              <b>Estudiante:</b> {targetUser.firstName} {targetUser.lastName}
            </p>
            <h6>Componentes de entrega</h6>
            <ul>
              {requiredWork.map(rw => (
                <li>
                  <b>
                    {rw.description} ({rw.type}
                    ):
                  </b>
                  <a href={rw.content.length > 0 ? rw.content : rw.attachment && rw.attachment.url}>
                    Link
                  </a>
                </li>
              ))}
            </ul>
            <h6>Autoevaluación</h6>
            <ol>
              <li>
                Propuesta Conceptual: <b>{selfEvaluation.score1.toFixed(1)}</b>
              </li>
              <li>
                Proceso <b>{selfEvaluation.score2.toFixed(1)}</b>
              </li>
              <li>
                {assignment.evaluationVariable || 'Variable'}{' '}
                <b>{selfEvaluation.score3.toFixed(1)}</b>
              </li>
              <li>
                Producto <b>{selfEvaluation.score4.toFixed(1)}</b>
              </li>
              <li>
                Comunicación <b>{selfEvaluation.score5.toFixed(1)}</b>
              </li>
            </ol>
            <p>
              <b>Reflexiones sobre el trabajo práctico:</b>
            </p>
            <p>{selfEvaluation.observations}</p>
            <h6>Evaluación</h6>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <p className={classes.slider}>
                  1. Propuesta Conceptual
                  <Nouislider
                    start={[evaluation.score1]}
                    connect={[true, false]}
                    step={0.5}
                    range={{ min: 0, max: 2 }}
                    onChange={this.handleChange('evaluation', 'score1')}
                  />
                  {/* {evaluation.score1} */}
                </p>
                <p className={classes.slider}>
                  2. Proceso
                  <Nouislider
                    start={[evaluation.score2]}
                    connect={[true, false]}
                    step={0.5}
                    range={{ min: 0, max: 2 }}
                    onChange={this.handleChange('evaluation', 'score2')}
                  />
                  {/* {evaluation.score2} */}
                </p>
                <p className={classes.slider}>
                  3. {assignment.evaluationVariable || 'Variable'}
                  <Nouislider
                    start={[evaluation.score3]}
                    connect={[true, false]}
                    step={0.5}
                    range={{ min: 0, max: 2 }}
                    onChange={this.handleChange('evaluation', 'score3')}
                  />
                  {/* {evaluation.score3} */}
                </p>
                <p className={classes.slider}>
                  4. Producto
                  <Nouislider
                    start={[evaluation.score4]}
                    connect={[true, false]}
                    step={0.5}
                    range={{ min: 0, max: 2 }}
                    onChange={this.handleChange('evaluation', 'score4')}
                  />
                  {/* {evaluation.score4} */}
                </p>
                <p className={classes.slider}>
                  5. Comunicación
                  <Nouislider
                    start={[evaluation.score5]}
                    connect={[true, false]}
                    step={0.5}
                    range={{ min: 0, max: 2 }}
                    onChange={this.handleChange('evaluation', 'score5')}
                  />
                  {/* {evaluation.score5} */}
                </p>
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <RadarChart
                  data={[selfEvaluation, evaluation]}
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
                value: evaluation.observations,
                onChange: this.handleChange('evaluation', 'observations'),
              }}
              error={this.hasError('observations')}
            />
            <Button onClick={this.handleSubmit} fullWidth>
              Guardar
            </Button>
          </div>
        )}
      </div>
    );
  }
}

AssignmentSection.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AssignmentSection));
