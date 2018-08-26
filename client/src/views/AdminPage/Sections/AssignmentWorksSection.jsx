import React from 'react';
// import { Switch, Route } from 'react-router-dom';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';

import Info from '@material-ui/icons/Info';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

import CustomTable from 'components/CustomTable/CustomTable';
import Button from 'components/CustomButtons/Button';
import Modal from 'components/Modal/Modal';

import {
  getPendingEvaluationAssignments,
  getCompletedEvaluationAssignments,
  deleteAssignment,
} from 'data/service';

const styles = {};

class AssignmentsSection extends React.Component {
  propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    assignments: [],
    assignmentWorks: [],
    modal: false,
    selectedAssignmentId: '',
  };

  componentDidMount() {
    this.getAssignments();
  }

  getAssignments = () => {
    const { match } = this.props;
    if (match.params.action === 'completedEvaluation') {
      getCompletedEvaluationAssignments().then(res => {
        this.setState({ assignments: res.data.data.completedEvaluationAssignments }, () => {
          this.populateAssignmentWorks();
        });
      });
    } else if (match.params.action === 'pendingEvaluation') {
      getPendingEvaluationAssignments().then(res => {
        this.setState({ assignments: res.data.data.pendingEvaluationAssignments }, () => {
          this.populateAssignmentWorks();
        });
      });
    }
  };

  populateAssignmentWorks = () => {
    const { assignments } = this.state;
    const assignmentWorks = [];
    assignments.forEach(a => {
      const students = new Set();
      a.requiredWork.forEach(rw => {
        rw.assignmentWorks.forEach(aw => {
          if (aw.user) {
            students.add(`${aw.user.firstName} ${aw.user.lastName}`);
          }
        });
      });
      students.forEach(s => {
        assignmentWorks.push({
          assignmentName: a.name,
          studentName: s,
        });
      });
    });
    this.setState({ assignmentWorks });
  };

  handleDelete = key => () => {
    this.setState({ modal: true, selectedAssignmentId: key });
  };

  deleteAssignment = () => {
    const { selectedAssignmentId, assignments } = this.state;
    deleteAssignment(selectedAssignmentId).then(() => {
      this.setState({
        modal: false,
        assignments: assignments.filter(u => u.id !== selectedAssignmentId),
      });
    });
  };

  render() {
    const { classes } = this.props;
    const { assignmentWorks, modal } = this.state;

    return (
      <div className={classes.root}>
        <Modal
          open={modal}
          titleText="Borrar Trabajo Práctico"
          bodyText="Está seguro que desea borrar el trabajo práctico?"
          cancelText="Cancelar"
          handleOk={this.deleteAssignment}
          handleCancel={() => this.setState({ modal: false })}
        />
        <CustomTable
          tableHeaderColor="primary"
          tableHead={[
            { label: 'Trabajo Práctico', key: 'assignmentName' },
            { label: 'Estudiante', key: 'studentName' },
          ]}
          tableData={assignmentWorks}
          actions={[
            key => (
              <Button color="transparent" component={Link} to={`/assignments/${key}/submit`}>
                <Info />
              </Button>
            ),
            key => (
              <Button color="transparent" component={Link} to={`/assignments/${key}`}>
                <Info />
              </Button>
            ),
            key => (
              <Button color="transparent" component={Link} to={`/assignments/${key}/edit`}>
                <Edit />
              </Button>
            ),
            key => (
              <Button color="transparent" onClick={this.handleDelete(key)}>
                <Delete />
              </Button>
            ),
          ]}
        />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(AssignmentsSection));
