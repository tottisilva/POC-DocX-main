import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableSortLabel, TableHead, TableRow, Paper, Grid, Button, FormControl, InputLabel, Select, MenuItem, TextField, Snackbar, Box, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import MuiAlert from '@mui/material/Alert';
import { SelectChangeEvent } from '@mui/material';
import DeleteTrainingButton from './DeleteTraining';
import Pagination from '../tables/pagination';
import { useRouter } from 'next/navigation';

type Training = {
  id: number;
  description: string;
  url: string;
  typeId: number;
  userId: number;
  createdAt: Date;
  trainingType: {
    title: string;
  };
  user: {
    name: string;
  } | null;
  document: {
    title: string;
  } | null;
};

type TrainingListProps = {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
};

type TrainingType = {
  id: number;
  title: string | null;
  category: string;
  createdAt: Date;
};

const TrainingList: React.FC<TrainingListProps> = ({ page, pageSize, sortBy, sortOrder }) => {
  const router = useRouter();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [totalTrainings, setTotalTrainings] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);
  const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);
  const [filterType, setFilterType] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>(trainings);
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("error");
  const [totalCount, setTotalCount] = useState<number>(totalTrainings);

  const fetchTrainings = async () => {
    try {
      const response = await fetch(`/api/trainings/getTrainingsPaginated?page=${currentPage}&pageSize=${pageSize}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`);
      if (response.ok) {
        const data = await response.json();
        setTrainings(data.trainings);
        setTotalTrainings(data.totalTrainings);
      } else {
        console.error('Failed to fetch trainings');
      }
    } catch (error) {
      console.error('Error fetching trainings:', error);
    }
  };

  const handleSortChange = (column: string) => {
    const newOrder = currentSortBy === column && currentSortOrder === 'asc' ? 'desc' : 'asc';
    setCurrentSortBy(column);
    setCurrentSortOrder(newOrder);
    router.push(`/trainings?page=${currentPage}&pageSize=${pageSize}&sortBy=${column}&sortOrder=${newOrder}`);
  };

  const handleEdit = (id: number) => {
    router.push(`TrainingEdit?id=${id}`);
  };

  const handleDeleteSuccess = () => {
    fetchTrainings();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`/Trainings?page=${newPage}&pageSize=${pageSize}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`);
  };

  const handleFilterChange = (event: SelectChangeEvent<number>, filterType: string) => {
    const value = event.target.value;
    if (filterType === 'trainingType') {
      setFilterType(value === '' ? null : Number(value));
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleResetFilters = () => {
    setFilterType(null);
    setSearchTerm('');
  };

  useEffect(() => {
    fetchTrainings();
  }, [currentPage, pageSize, currentSortBy, currentSortOrder, searchTerm]);

  useEffect(() => {
    const fetchTrainingTypes = async () => {
      try {
        const response = await fetch('/api/trainingType/getTrainingType');
        if (!response.ok) {
          throw new Error('Failed to fetch training types');
        }
        const data: TrainingType[] = await response.json();
        setTrainingTypes(data || []);
      } catch (error) {
        console.error('Fetch training types error:', error);
        setSnackbarMessage("Failed to fetch training types");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };

    fetchTrainingTypes();
  }, []);

  useEffect(() => {
    const filtered = trainings.filter(training => {
      const matchesType = filterType ? training.typeId === filterType : true;
      const matchesSearch = searchTerm ? training.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      return matchesType && matchesSearch;
    });
    setFilteredTrainings(filtered);
    setTotalCount(filtered.length); // Update total count based on filtered results
  }, [filterType, searchTerm, trainings]);

  return (
    <main>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <Grid container spacing={2} mb={5} mt={2}>
        <Grid item xs={12} md={8}>
          <Typography component="h1" variant="h1">Trainings</Typography>
        </Grid>
        <Grid item container xs={12} md={4} gap={2} direction="row" justifyContent="flex-end" alignItems="center">
          <Grid xs={12} md="auto"><Button variant='contained' fullWidth href="/TrainingDetail">Add Training</Button></Grid>
        </Grid>
      </Grid>
      <Box mb={2}>
        <Grid container spacing={2} display="flex" justifyContent="space-between">
          <Grid item xs={12} sm={12} md={3}>
            <TextField
              label="Search Description"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: <SearchIcon />
              }}
            />
          </Grid>
          <Grid xs={12} sm={12} md={8} container gap={2} direction="row" display="flex" justifyContent="flex-end" alignItems="center" alignContent="center">
            {/*<Button onClick={handleResetFilters} style={{ height: '53.13px' }}>Reset</Button>
            <Grid item>
              <FormControl style={{ minWidth: 218 }}>
                <InputLabel id="filter-type-label">Filter by Type</InputLabel>
                <Select
                  labelId="filter-type-label"
                  value={filterType || ''}
                  onChange={(event) => handleFilterChange(event, 'trainingType')}
                  label="Filter by Type"
                >
                  <MenuItem value="">All</MenuItem>
                  {trainingTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>{type.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>*/}
          </Grid>
        </Grid>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={currentSortBy === 'description'}
                  direction={currentSortOrder as 'asc' | 'desc'}
                  onClick={() => handleSortChange('description')}
                >
                  Description
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={currentSortBy === 'url'}
                  direction={currentSortOrder as 'asc' | 'desc'}
                  onClick={() => handleSortChange('url')}
                >
                  URL
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={currentSortBy === 'user'}
                  direction={currentSortOrder as 'asc' | 'desc'}
                  onClick={() => handleSortChange('user')}
                >
                  Created By
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrainings.map((training) => (
              <TableRow key={training.id}>
                <TableCell>{training.description}</TableCell>
                <TableCell>{training.url || 'N/A'}</TableCell>
                <TableCell>{training.user?.name}</TableCell>
                <TableCell align="right">
                  <Grid container display="flex" justifyContent="flex-end" alignItems="center">
                    <Grid item><IconButton color="secondary" onClick={() => handleEdit(training.id)}><CreateIcon /></IconButton></Grid>
                    <Grid item><DeleteTrainingButton trainingId={training.id} onDeleteSuccess={handleDeleteSuccess} /></Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalCount === 0 && <p>No trainings found</p>}
      {totalCount > 0 &&
        <Grid container display="flex" alignItems='center' mt={4}>
                    <Grid item xs={6}>
            {currentPage * pageSize + 1 - 10} to {(currentPage + 1) * pageSize - 10} of {totalCount} items
          </Grid>
          <Grid item xs={6} display="flex" justifyContent="flex-end">
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={totalCount}
              onPageChange={handlePageChange}
            />
          </Grid>
        </Grid>
      }
    </main>
  );
};

export default TrainingList;
