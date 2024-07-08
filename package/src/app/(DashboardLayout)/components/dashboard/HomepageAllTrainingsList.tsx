import { Table, TableBody, TableCell, TableContainer, TableHead, TableSortLabel, TableRow, Paper, Grid, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import { SelectChangeEvent } from '@mui/material/Select';

type Training = {
  id: number;
  description: string;
  createdAt: Date;
  status: string;
  createdBy: number;
};

type TrainingType = {
  id: number;
  title: string | null;
  category: string;
  createdAt: Date;
};

type AllTrainingsTableProps = {
  trainings: Training[];
  totalTrainings: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
};

const AllTrainingsTable: React.FC<AllTrainingsTableProps> = ({
  trainings,
  totalTrainings,
  page,
  pageSize,
  sortBy,
  sortOrder
}) => {
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);
  const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);
  const [currentPage, setCurrentPage] = useState(page);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<number | null>(null);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>(trainings);
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const router = useRouter();

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
        console.error('Failed to fetch training types:', error);
      }
    };

    fetchTrainingTypes();
  }, []);

  useEffect(() => {
    const filtered = trainings.filter(training => {
      const matchesSearch = searchTerm ? training.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      return matchesSearch;
    });
    setFilteredTrainings(filtered);
  }, [filterType, searchTerm, trainings]);

  const handleSortChange = (column: string) => {
    const isAsc = currentSortBy === column && currentSortOrder === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setCurrentSortBy(column);
    setCurrentSortOrder(newOrder);
    router.push(`/trainings?page=${currentPage}&pageSize=${pageSize}&sortBy=${column}&sortOrder=${newOrder}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`/trainings?page=${newPage}&pageSize=${pageSize}`);
  };

  const handleIconClick = (trainingId: number) => {
    router.push(`/TrainingTask?id=${trainingId}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setFilterType(value === '' ? null : Number(value));
  };

  return (
    <>
      <Grid container mb={2} display="flex" justifyContent="space-between">
        <Grid item xs={12} md={3}>
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
        <Grid item xs={12} md={3}>
          {/*<FormControl variant="outlined" fullWidth>
            <InputLabel>Training Type</InputLabel>
            <Select
              value={filterType ? filterType.toString() : ''}
              onChange={handleFilterChange}
              label="Training Type"
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {trainingTypes.map((type) => (
                <MenuItem key={type.id} value={type.id.toString()}>
                  {type.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>*/}
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={currentSortBy === 'description'}
                  direction={currentSortBy === 'description' ? currentSortOrder as 'asc' | 'desc' : undefined}
                  onClick={() => handleSortChange('description')}
                >
                  Training Description
                </TableSortLabel>
              </TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrainings.map((training) => (
              <TableRow key={training.id}>
                <TableCell>{training.description}</TableCell>
                <TableCell>{new Date(training.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <ArrowForwardIcon onClick={() => handleIconClick(training.id)} style={{ cursor: 'pointer' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AllTrainingsTable;
