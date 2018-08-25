import React from 'react';
// import { Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';

import Info from '@material-ui/icons/Info';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

import CustomTable from 'components/CustomTable/CustomTable';
import Button from 'components/CustomButtons/Button';
import Modal from 'components/Modal/Modal';

import { getMyStudents, deleteUser } from 'data/service';

const styles = {};

class UsersSection extends React.Component {
  propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    users: [],
    modal: false,
    selectedUserId: '',
  };

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    getMyStudents().then(res => {
      this.setState({ users: res.data.data.myStudents });
    });
  };

  handleDelete = key => () => {
    this.setState({ modal: true, selectedUserId: key });
  };

  deleteUser = () => {
    const { selectedUserId, users } = this.state;
    deleteUser(selectedUserId).then(() => {
      this.setState({ modal: false, users: users.filter(u => u.id !== selectedUserId) });
    });
  };

  render() {
    const { classes } = this.props;
    const { users, modal } = this.state;

    return (
      <div className={classes.root}>
        <Modal
          open={modal}
          titleText="Borrar Usuario"
          bodyText="Está seguro que desea borrar el usuario?"
          cancelText="Cancelar"
          handleOk={this.deleteUser}
          handleCancel={() => this.setState({ modal: false })}
        />
        <CustomTable
          tableHeaderColor="primary"
          tableHead={[
            { label: 'e-mail', key: 'email' },
            // { label: 'DNI', key: 'idNumber' },
            { label: 'Nombre', key: 'firstName' },
            { label: 'Apellido', key: 'lastName' },
          ]}
          tableData={users}
          // actions={[
          //   key => (
          //     <Button color="transparent" component={Link} to={`/users/${key}`}>
          //       <Info />
          //     </Button>
          //   ),
          //   key => (
          //     <Button color="transparent" component={Link} to={`/users/${key}/edit`}>
          //       <Edit />
          //     </Button>
          //   ),
          //   key => (
          //     <Button color="transparent" onClick={this.handleDelete(key)}>
          //       <Delete />
          //     </Button>
          //   ),
          // ]}
        />
      </div>
    );
  }
}

export default withStyles(styles)(UsersSection);
