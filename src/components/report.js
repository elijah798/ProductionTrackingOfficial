/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable react-hooks/rules-of-hooks */
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import  Box from '@mui/material/Box';
import { ButtonGroup, Button, Container } from '@mui/material';
import { useState, useEffect } from 'react';

const getUser = (data) => {
  const users = data.data.reduce((acc, entry) => {
    if (!acc.includes(entry.EmployeeID)) {
      acc.push(entry.EmployeeID);
    }
    return acc;
  }, []);
  return users;
};

function getCombinedData(data) {
  const users = getUser(data);
  const combinedData = users.map((user) => {
    const userEntries = data.data.filter((entry) => entry.EmployeeID === user);
    const totalHours = userEntries.reduce((acc, entry) => {
      return acc + parseFloat(entry.R);
    }, 0);
    const totalProduction = userEntries.reduce((acc, entry) => {
      return acc + parseFloat(entry.Quantity);
    }, 0);
    return {
      EmployeeID: user,
      totalHours,
      totalProduction,
      totalProductionRate: (totalProduction / totalHours).toFixed(2),
    };
  });
  return combinedData;
}

export default function report({ data }) {
  // console.log(data.data);
  // console.log(data.data[0]);
  // console.log(data.data.filter(entry => entry.EmployeeID === 'J10092'));

  const [tab, setTab] = useState('Conduit');
  const [filteredData, setFilteredData] = useState();
  const [EstRate, setEstRate] = useState(4.41);
  const [users, setUsers] = useState(getUser(data));

  console.log(users);
  console.log(data.data[0]);
  useEffect(() => {
    switch (tab) {
      case 'Conduit':
        setEstRate(4.41);
        setFilteredData(
          data.data.filter((entry) => /^\d{2}1/.test(entry.CostCodeNumber) && (entry.R || entry.O || entry.D ) !== 0),
        );
        break;
      case 'Distribution':
        setEstRate(21);
        setFilteredData(
          data.data.filter((entry) => /^\d{2}2/.test(entry.CostCodeNumber) && (entry.R || entry.O || entry.D ) !== 0),
        );
        break;
      case 'Wire':
        setEstRate(34);
        setFilteredData(
          data.data.filter((entry) => /^\d{2}300/.test(entry.CostCodeNumber) && (entry.R || entry.O || entry.D ) !== 0),
        );
        break;
      case 'Reloc':
        setEstRate(0.95);
        setFilteredData(
          data.data.filter((entry) => /^\d{2}308/.test(entry.CostCodeNumber) && (entry.R || entry.O || entry.D ) !== 0),
        );
        break;
      case 'MC Cable':
        setEstRate(9);
        setFilteredData(
          data.data.filter((entry) =>
            /^\d{2}(304|302)/.test(entry.CostCodeNumber) && (entry.R || entry.O || entry.D ) !== 0,
          ),
        );
        break;
      case 'Lights':
        setEstRate(112);
        setFilteredData(
          data.data.filter((entry) =>
            /^\d{2}(400|401)/.test(entry.CostCodeNumber) && (entry.R || entry.O || entry.D ) !== 0
          ),
        );
        break;
      case 'Devices':
        setEstRate(36);
        setFilteredData(
          data.data.filter((entry) =>
            /^\d{2}(500|501)/.test(entry.CostCodeNumber) && (entry.R || entry.O || entry.D ) !== 0,
          ),
        );
        break;
      default:
        setFilteredData(data.data);
        break;
    }
  }, [tab, data.data]);

  return (
    <div style={{ height: '75vh', width: '90vw' }}>
      <h1>Report</h1>
      <ButtonGroup
        className="ButtonGroup"
        variant="contained"
        aria-label="contained primary button group"
      >
        <Button onClick={() => setTab('Conduit')}>Conduit</Button>
        <Button onClick={() => setTab('Distribution')}>Distribution</Button>
        <Button onClick={() => setTab('Wire')}>Wire</Button>
        <Button onClick={() => setTab('Reloc')}>Reloc</Button>
        <Button onClick={() => setTab('MC Cable')}>MC Cable</Button>
        <Button onClick={() => setTab('Lights')}>Lights</Button>
        <Button onClick={() => setTab('Devices')}>Devices</Button>
      </ButtonGroup>
      {filteredData && (
          <Box
          sx={{
            height: 550,
            width: '100%',
            [`.${gridClasses.cell}.true`]:{
              backgroundColor: 'green',
              color: 'white',
            },
            [`.${gridClasses.cell}.false`]:{
              backgroundColor: 'red',
              color: 'white',
            }
          }}
          >

       
        <DataGrid
          rows={filteredData.map((entry, index) => {
            return {
              id: index,
              EmployeeID: entry.EmployeeID,
              Date: entry.Date,
              ProjectNumber: parseInt(entry.ProjectNumber, 10),
              R: parseInt(entry.R || entry.O || entry.D || entry.H || entry.V || 0, 10),
              costcode: entry.CostCode,
              Production: parseInt(entry.Quantity || 0, 10),
              ProductionRate: parseInt(
                (entry.R || entry.O || entry.D) !== 0
                  ? (parseInt((entry.Quantity || 0),10) / parseInt((entry.R || entry.O || entry.D ),10) || 0).toFixed(2)
                  : 0
              , 10),
              'Est Accubid Rate': EstRate,
            };
          })}
          columns={[
            { field: 'EmployeeID', headerName: 'Employee ID', width: 150 },
            { field: 'Date', headerName: 'Date', width: 150 },
            { field: 'R', headerName: 'Hours worked', width: 150 },
            { field: 'Production', headerName: 'Quantity', width: 150 },
            { field: 'ProductionRate', headerName: 'Production Rate', width: 150 },
            { field: 'Est Accubid Rate', headerName: 'Est Accubid Rate', width: 150 },
            { field: 'ProjectNumber', headerName: 'Project', width: 150 },
            { field: 'costcode', headerName: 'Cost Code', width: 150 },
            
          ]}
          getCellClassName={(params) => {
            if (params.field === 'ProductionRate') {
              return parseFloat(params.value) > params.row['Est Accubid Rate']
                ? 'true'
                : 'false';
            }
            return '';
          }}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
        </Box>
        
      )}
    </div>
  );
}
