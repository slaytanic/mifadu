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

class AssignmentSection extends React.Component {
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
          assignment.evaluation = {
            score1: 0.0,
            score2: 0.0,
            score3: 0.0,
            score4: 0.0,
            score5: 0.0,
            observations: '',
          };
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

  handleChange = (name, sub, key, subkey, id) => event => {
    let value;
    if (event.target) {
      value = event.target.value;
    } else {
      value = event[0];
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
    const { assignment } = this.state;

    submitAssignmentWork(assignment.id, {
      evaluation: assignment.evaluation,
      assignmentWork: assignment.requiredWork.map(rw => ({
        requiredWorkId: rw.id,
        content: rw.assignmentWork.content,
        attachment: rw.assignmentWork.attachment,
      })),
    }).then(res => {
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
          <b>Consigna</b>: <a href={assignment.attachment.url}>{assignment.attachment.name}</a>
        </p>
        <p>
          <b>Fecha de entrega:</b> {assignment.endsAt && assignment.endsAt.toString()}
        </p>
        <p>
          <b>Etiquetas:</b> {assignment.tags.map(t => t.name).join(', ')}
        </p>
      </div>
    );
  }
}

AssignmentSection.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AssignmentSection));
