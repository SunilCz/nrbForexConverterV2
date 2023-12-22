import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import forexApi from '../api/forexApi';

const flattenData = (data) => {
  const flattenedData = [];

  data.forEach((entry) => {
    const { date, rates } = entry;

    rates.forEach((rate) => {
      const rowData = {
        date,
        currency: rate.currency.name,
        buyRate: parseFloat(rate.buy),
        sellRate: parseFloat(rate.sell),
      };

      flattenedData.push(rowData);
    });
  });

  return flattenedData;
};

function ForexTable({ fromDate, toDate }) {
  const [forexData, setForexData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await forexApi.getForexData(fromDate, toDate);
        console.log('Fetched Forex Data:', data);

        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        const flattenedData = flattenData(data);
        setForexData(flattenedData);
      } catch (error) {
        console.error('Error fetching Forex data:', error);
      }
    };

    fetchData();
  }, [fromDate, toDate]);

  const columns = useMemo(
    () => [
      { Header: 'Date', accessor: 'date', width: 100 },
      { Header: 'Currency', accessor: 'currency', width: 150 },
      { Header: 'Buy Rate', accessor: 'buyRate', width: 100 },
      { Header: 'Sell Rate', accessor: 'sellRate', width: 100 },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex,  globalFilter },
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
  } = useTable(
    {
      columns,
      data: forexData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <>
      <div>
      <div>
  <input
    value={globalFilter || ''}
    onChange={(e) => setGlobalFilter(e.target.value)}
    placeholder={'Search...'}
  />
</div>

      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <div>
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <span>
            | Go to page:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: '50px' }}
            />
          </span>
        </div>
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>{' '}
          <button
            onClick={() => gotoPage(pageOptions.length - 1)}
            disabled={!canNextPage}
          >
            {'>>'}
          </button>{' '}
        </div>
      </div>
    </>
  );
}

export default ForexTable;
