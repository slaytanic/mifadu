import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import withStyles from '@material-ui/core/styles/withStyles';

import CustomTable from 'components/CustomTable/CustomTable';

import Content from 'layouts/Content';

import { studentsFetch } from '../../actions/student';

const styles = {};

class Students extends React.Component {
  componentDidMount() {
    const { dispatchStudentsFetch } = this.props;
    dispatchStudentsFetch();
  }

  render() {
    const { classes, students } = this.props;

    return (
      <Content title="Miembros del taller" subtitle="Todos los miembros del taller">
        <div className={classes.root}>
          <CustomTable
            tableHeaderColor="primary"
            tableHead={[
              { label: 'Nombre', key: 'firstName' },
              { label: 'Apellido', key: 'lastName' },
              { label: 'e-mail', key: 'email' },
            ]}
            tableData={students.all}
          />
        </div>
      </Content>
    );
  }
}

Students.propTypes = {
  classes: PropTypes.object.isRequired,
  students: PropTypes.object.isRequired,
  dispatchStudentsFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  students: state.students,
});

const mapDispatchToProps = dispatch => ({
  dispatchStudentsFetch: () => dispatch(studentsFetch()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withStyles(styles)(Students)),
);
