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
            Add Document
          </Typography>
        </Grid>
      </Grid>
    <Paper>
      <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
        <Tab label="Tab 1" />
        <Tab label="Tab 2" />
        <Tab label="Tab 3" />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Tab 2 Content
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Tab 3 Content
      </CustomTabPanel>
    </Paper>
    </>
  );
};

export default DocumentDetail;
