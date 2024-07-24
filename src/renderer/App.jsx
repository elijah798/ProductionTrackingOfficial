import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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

function Hello() {
  const [loadedData, setLoadedData] = useState(null);

  useEffect(() => {
    window.electron.ipcRenderer.on(channels.GET_DATA, (event, data) => {
      setLoadedData(data);
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
    <div>
      {!loadedData ? (
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type="file" onChange={handleFile} />
        </Button>
      ) : (
        <Report data={loadedData} />
      )}
    </div>
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
