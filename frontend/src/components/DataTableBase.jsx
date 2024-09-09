import React from 'react';
import DataTable from 'react-data-table-component';

const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

function DataTableBase(props) {
	return (
		<DataTable
			pagination
			selectableRowsComponentProps={selectProps}
			dense
			{...props}
		/>
	);
}

export default DataTableBase;