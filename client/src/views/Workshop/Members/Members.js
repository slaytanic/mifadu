import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Query } from 'react-apollo';

import withStyles from '@material-ui/core/styles/withStyles';

import CustomTable from 'components/CustomTable/CustomTable';

import Content from 'layouts/Content/Content';

import WORKSHOP_MEMBERS_QUERY from 'graphql/queries/WorkshopMembers';

const styles = {};

const Students = ({ classes, match }) => {
  return (
    <Content title="Miembros del taller" subtitle="Todos los miembros del taller">
      <div className={classes.root}>
        <Query query={WORKSHOP_MEMBERS_QUERY} variables={{ id: match.params.id }}>
          {({ data: { workshop }, loading, error }) => {
            if (loading) return null;
            if (error) return null;

            return (
              <CustomTable
                tableHeaderColor="primary"
                tableHead={[
                  { label: 'Nombre', key: 'firstName' },
                  { label: 'Apellido', key: 'lastName' },
                  { label: 'e-mail', key: 'email' },
                ]}
                tableData={workshop.members}
              />
            );
          }}
        </Query>
      </div>
    </Content>
  );
};

Students.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Students));
