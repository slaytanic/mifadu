import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

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

import { getTags, createAssignment } from 'data/service';

const styles = {
  input: {
    display: 'none',
  },
};

class AssignmentWorkForm extends React.Component {
  state = {
    assignment: { name: '', shortDescription: '', description: '', endsAt: new Date(), tags: [] },
    errors: [],
  };

  componentDidMount() {
    console.log(this.props);
  }

  handleChange = (name, sub) => event => {
    const { value } = event.target;

    if (sub) {
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

  handleFile = event => {
    const file = event.target.files[0];
    if (file.type !== 'application/pdf') {
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
    createAssignment(assignment).then(res => {
      history.push(`/assignments/${res.data.data.createAssignment.id}`);
    });
  };

  render() {
    const { classes } = this.props;
    const { assignment, errors, tags } = this.state;
    return (
      <div className={classes.root}>
        <ErrorList errors={errors} />
        <CustomInput
          id="name"
          labelText="Nombre del trabajo práctico"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            value: assignment.name,
            onChange: this.handleChange('assignment', 'name'),
            // endAdornment: !this.hasError('name') && (
            //   <InputAdornment position="end">
            //     <PermIdentity className={classes.inputIconsColor} />
            //   </InputAdornment>
            // ),
          }}
          error={this.hasError('name')}
        />
        <CustomInput
          id="short-description"
          labelText="Descripción corta"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            value: assignment.shortDescription,
            onChange: this.handleChange('assignment', 'shortDescription'),
            // endAdornment: !this.hasError('shortDescription') && (
            //   <InputAdornment position="end">
            //     <PermIdentity className={classes.inputIconsColor} />
            //   </InputAdornment>
            // ),
          }}
          error={this.hasError('shortDescription')}
        />

        <CustomInput
          id="description"
          labelText="Descripción"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            multiline: true,
            rows: 4,
            value: assignment.description,
            onChange: this.handleChange('assignment', 'description'),
            // endAdornment: !this.hasError('description') && (
            //   <InputAdornment position="end">
            //     {/* <PermIdentity className={classes.inputIconsColor} /> */}
            //   </InputAdornment>
            // ),
          }}
          error={this.hasError('description')}
          helperText="No es consigna"
        />

        <CustomInput
          id="ends-at"
          labelText="Fecha de entrega"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            value: assignment.endsAt,
            onChange: this.handleChange('assignment', 'endsAt'),
            type: 'date',
            // endAdornment: !this.hasError('shortDescription') && (
            //   <InputAdornment position="end">
            //     <PermIdentity className={classes.inputIconsColor} />
            //   </InputAdornment>
            // ),
          }}
          error={this.hasError('endsAt')}
        />
        <CustomSelect
          id="type"
          labelText="Tipo"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            value: assignment.type,
            onChange: this.handleChange('assignment', 'type'),
          }}
          error={this.hasError('type')}
        >
          <MenuItem value="Group">Grupal</MenuItem>
          <MenuItem value="Individual">Individual</MenuItem>
        </CustomSelect>

        <label htmlFor="attachment">
          <input
            accept="application/pdf"
            className={classes.input}
            id="attachment"
            multiple
            type="file"
            onChange={this.handleFile}
          />
          <Button component="span">Subir consigna</Button>
        </label>
        <FormHelperText>Formato PDF</FormHelperText>
        {assignment.attachment && <Typography>{assignment.attachment.name}</Typography>}

        <Autocomplete
          placeholder="Categorías / Etiquetas"
          onSelect={this.handleChange('assignment', 'tags')}
          suggestions={tags.map(tag => ({
            label: tag.name,
            value: tag.id,
          }))}
        />

        <Button
          // variant="contained"
          // color="primary"
          // className={classes.button}
          onClick={this.handleSubmit}
        >
          Dar de alta
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
