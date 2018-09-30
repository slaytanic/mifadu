import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import withStyles from '@material-ui/core/styles/withStyles';

import MenuItem from '@material-ui/core/MenuItem';
// import Typography from '@material-ui/core/Typography';
// import FormHelperText from '@material-ui/core/FormHelperText';

import Button from 'components/material-kit-react/CustomButtons/Button';
// import GridContainer from 'components/material-kit-react/Grid/GridContainer';
// import GridItem from 'components/material-kit-react/Grid/GridItem';

import CustomInput from 'components/CustomInput/CustomInput';
import CustomSelect from 'components/CustomSelect/CustomSelect';
import ErrorList from 'components/Error/ErrorList';
import Autocomplete from 'components/Autocomplete/Autocomplete';

import { tagsFetch, tagCreate } from 'actions/tag';
import { assignmentCreate, assignmentUpdate } from 'actions/assignment';

const styles = {
  input: {
    display: 'none',
  },
  subtitle: {
    color: '#999',
  },
  smallInput: {
    width: '200px',
  },
};

class AssignmentForm extends Component {
  componentDidMount() {
    const { dispatchTagsFetch } = this.props;
    dispatchTagsFetch();
  }

  createTag = async name => {
    const { dispatchTagCreate } = this.props;
    return dispatchTagCreate({ name }).then(action => action.payload.id);
  };

  render() {
    const { classes, tags, dispatchAssignmentCreate, dispatchAssignmentUpdate } = this.props;
    // const { assignment, errors, tags, loading } = this.state;
    const assignment = {};
    // const tags = [{ id: '1', name: 'tag' }];
    return (
      <Formik
        initialValues={{
          name: '',
          shortDescription: '',
          description: '',
          endsAt: '',
          type: '',
          evaluationVariable: '',
          tags: [],
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Debe ingresar un nombre para el trabajo practico'),
          endsAt: Yup.string().required('Debe elegir una fecha de entrega'),
          type: Yup.string().required('Debe elegir el tipo de trabajo práctico'),
        })}
        onSubmit={(values, actions) => {
          if (assignment.id) {
            dispatchAssignmentUpdate(assignment.id, values).then(() => {
              actions.setSubmitting(false);
            });
          } else {
            dispatchAssignmentCreate(values).then(() => {
              actions.setSubmitting(false);
            });
          }
        }}
        render={({ values, touched, handleChange, handleBlur, errors, dirty, isSubmitting }) => (
          <Form>
            <ErrorList errors={errors} touched={touched} />
            <CustomInput
              labelText="Nombre del trabajo práctico"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                name: 'name',
                value: values.name,
                onChange: handleChange,
                onBlur: handleBlur,
              }}
              error={!!errors.name && touched.name}
            />
            <CustomInput
              labelText="Descripción corta"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                name: 'shortDescription',
                value: values.shortDescription,
                onChange: handleChange,
                onBlur: handleBlur,
              }}
              error={!!errors.shortDescription && touched.shortDescription}
            />
            <CustomInput
              labelText="Descripción"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                name: 'description',
                multiline: true,
                rows: 4,
                value: values.description,
                onChange: handleChange,
                onBlur: handleBlur,
              }}
              error={!!errors.description && touched.description}
              helperText="No es consigna"
            />
            <CustomInput
              labelText="Fecha de entrega"
              labelProps={{
                shrink: true,
              }}
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                name: 'endsAt',
                type: 'date',
                value: values.endsAt,
                onChange: handleChange,
                onBlur: handleBlur,
              }}
              error={!!errors.endsAt && touched.endsAt}
            />
            <CustomInput
              labelText="Variable de evaluación"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                name: 'evaluationVariable',
                value: values.evaluationVariable,
                onChange: handleChange,
                onBlur: handleBlur,
              }}
              error={!!errors.evaluationVariable && touched.evaluationVariable}
            />
            <CustomSelect
              labelText="Tipo"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                name: 'type',
                value: values.type,
                onChange: handleChange,
                onBlur: handleBlur,
              }}
              error={!!errors.type && touched.type}
            >
              <MenuItem value="Group">Grupal</MenuItem>
              <MenuItem value="Individual">Individual</MenuItem>
            </CustomSelect>
            <Autocomplete
              multi
              creatable
              name="tags"
              placeholder="Seleccione o escriba"
              labelText="Categorías / Etiquetas"
              handleCreate={this.createTag}
              onChange={handleChange}
              onBlue={handleBlur}
              value={values.tags}
              suggestions={tags.all.map(tag => ({
                label: tag.name,
                value: tag.id,
              }))}
            />
            <Button
              color="primary"
              type="submit"
              fullWidth
              disabled={!dirty || isSubmitting || !!Object.keys(errors).length}
            >
              {assignment.id ? 'Guardar cambios' : 'Dar de alta'}
            </Button>
          </Form>
        )}
      />

      // <div className={classes.root}>
      //   <ErrorList errors={errors} />
      //   <GridContainer>
      //     <GridItem xs={12} sm={12} md={12}>
      // />
      //     </GridItem>
      //     <GridItem xs={12} sm={12} md={8}>
      //       <CustomInput
      //         id="short-description"
      //         labelText="Descripción corta"
      //         formControlProps={{
      //           fullWidth: true,
      //         }}
      //         inputProps={{
      //           value: assignment.shortDescription,
      //           onChange: this.handleChange('assignment', 'shortDescription'),
      //           // endAdornment: !this.hasError('shortDescription') && (
      //           //   <InputAdornment position="end">
      //           //     <PermIdentity className={classes.inputIconsColor} />
      //           //   </InputAdornment>
      //           // ),
      //         }}
      //         error={this.hasError('shortDescription')}
      //       />
      //       <CustomInput
      //         id="description"
      //         labelText="Descripción"
      //         formControlProps={{
      //           fullWidth: true,
      //         }}
      //         inputProps={{
      //           multiline: true,
      //           rows: 4,
      //           value: assignment.description,
      //           onChange: this.handleChange('assignment', 'description'),
      //           // endAdornment: !this.hasError('description') && (
      //           //   <InputAdornment position="end">
      //           //     {/* <PermIdentity className={classes.inputIconsColor} /> */}
      //           //   </InputAdornment>
      //           // ),
      //         }}
      //         error={this.hasError('description')}
      //         helperText="No es consigna"
      //       />
      //     </GridItem>
      //     <GridItem xs={12} sm={12} md={4}>
      //       <CustomInput
      //         id="ends-at"
      //         labelText="Fecha de entrega"
      //         formControlProps={{
      //           fullWidth: true,
      //         }}
      //         labelProps={{
      //           shrink: true,
      //         }}
      //         inputProps={{
      //           value: assignment.endsAt,
      //           onChange: this.handleChange('assignment', 'endsAt'),
      //           type: 'date',
      //           // endAdornment: !this.hasError('shortDescription') && (
      //           //   <InputAdornment position="end">
      //           //     <PermIdentity className={classes.inputIconsColor} />
      //           //   </InputAdornment>
      //           // ),
      //         }}
      //         error={this.hasError('endsAt')}
      //       />

      //       <CustomInput
      //         id="evaluation-variable"
      //         labelText="Variable de evaluación"
      //         formControlProps={{
      //           fullWidth: true,
      //         }}
      //         inputProps={{
      //           value: assignment.evaluationVariable,
      //           onChange: this.handleChange('assignment', 'evaluationVariable'),
      //           // endAdornment: !this.hasError('evaluationVariable') && (
      //           //   <InputAdornment position="end">
      //           //     <PermIdentity className={classes.inputIconsColor} />
      //           //   </InputAdornment>
      //           // ),
      //         }}
      //         error={this.hasError('evaluationVariable')}
      //       />
      //       <CustomSelect
      //         id="type"
      //         labelText="Tipo"
      //         formControlProps={{
      //           fullWidth: true,
      //         }}
      //         inputProps={{
      //           value: assignment.type,
      //           onChange: this.handleChange('assignment', 'type'),
      //         }}
      //         error={this.hasError('type')}
      //       >
      //         <MenuItem value="Group">Grupal</MenuItem>
      //         <MenuItem value="Individual">Individual</MenuItem>
      //       </CustomSelect>
      //     </GridItem>
      //   </GridContainer>

      //   <GridContainer>
      //     <GridItem xs={12} sm={12} md={4}>
      //       <label htmlFor="attachment">
      //         <input
      //           accept="application/pdf"
      //           className={classes.input}
      //           id="attachment"
      //           multiple
      //           type="file"
      //           onChange={this.handleFile}
      //         />
      //         <Button component="span" fullWidth>
      //           Subir consigna
      //         </Button>
      //       </label>
      //     </GridItem>
      //     <GridItem xs={12} sm={12} md={4}>
      //       <FormHelperText>La consigna debe estar en formato PDF</FormHelperText>
      //       {assignment.attachment && (
      //         <Typography>
      //           {assignment.attachment.url ? (
      //             <a href={assignment.attachment.url}>{assignment.attachment.name}</a>
      //           ) : (
      //             assignment.attachment.name
      //           )}
      //         </Typography>
      //       )}
      //     </GridItem>
      //   </GridContainer>

      //   <h6 className={classes.subtitle}>Componentes de la entrega</h6>
      //   {assignment.requiredWork.map((requiredWork, index) => (
      //     <div>
      //       <CustomInput
      //         id={`required-work-type-${index}`}
      //         labelText="Descripción"
      //         formControlProps={{
      //           fullWidth: true,
      //         }}
      //         inputProps={{
      //           value: assignment.requiredWork[index].description,
      //           onChange: this.handleChange('assignment', 'requiredWork', 'description', index),
      //         }}
      //         // error={this.hasError('type')}
      //       />
      //       <GridContainer>
      //         <GridItem xs={12} sm={12} md={8}>
      //           <CustomSelect
      //             id={`required-work-type-${index}`}
      //             labelText="Tipo"
      //             formControlProps={{
      //               fullWidth: false,
      //               className: classes.smallInput,
      //             }}
      //             inputProps={{
      //               value: assignment.requiredWork[index].type,
      //               onChange: this.handleChange('assignment', 'requiredWork', 'type', index),
      //             }}
      //             // error={this.hasError('type', index)}
      //           >
      //             <MenuItem value="PDF">PDF</MenuItem>
      //             <MenuItem value="JPG">JPEG</MenuItem>
      //             <MenuItem value="Video">Video</MenuItem>
      //             <MenuItem value="URL">URL</MenuItem>
      //           </CustomSelect>
      //         </GridItem>
      //         <GridItem xs={12} sm={12} md={4}>
      //           <Button onClick={this.handleRemoveRequiredWork(index)} color="danger" fullWidth>
      //             Quitar componente
      //           </Button>
      //         </GridItem>
      //       </GridContainer>
      //     </div>
      //   ))}
      //   <Button onClick={this.handleAddRequiredWork} color="info" fullWidth>
      //     Agregar componente
      //   </Button>

      //   <Autocomplete
      //     placeholder="Categorías / Etiquetas"
      //     handleChange={this.handleChange('assignment', 'tags')}
      //     value={assignment.tags}
      //     suggestions={tags.map(tag => ({
      //       label: tag.name,
      //       value: tag.id,
      //     }))}
      //   />

      //   <Button
      //     // variant="contained"
      //     color="primary"
      //     // className={classes.button}
      //     onClick={this.handleSubmit}
      //     fullWidth
      //     loading={loading}
      //   >
      //     {assignment.id ? 'Guardar cambios' : 'Dar de alta'}
      //   </Button>
      // </div>
    );
  }
}

AssignmentForm.propTypes = {
  classes: PropTypes.object.isRequired,
  tags: PropTypes.object.isRequired,
  dispatchTagsFetch: PropTypes.func.isRequired,
  dispatchTagCreate: PropTypes.func.isRequired,
  dispatchAssignmentCreate: PropTypes.func.isRequired,
  dispatchAssignmentUpdate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  tags: state.tags,
});

const mapDispatchToProps = dispatch => ({
  dispatchTagsFetch: () => dispatch(tagsFetch()),
  dispatchTagCreate: input => dispatch(tagCreate(input)),
  dispatchAssignmentCreate: input => dispatch(assignmentCreate(input)),
  dispatchAssignmentUpdate: (id, input) => dispatch(assignmentUpdate(id, input)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(AssignmentForm));