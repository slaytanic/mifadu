import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Query, graphql, compose } from 'react-apollo';

import CloudDownload from '@material-ui/icons/CloudDownload';
import Info from '@material-ui/icons/Info';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

import Button from 'components/material-kit-react/CustomButtons/Button';

import CustomTable from 'components/CustomTable/CustomTable';
import Modal from 'components/Modal/Modal';

import Content from 'layouts/Content/Content';

import WORKSHOP_ASSIGNMENTS_QUERY from 'graphql/queries/WorkshopAssignments';
import DELETE_ASSIGNMENT from 'graphql/mutations/DeleteAssignment';

class Assignments extends React.Component {
  state = {
    modal: false,
    selectedAssignmentId: '',
    subtitle: '',
  };

  handleDelete = key => () => {
    this.setState({ modal: true, selectedAssignmentId: key });
  };

  deleteAssignment = async () => {
    const { client } = this.props;
    const { selectedAssignmentId } = this.state;

    const { data } = await client.mutate({
      mutation: DELETE_ASSIGNMENT,
      variables: { id: selectedAssignmentId },
    });
    if (data.deleteAssignment.id === selectedAssignmentId) {
      this.setState({
        modal: false,
        selectedAssignmentId: null,
      });
    }
  };

  render() {
    const { match } = this.props;
    const { modal } = this.state;

    let subtitle = 'Todos los trabajos prácticos';
    switch (match.params.status) {
      case 'pending':
        subtitle = 'Pendientes de entrega';
        break;
      case 'completed':
        subtitle = 'Entregados';
        break;
      default:
        break;
    }

    // const isTutor = me.tutoredWorkshops.length > 0;
    const tableHead = [
      { label: 'Nombre', key: 'name' },
      { label: 'Fecha de entrega', key: 'endsAt' },
    ];
    // if (isTutor) {
    //   tableHead.push({ label: 'Entregados', key: 'completedWorksCount' });
    //   tableHead.push({ label: 'Sin evaluar', key: 'pendingEvaluationWorksCount' });
    //   tableHead.push({ label: 'Evaluados', key: 'evaluatedWorksCount' });
    // }

    return (
      <Content title="Trabajos prácticos" subtitle={subtitle}>
        <div>
          <Modal
            open={modal}
            titleText="Borrar Trabajo Práctico"
            bodyText="Está seguro que desea borrar el trabajo práctico?"
            cancelText="Cancelar"
            handleOk={this.deleteAssignment}
            handleCancel={() => this.setState({ modal: false })}
          />
          <Query
            query={WORKSHOP_ASSIGNMENTS_QUERY}
            variables={{
              id: match.params.id,
              status: match.params.status,
            }}
          >
            {({ data: { workshop }, loading, error }) => {
              if (loading) return null;
              if (error) return null;

              return (
                <CustomTable
                  tableHeaderColor="primary"
                  tableHead={tableHead}
                  tableData={workshop.assignments.map(a => ({
                    ...Object.keys(a).reduce((obj, key) => {
                      switch (key) {
                        default:
                          return { ...obj, [key]: a[key] };
                      }
                    }, {}),
                    actions: workshop.isTutor
                      ? [
                          key => (
                            <Button color="transparent" component={Link} to={`/assignments/${key}`}>
                              <Info />
                            </Button>
                          ),
                          key => (
                            <Button
                              color="transparent"
                              component={Link}
                              to={`/assignments/${key}/edit`}
                            >
                              <Edit />
                            </Button>
                          ),
                          key => (
                            <Button color="transparent" onClick={this.handleDelete(key)}>
                              <Delete />
                            </Button>
                          ),
                          key => (
                            <Button color="transparent" href={`/assignments/download/${key}`}>
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
                        ],
                  }))}
                />
              );
            }}
          </Query>
        </div>
      </Content>
    );
  }
}

Assignments.propTypes = {
  // me: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  deleteAssignment: PropTypes.func.isRequired,
};

export default compose(
  graphql(DELETE_ASSIGNMENT, {
    name: 'deleteAssignment',
    // options: {
    //   update: (cache, { data: { createTag } }) => {
    //     const data = cache.readQuery({ query: TAGS_QUERY });
    //     data.tags.push(createTag);
    //     cache.writeQuery({ query: TAGS_QUERY, data });
    //   },
    // },
  }),
  // graphql(TAGS_QUERY, {
  //   props: ({ data }) => ({
  //     tags: data ? data.tags : [],
  //   }),
  // }),
  // withStyles(styles),
  withRouter,
)(Assignments);
