import React from 'react';
import { Button, Grid } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ page, pageSize, total, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
      <Grid item>
        <Button
          variant="outlined"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ArrowBackIosNewIcon fontSize='small'/>
        </Button>
      </Grid>
      <Grid item>
        Page {page} of {totalPages}
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ArrowForwardIosIcon fontSize='small'/>
        </Button>
      </Grid>
    </Grid>
  );
};

export default Pagination;
