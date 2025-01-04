import React, { memo } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';

const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: 'ALL',
};

function DataTableBase({ data, loading, paginationPerPage = 25, paginationRowsPerPageOptions = [10, 25, 100], ...otherProps }) {
    const emptyTableMessage = loading ? "Loading Data..." : (data.length ? "" : "No Table Data");

    return (
        <DataTable
            selectableRowsComponentProps={selectProps}
            paginationComponentOptions={paginationComponentOptions}
            noDataComponent={emptyTableMessage}
            paginationPerPage={paginationPerPage}
            paginationRowsPerPageOptions={paginationRowsPerPageOptions}
            pagination
            striped
            highlightOnHover
            dense
            data={data}
            {...otherProps}
        />
    );
}

DataTableBase.propTypes = {
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    paginationPerPage: PropTypes.number,
    paginationRowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
};

DataTableBase.defaultProps = {
    data: [],
    loading: false,
    paginationPerPage: 25,
    paginationRowsPerPageOptions: [10, 25, 100],
};

export default memo(DataTableBase);
