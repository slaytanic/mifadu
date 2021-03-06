import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import withStyles from '@material-ui/core/styles/withStyles';

import CloudUpload from '@material-ui/icons/CloudUpload';
import CloudDownload from '@material-ui/icons/CloudDownload';
import Info from '@material-ui/icons/Info';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

import Button from 'components/material-kit-react/CustomButtons/Button';

import CustomTable from 'components/CustomTable/CustomTable';
import Modal from 'components/Modal/Modal';

import Content from 'layouts/Content';

import { assignmentsFetch, assignmentDelete } from '../../actions/assignment';

const styles = {};

class Assignments extends React.Component {
  state = {
    modal: false,
    selectedAssignmentId: '',
    filteredAssignments: [],
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
    switch (match.params.filter) {
      case 'pending':
        this.setState({
          subtitle: 'Pendientes de entrega',
          filteredAssignments: assignments.all.filter(a => a.statusTags.includes('pending_work')),
        });
        break;
      case 'completed':
        this.setState({
          subtitle: 'Entregados',
          filteredAssignments: assignments.all.filter(a => a.statusTags.includes('completed_work')),
        });
        break;
      case 'pending_evaluation':
        this.setState({
          subtitle: 'Pendientes de evaluación',
          filteredAssignments: assignments.all.filter(a =>
            a.statusTags.includes('pending_evaluation'),
          ),
        });
        break;
      case 'completed_evaluation':
        this.setState({
          subtitle: 'Pendientes de evaluación',
          filteredAssignments: assignments.all.filter(a =>
            a.statusTags.includes('completed_evaluation'),
          ),
        });
        break;
      default:
        this.setState({
          subtitle: 'Todos los trabajos prácticos',
          filteredAssignments: [...assignments.all],
        });
    }
  };

  handleDelete = key => () => {
    this.setState({ modal: true, selectedAssignmentId: key });
  };

  deleteAssignment = () => {
    const { dispatchAssignmentDelete } = this.props;
    const { selectedAssignmentId } = this.state;
    dispatchAssignmentDelete(selectedAssignmentId);
    this.setState({
      modal: false,
    });
  };

  render() {
    const { classes, currentUser } = this.props;
    const { filteredAssignments, subtitle } = this.state;
    const { modal } = this.state;

    const isTutor = currentUser.tutoredWorkshops.length > 0;
    const tableHead = [
      { label: 'Nombre', key: 'name' },
      // { label: 'Descripción', key: 'shortDescription' },
      { label: 'Fecha de entrega', key: 'endsAt' },
      // { label: 'Entregados', key: 'completedWorksCount' },
      // { label: 'Sin entregar', key: '' },
      // { label: 'Sin evaluar', key: 'pendingEvaluationWorksCount' },
      // { label: 'Evaluados', key: 'evaluatedWorksCount' },
    ];
    if (isTutor) {
      tableHead.push({ label: 'Entregados', key: 'completedWorksCount' });
      tableHead.push({ label: 'Sin evaluar', key: 'pendingEvaluationWorksCount' });
      tableHead.push({ label: 'Evaluados', key: 'evaluatedWorksCount' });
    }

    return (
      <Content title="Trabajos prácticos" subtitle={subtitle}>
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
            tableHead={tableHead}
            tableData={filteredAssignments.map(a => ({
              ...Object.keys(a).reduce((obj, key) => {
                switch (key) {
                  default:
                    return { ...obj, [key]: a[key] };
                }
              }, {}),
              actions: a.workshop.tutors.map(t => t.id).includes(currentUser.id)
                ? [
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
                    key => (
                      <Button
                        color="transparent"
                        // component={Link}
                        href={`/assignments/download/${key}`}
                      >
                        <CloudDownload />
                      </Button>
                    ),
                  ]
                : [
                    key => (
                      <Button color="transparent" component={Link} to={`/assignments/${key}`}>
                        <Info />
                      </Button>
                    ),
                    // key => (
                    //   <Button
                    //     color="transparent"
                    //     component={Link}
                    //     to={`/assignments/${key}/submit`}
                    //   >
                    //     <CloudUpload />
                    //   </Button>
                    // ),
                  ],
            }))}
          />
        </div>
      </Content>
    );
  }
}

Assignments.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  assignments: PropTypes.object.isRequired,
  dispatchAssignmentsFetch: PropTypes.func.isRequired,
  dispatchAssignmentDelete: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  assignments: state.assignments,
});

const mapDispatchToProps = dispatch => ({
  dispatchAssignmentsFetch: () => dispatch(assignmentsFetch()),
  dispatchAssignmentDelete: id => dispatch(assignmentDelete(id)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withStyles(styles)(Assignments)),
);
