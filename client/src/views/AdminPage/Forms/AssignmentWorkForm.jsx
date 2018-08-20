import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Nouislider from 'react-nouislider';

import withStyles from '@material-ui/core/styles/withStyles';

// import InputAdornment from '@material-ui/core/InputAdornment';
// import FormControl from '@material-ui/core/FormControl';
// import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
// import Button from '@material-ui/core/Button';

import CustomInput from 'components/CustomInput/CustomInput';
import CustomSelect from 'components/CustomSelect/CustomSelect';
import ErrorList from 'components/ErrorList/ErrorList';
import Button from 'components/CustomButtons/Button';
import Autocomplete from 'components/Autocomplete/Autocomplete';

import { getAssignment, submitAssignmentWork } from 'data/service';

const styles = {
  input: {
    display: 'none',
  },
};

class AssignmentWorkForm extends React.Component {
  state = {
    assignment: null,
    errors: [],
  };

  componentDidMount() {
    const { match } = this.props;
    if (match.params.id) {
      getAssignment(match.params.id).then(res => {
        const { assignment } = res.data.data;
        if (!assignment.evaluation) {
          assignment.evaluation = { score1: 1, score2: 1, score3: 1, score4: 1, score5: 1 };
        }
        assignment.requiredWork = assignment.requiredWork.map(rw => {
          if (rw.assignmentWork) {
            return rw;
          }
          return { ...rw, assignmentWork: { content: '', attachment: null } };
        });
        this.setState({ assignment });
      });
    }
  }

  handleChange = (name, sub, key, id) => event => {
    let value;
    if (event.target) {
      value = event.target.value;
    } else {
      value = parseInt(event[0]);
    }

    if (id) {
      this.setState(prevState => ({
        [name]: { ...prevState[name], [sub]: { ...prevState[name][sub], [key]: value } },
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
      assignment: { ...prevState.assignment, attachment: file },
      errors: prevState.errors.filter(error => error.name !== 'attachment'),
    }));
  };

  handleSubmit = () => {
    const { history } = this.props;
    const { assignment } = this.state;

    submitAssignmentWork(assignment.id, { evaluation: assignment.evaluation }).then(res => {
      history.push(`/assignments/complete`);
    });
  };

  acceptFor = type => {
    if (type === 'PDF') {
      return 'application/pdf';
    }

    if (type === 'JPG') {
      return 'image/jpeg';
    }
  };

  render() {
    const { classes } = this.props;
    const { assignment, errors } = this.state;

    console.log(assignment);

    if (!assignment) {
      return <div />;
    }

    return (
      <div className={classes.root}>
        <ErrorList errors={errors} />
        <p>
          <b>Nombre:</b> {assignment.name}
        </p>
        <p>
          <b>Descripción corta</b>: {assignment.shortDescription}
        </p>
        <p>
          <b>Descripción:</b>
        </p>
        <p>{assignment.description}</p>
        <p>
          <b>Fecha de entrega:</b> {assignment.endsAt && assignment.endsAt.toString()}
        </p>
        <p>
          <b>Etiquetas:</b> {assignment.tags.map(t => t.name).join(', ')}
        </p>
        <h6>Componentes de entrega</h6>
        {assignment.requiredWork && assignment.requiredWork.length > 0 ? (
          assignment.requiredWork.map(rw => (
            <p>
              {rw.description} ({rw.type})
              {['URL', 'Video'].includes(rw.type) && (
                <CustomInput
                  id={`required-work-content-${rw.id}`}
                  labelText="URL"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    value: rw.assignmentWork.content,
                    onChange: this.handleChange('assignment', 'assignmentWork', 'content', rw.id),
                  }}
                  error={this.hasError('evaluationVariable')}
                />
              )}
              {['PDF', 'JPG'].includes(rw.type) && (
                <label htmlFor="attachment">
                  <input
                    accept={this.acceptFor(rw.type)}
                    className={classes.input}
                    id="attachment"
                    multiple
                    type="file"
                    onChange={this.handleFile(rw.id)}
                  />
                  <Button component="span">Subir componente</Button>
                </label>
              )}
            </p>
          ))
        ) : (
          <p>Este trabajo práctico no tiene componentes de entrega</p>
        )}
        <h6>Autoevaluación</h6>
        <p>
          Cosa 1
          <Nouislider
            start={[assignment.evaluation.score1]}
            connect={[true, false]}
            step={1}
            range={{ min: 1, max: 5 }}
            onChange={this.handleChange('assignment', 'evaluation', 'score1')}
          />
          {assignment.evaluation.score1}
        </p>
        <p>
          Cosa 2
          <Nouislider
            start={[assignment.evaluation.score2]}
            connect={[true, false]}
            step={1}
            range={{ min: 1, max: 5 }}
            onChange={this.handleChange('assignment', 'evaluation', 'score2')}
          />
          {assignment.evaluation.score2}
        </p>
        <p>
          Cosa 3
          <Nouislider
            start={[assignment.evaluation.score3]}
            connect={[true, false]}
            step={1}
            range={{ min: 1, max: 5 }}
            onChange={this.handleChange('assignment', 'evaluation', 'score3')}
          />
          {assignment.evaluation.score3}
        </p>
        <p>
          Cosa 4
          <Nouislider
            start={[assignment.evaluation.score4]}
            connect={[true, false]}
            step={1}
            range={{ min: 1, max: 5 }}
            onChange={this.handleChange('assignment', 'evaluation', 'score4')}
          />
          {assignment.evaluation.score4}
        </p>
        <p>
          {assignment.evaluationVariable || 'Variable'}
          <Nouislider
            start={[assignment.evaluation.score5]}
            connect={[true, false]}
            step={1}
            range={{ min: 1, max: 5 }}
            onChange={this.handleChange('assignment', 'evaluation', 'score5')}
          />
          {assignment.evaluation.score5}
        </p>
        <Button
          // variant="contained"
          color="primary"
          // className={classes.button}
          onClick={this.handleSubmit}
          fullWidth
        >
          Guardar
        </Button>
      </div>
    );
  }
}

AssignmentWorkForm.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AssignmentWorkForm));
