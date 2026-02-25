import React, { memo } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';

const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: 'ALL',
};

const exportToTSV = (columns, data) => {
    if (!columns?.length || !data?.length) return;

    const headers = columns.map(col => col.name).join('\t');

    const rows = data.map(row =>
        columns
            .map(col => {
                try {
                    const value = col.selector ? col.selector(row) : '';
                    return value == null ? '' : String(value);
                } catch {
                    return '';
                }
            })
            .join('\t')
    );

    const tsv = [headers, ...rows].join('\n');

    navigator.clipboard.writeText(tsv);
};

function DataTableBase({
    columns = [],
    data = [],
    loading = false,
    paginationPerPage = 25,
    paginationRowsPerPageOptions = [10, 25, 100],
    enableExport = false,
    ...otherProps
}) {
    const emptyTableMessage = loading ? "Loading Data..." : (data.length ? "" : "No Table Data");

    return (
        <>
            {enableExport && (
                <div style={{ marginBottom: '8px' }}>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => exportToTSV(columns, data)}
                    >
                        Copy TSV for Excel
                    </button>
                    <span style={{ fontSize: '0.75rem', color: '#555', marginLeft: '8px', }}>
                        Click to copy table. Then paste directly into Excel. Use Excel’s <strong>Data → Text to Columns → Delimited → Tab</strong> option.
                    </span>
                </div>
            )}
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
                columns={columns}
                {...otherProps}
            />
        </>

    );
}

DataTableBase.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    paginationPerPage: PropTypes.number,
    paginationRowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
    enableExport: PropTypes.bool,
};

export default memo(DataTableBase);
