import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Button, TableSortLabel, TextField, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '../tables/pagination';
import { useRouter } from 'next/navigation';
import CreateIcon from '@mui/icons-material/Create';
import DeleteTrainingStepButton from './DeleteTrainingStep';

type TrainingStep = {
    id: number;
    description: string;
    url: string;
    stepNumber: number;
    trainingType: {
        id: number;
        title: string;
    }
};

type TrainingStepListProps = {
  trainingSteps: TrainingStep[];
  totalTrainingSteps: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  trainingId: number | null;
};

const TrainingStepList: React.FC<TrainingStepListProps> = ({ trainingSteps, totalTrainingSteps, page, pageSize, sortBy, sortOrder, trainingId }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [currentSortBy, setCurrentSortBy] = useState<string>(sortBy);
  const [currentSortOrder, setCurrentSortOrder] = useState<string>(sortOrder);
  const [data, setData] = useState<TrainingStep[]>(trainingSteps);
  const [totalCount, setTotalCount] = useState<number>(totalTrainingSteps);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [filteredTrainingSteps, setFilteredTrainingSteps] = useState<TrainingStep[]>(trainingSteps);

  useEffect(() => {
    fetchTrainingSteps();
  }, [currentPage, pageSize, currentSortBy, currentSortOrder, searchTerm, trainingId]);

  const fetchTrainingSteps = async () => {
    try {
      const response = await fetch(`/api/steps/getStepsByTrainingId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trainingId, currentPage, pageSize, sortBy: currentSortBy, sortOrder: currentSortOrder, title: searchTerm }),
      });
  
      if (!response.ok) {
        console.error('Failed to fetch Training Steps data');
        return;
      }
  
      const { trainingSteps, totalTrainingSteps } = await response.json();
      console.log('Fetched Training Steps:', trainingSteps);
      console.log('Total Training Steps:', totalTrainingSteps);
      setData(trainingSteps);
      setFilteredTrainingSteps(trainingSteps); // Update filteredTrainingSteps with fetched data
      setTotalCount(totalTrainingSteps);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };  

  const handleSortChange = (column: string) => {
    const newOrder = currentSortBy === column && currentSortOrder === 'asc' ? 'desc' : 'asc';
    setCurrentSortBy(column);
    setCurrentSortOrder(newOrder);
    router.push(`/api/steps/getStepsByTrainingId?page=${currentPage}&pageSize=${pageSize}&sortBy=${column}&sortOrder=${newOrder}&title=${searchTerm}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/TrainingStepEdit?id=${id}&trainingId=${trainingId}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteSuccess = () => {
    router.refresh();
  };
  
  return (
    <main>
      <Grid container spacing={2} mb={5}>
        <Grid item xs={8}>
          <div><h1>Training Steps</h1></div>
        </Grid>
        <Grid item xs={4} container direction="row" justifyContent="flex-end" alignItems="center">
          <div><Button variant='contained' href={`/TrainingStepDetail?trainingId=${trainingId}&tab=2`}>Add Training Step</Button></div>
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
                  active={currentSortBy === 'createdAt'}
                  direction={currentSortBy === 'createdAt' ? currentSortOrder as "asc" | "desc" : undefined}
                  onClick={() => handleSortChange('createdAt')}
                >
                  Step Number
                </TableSortLabel>
              </TableCell>
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
                Type
              </TableCell>
              <TableCell>
                URL
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredTrainingSteps && filteredTrainingSteps.map((trainingStep) => (
            <TableRow key={trainingStep.id}>
                <TableCell>{trainingStep.stepNumber}</TableCell>
                <TableCell>{trainingStep.description}</TableCell>
                <TableCell>{trainingStep.trainingType.title}</TableCell>
                <TableCell>{trainingStep.url || "N/A"}</TableCell>
                <TableCell align="right">
                  <IconButton color="secondary" size='small' onClick={() => handleEdit(trainingStep.id)}>
                      <CreateIcon />
                  </IconButton>
                  <DeleteTrainingStepButton trainingStepId={trainingStep.id} onDeleteSuccess={handleDeleteSuccess} />
                </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalCount === 0 && <p>No training steps found</p>}
      {totalCount > 0 &&
        <Grid container display="flex" alignItems='center' mt={4}>
          <Grid item xs={6}>
            1 to 10 of {totalCount} items
          </Grid>
          <Grid item xs={6} display="flex" justifyContent="flex-end">
          </Grid>
        </Grid>
      }
    </main>
  );
};

export default TrainingStepList;
