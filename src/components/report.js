/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable react-hooks/rules-of-hooks */
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import  Box from '@mui/material/Box';
import { ButtonGroup, Button, Container, InputLabel,MenuItem,FormControl,Select, Autocomplete, TextField } from '@mui/material';
import { useState, useEffect } from 'react';


const getUser = (data) => {
  const users = data.reduce((acc, entry) => {
    if (!acc.includes(entry.CompanyEmployeeID)) {
      acc.push(entry.CompanyEmployeeID);
    }
    return acc;
  }, []);
  return users;
};

const getCrews = (data) => {
  const crews = data.reduce((acc, entry) => {
    if (!acc.includes(entry.CrewName) && entry.CrewName !== undefined) {
      acc.push(entry.CrewName);
    }
    return acc;
  }, []);
  return crews;
};

const getProjects = (data) => {
  const projects = data.reduce((acc, entry) => {
    if (!acc.includes(entry.Number) && entry.Number !== undefined) {
      acc.push(entry.Number);
    }
    return acc;
  }, []);
  return projects;
};




const setToString = (data) => {
  const stringData = data.map((entry) => {
    return {
      ...entry.toString(),
    };
  });
};



export default function report({ data }) {

  const [tab, setTab] = useState('Conduit');
  const [filteredData, setFilteredData] = useState();
  const [EstRate, setEstRate] = useState(4.41);
  const [projects, setProjects] = useState(getProjects(data));
  const [currentProject, setCurrentProject] = useState(projects[0]);
  useEffect(() => {
    switch (tab) {
      case 'Conduit':
        setEstRate(4.41);
        setFilteredData(
          data.filter((entry) => /^\d{2}1/.test(entry.CostCode) && entry.Number === currentProject),
        );
        break;
      case 'Distribution':
        setEstRate(21);
        setFilteredData(
          data.filter((entry) => /^\d{2}2/.test(entry.CostCode) && entry.Number === currentProject),
        );
        break;
      case 'Wire':
        setEstRate(34);
        setFilteredData(
          data.filter((entry) => /^\d{2}300/.test(entry.CostCode) && entry.Number === currentProject),
        );
        break;
      case 'Reloc':
        setEstRate(0.95);
        setFilteredData(
          data.filter((entry) => /^\d{2}308/.test(entry.CostCode) && entry.Number === currentProject),
        );
        break;
      case 'MC Cable':
        setEstRate(9);
        setFilteredData(
          data.filter((entry) =>
            /^\d{2}(304|302)/.test(entry.CostCode) && entry.Number === currentProject,
          ),
        );
        break;
      case 'Lights':
        setEstRate(112);
        setFilteredData(
          data.filter((entry) =>
            /^\d{2}(400|401)/.test(entry.CostCode) && entry.Number === currentProject
          ),
        );
        break;
      case 'Devices':
        setEstRate(36);
        setFilteredData(
          data.filter((entry) =>
            /^\d{2}(500|501)/.test(entry.CostCode) && entry.Number === currentProject,
          ),
        );
        break;
      default:
        setFilteredData(data);
        break;
    }
  }, [tab, data, currentProject]);

  return (
    <Box sx={{ height: '100vh', width: '90vw' }}>
      <h1>Report for </h1>
      <Box>
        < Autocomplete
          disablePortal
          id="Project-Select"
          options={projects}
          fullWidth
          
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params}  /> }
          onChange={(event, value) => setCurrentProject(value)}
        />
      </Box>
      
      <Box>
      <ButtonGroup
          className="ButtonGroup"
          variant="contained"
          aria-label="Choose Timeframe"
          fullWidth
      >
          <Button>Alltime</Button>
          <Button>Previous Month </Button>
          <Button>Weekly</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button>Weekly</Button>
        <Button>Daily</Button>
      </ButtonGroup>
      <ButtonGroup
        className="ButtonGroup"
        variant="contained"
        aria-label="Choose Cost Code"
        fullWidth
        
      >
        <Button id="Conduit" onClick={() => setTab('Conduit')}>Conduit</Button>
        <Button id="Distribution" onClick={() => setTab('Distribution')}>Distribution</Button>
        <Button id="Wire" onClick={() => setTab('Wire')}>Wire</Button>
        <Button id="Reloc" onClick={() => setTab('Reloc')}>Reloc</Button>
        <Button id="MC Cable" onClick={() => setTab('MC Cable')}>MC Cable</Button>
        <Button id="Lights" onClick={() => setTab('Lights')}>Lights</Button>
        <Button id="Devices" onClick={() => setTab('Devices')}>Devices</Button>
      </ButtonGroup>
      </Box>

      {filteredData && (
          <Box
          sx={{
            height: '70%',
            minHeight: '70%',
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
              name: entry.FullName,
              id: index,
              EmployeeID: entry.CompanyEmployeeID,
              Date: entry.Date,
              ProjectNumber: parseInt(entry.Number, 10),
              R: parseFloat(entry.Hours).toFixed(2),
              costcode: entry.CostCode,
              timeid: entry.ID,
              Production: entry.Quantity,
              ProductionRate: 
                (entry.Hours) !== 0 || (entry.hours !== null)
                  ? (parseFloat((entry.Quantity || 0),10) / parseFloat(entry.Hours,10) || 0).toPrecision(2)
                  : 0
              ,
              'Est Accubid Rate': EstRate,
            };
          })}
          columns={[
            { field: 'name', headerName: 'Name', width: 150 },
            { field: 'EmployeeID', headerName: 'Employee ID', width: 150 },
            { field: 'Date', headerName: 'Date', width: 100 },
            { field: 'R', headerName: 'Hours worked', width: 100 },
            { field: 'Production', headerName: 'Quantity', width: 80 },
            // { field: 'timeid', headerName: 'Timecard ID', width: 150 },
            { field: 'ProductionRate', headerName: 'Production Rate', width: 150 },
            { field: 'Est Accubid Rate', headerName: 'Est Accubid Rate'},
            // { field: 'costcode', headerName: 'Cost Code', width: 150 },
            
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
    </Box>
  );
}
