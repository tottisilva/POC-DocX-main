import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Button, TableSortLabel, TextField, Box } from '@mui/material';
import DeleteTrainingTypeButton from './DeleteTrainingType';
import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '../tables/pagination';
import { useRouter } from 'next/navigation';

type TrainingType = {
  id: number;
  title: string | null;
  category: string;
  createdAt: Date;
};

type TrainingTypeListProps = {
  trainingTypes: TrainingType[];
  totalTrainingTypes: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
};

const TrainingTypeList: React.FC<TrainingTypeListProps> = ({ trainingTypes: initialTrainingTypes, totalTrainingTypes: initialTotal, page, pageSize, sortBy, sortOrder }) => {
  const router = useRouter();
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>(initialTrainingTypes);
  const [totalTrainingTypes, setTotalTrainingTypes] = useState<number>(initialTotal);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [currentSortBy, setCurrentSortBy] = useState<string>(sortBy);
  const [currentSortOrder, setCurrentSortOrder] = useState<string>(sortOrder);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredTrainingTypes, setFilteredTrainingTypes] = useState<TrainingType[]>(initialTrainingTypes);

  const fetchTrainingTypes = async () => {
    try {
      const response = await fetch(`/api/trainingType/getTrainingTypesPaginated?page=${currentPage}&pageSize=${pageSize}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}&title=${searchTerm}`);
      if (!response.ok) {
        console.error('Failed to fetch Training Types data');
        return;
      }
      const data = await response.json();
      setTrainingTypes(data.trainingTypes);
      setTotalTrainingTypes(data.totalTrainingTypes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSortChange = (column: string) => {
    const newOrder = currentSortBy === column && currentSortOrder === 'asc' ? 'desc' : 'asc';
    setCurrentSortBy(column);
    setCurrentSortOrder(newOrder);
    router.push(`/trainingType/getTrainingTypesPaginated?page=${currentPage}&pageSize=${pageSize}&sortBy=${column}&sortOrder=${newOrder}&title=${searchTerm}`, undefined);
  };

  const handleEdit = (id: number) => {
    router.push(`/TrainingTypeEdit?id=${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`/TrainingTypes?page=${newPage}&pageSize=${pageSize}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}&title=${searchTerm}`, undefined);
  };

  const dateFormatter = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(dateObj);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchTrainingTypes();
  };

  const handleDeleteSuccess = () => {
    fetchTrainingTypes();
  };

  useEffect(() => {
    fetchTrainingTypes();
  }, [currentPage, pageSize, currentSortBy, currentSortOrder, searchTerm]);

  useEffect(() => {
    const filtered = trainingTypes.filter(trainingType => {
      const title = trainingType.title || '';
      return searchTerm ? title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    });
    setFilteredTrainingTypes(filtered);
    setTotalTrainingTypes(filtered.length);
  }, [searchTerm, trainingTypes]);

  return (
    <main>
      <Grid container spacing={2} mb={5}>
        <Grid item xs={8}>
          <div><h1>Training Types</h1></div>
        </Grid>
        <Grid item xs={4} container direction="row" justifyContent="flex-end" alignItems="center">
          <div><Button variant='contained' href="/TrainingTypeDetail">Add Training Type</Button></div>
        </Grid>
      </Grid>
      <Box mb={2}>
        <Grid container>
          <Grid item xs={12} sm={12} md={3}>
            <TextField
              label="Search Title"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: <SearchIcon />
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={currentSortBy === 'title'}
                  direction={currentSortBy === 'title' ? currentSortOrder as "asc" | "desc" : undefined}
                  onClick={() => handleSortChange('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={currentSortBy === 'createdAt'}
                  direction={currentSortBy === 'createdAt' ? currentSortOrder as "asc" | "desc" : undefined}
                  onClick={() => handleSortChange('createdAt')}
                >
                  Created At
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrainingTypes.map((trainingType) => (
              <TableRow key={trainingType.id}>
                <TableCell>{trainingType.title}</TableCell>
                <TableCell>{dateFormatter(trainingType.createdAt)}</TableCell>
                <TableCell align="right">
                  <Button color="secondary" size='small' onClick={() => handleEdit(trainingType.id)}>
                    <CreateIcon />
                  </Button>
                  <DeleteTrainingTypeButton
                    trainingTypeId={trainingType.id}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalTrainingTypes === 0 && <p>No training types found</p>}
      {totalTrainingTypes > 0 &&
        <Grid container display="flex" alignItems='center' mt={4}>
          <Grid item xs={6}>
            {currentPage * pageSize + 1 - 10} to {(currentPage + 1) * pageSize - 10} of {totalTrainingTypes} items
          </Grid>
          <Grid item xs={6} display="flex" justifyContent="flex-end">
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={totalTrainingTypes}
              onPageChange={handlePageChange}
            />
          </Grid>
        </Grid>
      }
    </main>
  );
};

export default TrainingTypeList;
