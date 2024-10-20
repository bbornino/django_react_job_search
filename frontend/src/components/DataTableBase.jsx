import React from 'react';
import DataTable from 'react-data-table-component';

const selectProps = { indeterminate: isIndeterminate => isIndeterminate };
const paginationComponentOptions = {
	selectAllRowsItem: true,
	selectAllRowsItemText: 'ALL',
  };


function DataTableBase(props) {
	// const emptyTableMessage = (props.data.length) ? "Loading Data" : "No Table Data";

	return (
		<DataTable
			selectableRowsComponentProps={selectProps}
			paginationComponentOptions={paginationComponentOptions}
			// noDataComponent={emptyTableMessage}
			noDataComponent="Loading Data"
			paginationPerPage={25}
			paginationRowsPerPageOptions={[10,25,100]}
			pagination striped highlightOnHover dense
			{...props}
		/>
	);
}

export default DataTableBase;