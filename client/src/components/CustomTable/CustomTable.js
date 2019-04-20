import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// core components
import tableStyle from 'assets/jss/material-dashboard-react/components/tableStyle';

function CustomTable({ ...props }) {
  const { classes, tableHead, tableData, tableHeaderColor, actions } = props;
  console.log(tableData);
  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
            <TableRow>
              {tableHead.map((prop, index) => (
                <TableCell
                  className={`${classes.tableCell} ${classes.tableHeadCell}`}
                  key={prop.key || index}
                >
                  {prop.label}
                </TableCell>
              ))}
              {actions && <TableCell />}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, index) => (
            <TableRow key={prop.id || index}>
              {tableHead.map(header => (
                <TableCell className={classes.tableCell} key={header.key}>
                  {prop[header.key]}
                </TableCell>
              ))}
              <TableCell className={classes.tableCell} key="actions">
                {(prop.actions || actions).map(action => action(prop.id || index, prop))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: 'gray',
  actions: [],
};

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    'warning',
    'primary',
    'danger',
    'success',
    'info',
    'rose',
    'gray',
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.arrayOf(PropTypes.func),
};

export default withStyles(tableStyle)(CustomTable);
