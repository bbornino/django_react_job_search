import React from 'react';
import DataTable from 'react-data-table-component';

const selectProps = { indeterminate: isIndeterminate => isIndeterminate };
const paginationComponentOptions = {
	selectAllRowsItem: true,
	selectAllRowsItemText: 'ALL',
  };

function DataTableBase(props) {
	return (
		<DataTable
			selectableRowsComponentProps={selectProps}
			paginationComponentOptions={paginationComponentOptions}
			paginationRowsPerPageOptions={[10,25,100]}
			pagination striped highlightOnHover dense
			{...props}
		/>
	);
}

export default DataTableBase;