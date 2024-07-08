'use client';

import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import UploadForm from './UploadDocumentForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const DocumentDetail: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
    <Grid container spacing={2} mb={5} mt={2}>
        <Grid item xs={12} md={8}>
          <Typography component="h1" variant="h1">
            Create Document
          </Typography>
        </Grid>
      </Grid>
    <UploadForm />
    </>
  );
};

export default DocumentDetail;
