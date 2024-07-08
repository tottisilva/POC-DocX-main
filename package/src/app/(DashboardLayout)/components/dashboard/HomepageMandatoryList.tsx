'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableSortLabel,
  TableRow,
  Paper,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material/Select';

type UserTraining = {
  userId: number;
  trainingId: number;
  status: string;
  createdAt: Date;
  createdBy: number;
  user: {
    name: string;
  };
  training: {
    description: string;
  };
};

type UserTrainingTableProps = {
  userTrainings: UserTraining[];
  totalUserTrainings: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
};

const UserTrainingsTable: React.FC<UserTrainingTableProps> = ({
  userTrainings,
  totalUserTrainings,
  page,
  pageSize,
  sortBy,
  sortOrder
}) => {
  const { data: session } = useSession();
  const loggedInUserId = session?.user?.id ? parseInt(session.user.id as string, 10) : null;
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);
  const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);
  const [currentPage, setCurrentPage] = useState(page);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<number | '' | null>(null);
  const [filteredUserTrainings, setFilteredUserTrainings] = useState<UserTraining[]>(userTrainings);
  const [trainingTypes, setTrainingTypes] = useState<{ id: number; title: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTrainingTypes = async () => {
      try {
        const response = await fetch('/api/trainingType/getTrainingType');
        if (!response.ok) {
          throw new Error('Failed to fetch training types');
        }
        const data: { id: number; title: string }[] = await response.json();
        setTrainingTypes(data || []);
      } catch (error) {
        console.error('Failed to fetch training types:', error);
      }
    };

    fetchTrainingTypes();
  }, []);

  useEffect(() => {
    const filtered = userTrainings.filter(training => {
      const matchesStatus = filterStatus ? training.status === filterStatus : true;
      const matchesSearch = searchTerm ? training.training.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      return matchesStatus && matchesSearch;
    });
    setFilteredUserTrainings(filtered);
  }, [filterStatus, filterType, searchTerm, userTrainings]);

  const handleSortChange = (column: string) => {
    const isAsc = currentSortBy === column && currentSortOrder === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setCurrentSortBy(column);
    setCurrentSortOrder(newOrder);
    router.push(`?page=${currentPage}&pageSize=${pageSize}&sortBy=${column}&sortOrder=${newOrder}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`?page=${newPage}&pageSize=${pageSize}`);
  };

  const handleIconClick = (trainingId: number) => {
    router.push(`/TrainingTask?id=${trainingId}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterStatusChange = (event: SelectChangeEvent<string>) => {
    setFilterStatus(event.target.value || null);
  };

  const handleFilterTypeChange = (event: SelectChangeEvent<number | string>) => {
    const value = event.target.value === '' ? null : Number(event.target.value);
    setFilterType(value);
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
        <Grid container md={7} display="flex" justifyContent="flex-end" gap={2}>
          <Grid item xs={12} md={4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus || ''}
                onChange={handleFilterStatusChange}
                label="Status"
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Training Type</InputLabel>
              <Select
                value={filterType !== null ? filterType.toString() : ''}
                onChange={handleFilterTypeChange}
                label="Training Type"
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {trainingTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={currentSortBy === 'training.description'}
                  direction={currentSortBy === 'training.description' ? currentSortOrder as 'asc' | 'desc' : undefined}
                  onClick={() => handleSortChange('training.description')}
                >
                  Training Description
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={currentSortBy === 'training.typeId'}
                  direction={currentSortBy === 'training.typeId' ? currentSortOrder as 'asc' | 'desc' : undefined}
                  onClick={() => handleSortChange('training.typeId')}
                >
                  Type
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUserTrainings.map((userTraining) => (
              <TableRow key={`${userTraining.userId}-${userTraining.trainingId}`}>
                <TableCell>{userTraining.training.description}</TableCell>
                <TableCell>
                  {userTraining.status === 'Pending' && <Chip label="Pending" color="info" />}
                  {userTraining.status === 'Completed' && <Chip label="Completed" color="success" />}
                  {userTraining.status === 'Failed' && <Chip label="Failed" color="error" />}
                </TableCell>
                <TableCell>{new Date(userTraining.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  {userTraining.userId === loggedInUserId && (
                    <ArrowForwardIcon onClick={() => handleIconClick(userTraining.trainingId)} style={{ cursor: 'pointer' }} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalUserTrainings === 0 && <p>No trainings found</p>}
      {totalUserTrainings > 0 &&
        <Grid container spacing={2} display="flex" alignItems='center' mt={2}>
          <Grid item xs={4} md={6} >
            1 to 10 of {totalUserTrainings} items
          </Grid>
          <Grid item xs={8} md={6} display="flex" justifyContent="flex-end">
            {/* Add your pagination component here */}
          </Grid>
        </Grid>
      }
    </>
  );
};

export default UserTrainingsTable;
