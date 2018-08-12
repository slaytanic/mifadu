import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import GridContainer from './Grid/GridContainer';
import GridItem from './Grid/GridItem';

import ErrorList from './ErrorList';
import Autocomplete from './Autocomplete';

import { createAssignment, getTags } from '../data/service';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  doubleWidthField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400 + theme.spacing.unit * 2,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  navLink: {
    textDecoration: 'none',
    color: 'unset',
  },
  input: {
    display: 'none',
  },
});

class AssignmentForm extends Component {
  state = {
    assignment: {},
    errors: [],
    tags: [],
  };

  handleChange = (name, sub) => event => {
    if (sub) {
      this.setState({
        [name]: { ...this.state[name], [sub]: event.target.value },
        errors: this.state.errors.filter(error => error.name !== name),
      });
    } else {
      this.setState({
        [name]: event.target.value,
        errors: this.state.errors.filter(error => error.name !== name),
      });
    }
  };

  handleFile = event => {
    const file = event.target.files[0];
    if (file.type != 'application/pdf') {
      this.setState({
        errors: [
          ...this.state.errors,
          { id: 'attachment', message: 'Formato de archivo incorrecto' },
        ],
      });
      return;
    }
    this.setState({
      assignment: { ...this.state.assignment, attachment: file },
      errors: this.state.errors.filter(error => error.name !== 'attachment'),
    });
    // console.log(file);
  };

  componentDidMount() {
    getTags().then(res => {
      this.setState({ tags: res.data.data.tags });
    });
  }

  handleSubmit = () => {
    console.log(this.state.assignment);
    createAssignment(this.state.assignment).then(res => {});
  };

  render() {
    const { classes } = this.props;

    return (
      // <form className={classes.container} noValidate autoComplete="off">
      <div>
        <GridContainer>
          <GridItem xs="12">
            <ErrorList errors={this.state.errors} />
          </GridItem>
          <GridItem xs="12">
            <TextField
              required
              id="name"
              label="Nombre del trabajo práctico"
              className={classes.doubleWidthField}
              value={this.state.assignment.name}
              onChange={this.handleChange('assignment', 'name')}
              margin="normal"
            />
          </GridItem>
          <GridItem xs="12">
            <TextField
              required
              id="short-description"
              label="Descripción corta"
              className={classes.doubleWidthField}
              value={this.state.assignment.shortDescription}
              onChange={this.handleChange('assignment', 'shortDescription')}
              margin="normal"
            />
          </GridItem>
          <GridItem xs="12">
            <TextField
              required
              id="description"
              label="Descripción"
              multiline
              rows="4"
              className={classes.doubleWidthField}
              value={this.state.assignment.description}
              onChange={this.handleChange('assignment', 'description')}
              margin="normal"
              helperText="No es consigna"
            />
          </GridItem>
          <GridItem xs="12">
            <TextField
              required
              id="ends-at"
              label="Fecha de entrega"
              type="date"
              className={classes.doubleWidthField}
              value={this.state.assignment.endsAt}
              onChange={this.handleChange('assignment', 'endsAt')}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </GridItem>
          <GridItem xs="12">
            <FormControl className={classes.textField}>
              <InputLabel htmlFor="type" shrink={true} required>
                Tipo
              </InputLabel>
              <Select
                value={this.state.assignment.type}
                onChange={this.handleChange('assignment', 'type')}
                inputProps={{
                  name: 'type',
                  id: 'type',
                }}
              >
                <MenuItem value="Group">Grupal</MenuItem>
                <MenuItem value="Individual">Individual</MenuItem>
              </Select>
            </FormControl>
          </GridItem>
          <GridItem xs="12">
            <input
              accept="application/pdf"
              className={classes.input}
              id="attachment"
              multiple
              type="file"
              onChange={this.handleFile}
            />
            <label htmlFor="attachment">
              <Button
                variant="outlined"
                component="span"
                className={classes.button}
              >
                Subir consigna
              </Button>
            </label>
            <FormHelperText>Formato PDF</FormHelperText>
            {this.state.assignment.attachment && (
              <Typography>{this.state.assignment.attachment.name}</Typography>
            )}
          </GridItem>
          <GridItem xs="12">
            <Autocomplete
              placeholder="Categorías / Etiquetas"
              onSelect={this.handleChange('assignment', 'tags')}
              suggestions={this.state.tags.map(tag => ({
                label: tag.name,
                value: tag.id,
              }))}
            />
          </GridItem>
          <GridItem xs="12">
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.handleSubmit}
            >
              Dar de alta
            </Button>
          </GridItem>
        </GridContainer>
        {/* </form> */}
      </div>
    );
  }
}

AssignmentForm.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AssignmentForm));
