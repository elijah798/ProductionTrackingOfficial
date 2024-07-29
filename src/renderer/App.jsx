/* eslint-disable prettier/prettier */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box } from '@mui/material';
import { channels } from '../shared/constants';
import Report from '../components/report';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const cleanData = (data) => {
  const cleanedData = data.data.filter((entry) => entry.Date !== null && entry.FullName !== '');
  return cleanedData;
};

function Hello() {
  const [loadedData, setLoadedData] = useState(null);

  useEffect(() => {
    window.electron.ipcRenderer.on(channels.GET_DATA, (event, data) => {
      setLoadedData(cleanData(data));
    });
  }, []);

  const handleFile = (e) => {
    if (!e.target.files[0]) {
      return;
    }
    window.electron.ipcRenderer.sendMessage(channels.GET_DATA, {
      data: e.target.files[0].path,
    });
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {!loadedData ? (
        <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
        >
          <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          id="upload-button"
        >
          Upload file
          <VisuallyHiddenInput type="file" onChange={handleFile} />
        </Button>
      </Box>
      ) : (
        <Report data={loadedData} />
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
