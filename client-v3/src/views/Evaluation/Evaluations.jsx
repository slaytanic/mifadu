import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';

import Info from '@material-ui/icons/Info';

import Button from 'components/material-kit-react/CustomButtons/Button';

import CustomTable from 'components/CustomTable/CustomTable';

import Content from 'layouts/Content';

import { assignmentsFetch } from '../../actions/assignment';

const styles = {};

class Evaluations extends React.Component {
  state = {
    evaluations: [],
    subtitle: '',
  };

  componentDidMount() {
    const { dispatchAssignmentsFetch } = this.props;
    dispatchAssignmentsFetch();
  }

  componentDidUpdate(prevProps) {
    const { assignments, match } = this.props;
    if (
      assignments.loadedAt !== prevProps.assignments.loadedAt ||
      match.params.filter !== prevProps.match.params.filter
    ) {
      this.filterAssignments();
    }
  }

  filterAssignments = () => {
    const { assignments, match } = this.props;
    const evaluations = [];
    switch (match.params.filter) {
      case 'pending':
        assignments.all.forEach(a => {
          a.usersWithoutEvaluations.forEach(u => {
            evaluations.push({
              assignmentId: a.id,
              assignmentName: a.name,
              studentName: u.fullName,
              studentId: u.id,
            });
          });
        });

        this.setState({
          subtitle: 'Pendientes',
        });
        break;
      case 'completed':
        assignments.all.forEach(a => {
          a.usersWithEvaluations.forEach(u => {
            evaluations.push({
              assignmentId: a.id,
              assignmentName: a.name,
              studentName: u.fullName,
              studentId: u.id,
            });
          });
        });

        this.setState({
          subtitle: 'Realizadas',
        });
        break;
      default:
        this.setState({
          subtitle: 'Todas las evaluaciones',
        });
    }
    this.setState({ evaluations });
  };

  render() {
    const { classes } = this.props;
    const { evaluations, subtitle } = this.state;

    return (
      <Content title="Evaluaciones" subtitle={subtitle}>
        <div className={classes.root}>
          <CustomTable
            tableHeaderColor="primary"
            tableHead={[
              { label: 'Trabajo Práctico', key: 'assignmentName' },
              { label: 'Alumno', key: 'studentName' },
            ]}
            tableData={evaluations.map(e => ({
              ...e,
              actions: [
                (index, prop) => (
                  <Button
                    color="transparent"
                    component={Link}
                    to={`/evaluations/${prop.assignmentId}/${prop.studentId}`}
                  >
                    <Info />
                  </Button>
                ),
              ],
            }))}
          />
        </div>
      </Content>
    );
  }
}

Evaluations.propTypes = {
  classes: PropTypes.object.isRequired,
  assignments: PropTypes.object.isRequired,
  dispatchAssignmentsFetch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  assignments: state.assignments,
});

const mapDispatchToProps = dispatch => ({
  dispatchAssignmentsFetch: () => dispatch(assignmentsFetch()),
});

// export default withRouter(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps,
//   )(withStyles(styles)(Evaluations)),
// );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Evaluations));
