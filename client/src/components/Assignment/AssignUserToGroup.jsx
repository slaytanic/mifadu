import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import { Formik } from 'formik';
import * as Yup from 'yup';

import CircularProgress from '@material-ui/core/CircularProgress';

import CustomInput from 'components/CustomInput/CustomInput';

import ASSIGNMENT from 'queries/assignment';
import ASSIGN_USER_TO_GROUP from 'mutations/assign-user-to-group';

const AssignUserToGroup = ({ assignmentId }) => {
  return (
    <Mutation mutation={ASSIGN_USER_TO_GROUP}>
      {assignUserToGroup => (
        <Query query={ASSIGNMENT} variables={{ id: assignmentId }}>
          {({ loading, error, data }) => {
            if (loading) return <CircularProgress />;
            if (error) return <span>Error</span>;
            if (data.assignment) {
              return (
                <Formik
                  initialValues={{
                    number: data.assignment.myGroup ? data.assignment.myGroup.number : '',
                  }}
                  validationSchema={Yup.object().shape({
                    number: Yup.number().required(
                      'Debe ingresar un número de grupo y este debe ser un número',
                    ),
                  })}
                >
                  {({
                    values,
                    touched,
                    error,
                    errors,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    dirty,
                  }) => {
                    return (
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
                    );
                  }}
                </Formik>
              );
            }
          }}
        </Query>
      )}
    </Mutation>
  );
};

AssignUserToGroup.propTypes = {
  assignmentId: PropTypes.string.isRequired,
};

// export default withStyles(styles)(AssignUserToGroup);
export default AssignUserToGroup;
