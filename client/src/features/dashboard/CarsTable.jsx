import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Paper, Typography, CircularProgress, TableSortLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { setSortConfig } from './carsSlice';

const columnConfig = [
  { id: 'name', label: 'Name', width: '30%', numeric: false },
  { id: 'mpg', label: 'MPG', width: '15%', numeric: true },
  { id: 'cylinders', label: 'Cylinders', width: '15%', numeric: true },
  { id: 'horsepower', label: 'Horsepower', width: '20%', numeric: true },
  { id: 'modelYear', label: 'Year', width: '10%', numeric: true },
  { id: 'origin', label: 'Origin', width: '10%', numeric: false },
];

const HeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  backgroundColor: theme.palette.grey[100],
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontWeight: 'bold',
}));

const DataRow = styled(Box)(({ theme, index }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  backgroundColor: index % 2 === 0 ? 'transparent' : theme.palette.action.hover,
}));

const Cell = styled(Box)(({ width, numeric }) => ({
  width: width,
  padding: '16px 8px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign: numeric ? 'right' : 'left',
}));

const CarsTable = () => {
  const dispatch = useDispatch();
  const { filteredData, status, sortConfig } = useSelector((state) => state.cars);

  const handleSortRequest = (property) => {
    const isAsc = sortConfig.key === property && sortConfig.direction === 'asc';
    dispatch(setSortConfig({ key: property, direction: isAsc ? 'desc' : 'asc' }));
  };

  const sortedData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const stabilizedThis = filteredData.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const isNumeric = columnConfig.find(c => c.id === sortConfig.key)?.numeric;
      const valA = a[0][sortConfig.key];
      const valB = b[0][sortConfig.key];

      let order = 0;
      if (valA == null || valB == null) {
        order = valA == null ? 1 : -1;
      } else if (isNumeric) {
        order = valA < valB ? -1 : 1;
      } else {
        order = String(valA).toLowerCase().localeCompare(String(valB).toLowerCase());
      }
      
      if (order !== 0) return sortConfig.direction === 'asc' ? order : -order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }, [filteredData, sortConfig]);

  const Row = ({ index, style }) => {
    const row = sortedData[index];
    return (
      <DataRow style={style} index={index}>
        {columnConfig.map((col) => (
          <Cell key={col.id} width={col.width} numeric={col.numeric}>
            {row[col.id] != null ? row[col.id] : 'N/A'}
          </Cell>
        ))}
      </DataRow>
    );
  };
  
  if (status === 'loading' && filteredData.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <HeaderRow>
        {columnConfig.map((col) => (
          <Cell key={col.id} width={col.width} numeric={col.numeric}>
            <TableSortLabel
              active={sortConfig.key === col.id}
              direction={sortConfig.key === col.id ? sortConfig.direction : 'asc'}
              onClick={() => handleSortRequest(col.id)}
            >
              {col.label}
            </TableSortLabel>
          </Cell>
        ))}
      </HeaderRow>
      <Box sx={{ flexGrow: 1 }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              itemCount={sortedData.length}
              itemSize={53}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </Box>
    </Box>
  );
};

export default CarsTable;