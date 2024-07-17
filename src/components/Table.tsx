import React, { useState } from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatKey } from '../utility/utils'; 

interface TableProps {
  data: any[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const hasEmptyFields = (item: any) => {
    return Object.values(item).every((val) => val === null || val === undefined || val === '');
  };

  const filteredData = data.filter((item) => {
    return (
      !hasEmptyFields(item) &&
      item.managedBy && 
      item.managedBy.toString().toLowerCase().includes(search.toLowerCase()) 
    );
  });

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const renderCellValue = (val: any) => {
    if (typeof val === 'object' && val !== null) {
      if (Array.isArray(val) && val[0]?.filename) {
        return val[0].filename; 
      }
      return JSON.stringify(val, null, 2); 
    }
    return val?.toString();
  };

  const handleAccordionToggle = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  
  const headers = ["aggregationTag", "archipelagoId", "city", "country", "managedBy"];

  return (
    <Box m={2}> 
      <TextField
        variant="outlined"
        placeholder="Search by Managed By..."
        value={search}
        onChange={handleSearchChange}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        style={{ marginBottom: '1rem' }}
      />
      <TableContainer component={Paper}>
        <MuiTable>
          <TableHead>
            <TableRow>
              {headers.map((key) => (
                <TableCell key={key}>
                  <TableSortLabel
                    active={sortConfig?.key === key}
                    direction={sortConfig?.direction}
                    onClick={() => handleSort(key)}
                  >
                    <Typography variant="body1" fontWeight="bold">{formatKey(key)}</Typography>
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>
                <Typography variant="body1" fontWeight="bold">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((item, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  {headers.map((key, i) => (
                    item[key] !== null && item[key] !== undefined && item[key] !== '' ? (
                      <TableCell key={i}>{renderCellValue(item[key])}</TableCell>
                    ) : null
                  ))}
                  <TableCell>
                    <Button onClick={() => handleAccordionToggle(index)}>
                      {expandedRow === index ? 'Hide Details' : 'View More'}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headers.length + 1}>
                    <Accordion expanded={expandedRow === index} onChange={() => handleAccordionToggle(index)}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="body1">Additional Details</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box>
                          <Typography variant="body2">
                            {Object.entries(item).map(([key, value]) => (
                              !headers.includes(key) && value !== null && value !== undefined && value !== '' ? (
                                <div key={key}>
                                  <strong>{formatKey(key)}:</strong> {renderCellValue(value)}
                                </div>
                              ) : null
                            ))}
                          </Typography>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Box>
  );
};

export default Table;
