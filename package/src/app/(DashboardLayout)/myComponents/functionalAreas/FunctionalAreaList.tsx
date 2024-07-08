'use client';

import PageContainer from '../../components/container/PageContainer';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableSortLabel, TableRow, Paper, Grid, Button, TextField, Box } from '@mui/material';
import DeleteFunctionalAreaButton from './DeleteFunctionalArea';
import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '../tables/pagination';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type FunctionalArea = {
  id: number;
  name: string;
  code: string;
};

type FunctionalAreaListProps = {
  functionalAreas: FunctionalArea[];
  totalFunctionalAreas: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
};

const FunctionalAreaList: React.FC<FunctionalAreaListProps> = ({ functionalAreas: initialFunctionalAreas, totalFunctionalAreas: initialTotal, page, pageSize, sortBy, sortOrder }) => {
  const router = useRouter();
  const [functionalAreas, setFunctionalAreas] = useState<FunctionalArea[]>(initialFunctionalAreas);
  const [totalCount, setTotalCount] = useState<number>(initialTotal);
  const [currentSortBy, setCurrentSortBy] = useState<string>(sortBy);
  const [currentSortOrder, setCurrentSortOrder] = useState<string>(sortOrder);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredFunctionalAreas, setFilteredFunctionalAreas] = useState<FunctionalArea[]>(initialFunctionalAreas);

  const fetchFunctionalAreas = async () => {
    try {
      const response = await fetch(`/api/functionalArea/getFunctionalAreasPaginated?page=${currentPage}&pageSize=${pageSize}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}&searchTerm=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setFunctionalAreas(data.functionalAreas);
        setTotalCount(data.totalFunctionalAreas);
      } else {
        console.error('Failed to fetch functional areas');
      }
    } catch (error) {
      console.error('Error fetching functional areas:', error);
    }
  };

  const handleSortChange = (column: string) => {
    const newOrder = currentSortBy === column && currentSortOrder === 'asc' ? 'desc' : 'asc';
    setCurrentSortBy(column);
    setCurrentSortOrder(newOrder);
    router.push(`/FunctionalAreas?page=${currentPage}&pageSize=${pageSize}&sortBy=${column}&sortOrder=${newOrder}&searchTerm=${searchTerm}`, undefined);
  };

  const handleEdit = (id: number) => {
    router.push(`/FunctionalAreaEdit?id=${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`/FunctionalAreas?page=${newPage}&pageSize=${pageSize}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}&searchTerm=${searchTerm}`, undefined);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    router.push(`/FunctionalAreas?page=${currentPage}&pageSize=${pageSize}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}&searchTerm=${event.target.value}`, undefined);
  };

  const handleDeleteSuccess = () => {
    fetchFunctionalAreas();
  };

  useEffect(() => {
    fetchFunctionalAreas();
  }, [currentPage, currentSortBy, currentSortOrder, searchTerm]);

  useEffect(() => {
    const filtered = functionalAreas.filter(fa => 
      fa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fa.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFunctionalAreas(filtered);
  }, [searchTerm, functionalAreas]);

  return (
    <main>
      <PageContainer title="Functional Areas" description="This is Functional Areas">
        <Grid container spacing={2} mb={5}>
          <Grid item xs={8}>
            <div><h1>Functional Areas</h1></div>
          </Grid>
          <Grid item xs={4} container direction="row" justifyContent="flex-end" alignItems="center">
            <div><Button variant='contained' href="/FunctionalAreaDetail">Add Functional Area</Button></div>
          </Grid>
        </Grid>
        <Box mb={2}>
          <Grid container>
            <Grid item xs={12} sm={12} md={3}>
              <TextField
                label="Search Name or Code"
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
                    active={currentSortBy === 'name'}
                    direction={currentSortBy === 'name' ? currentSortOrder as "asc" | "desc" : undefined}
                    onClick={() => handleSortChange('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={currentSortBy === 'code'}
                    direction={currentSortBy === 'code' ? currentSortOrder as "asc" | "desc" : undefined}
                    onClick={() => handleSortChange('code')}
                  >
                    Code
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFunctionalAreas.map((functionalArea) => (
                <TableRow key={functionalArea.id}>
                  <TableCell>{functionalArea.name}</TableCell>
                  <TableCell>{functionalArea.code}</TableCell>
                  <TableCell align="right">
                    <Grid container spacing={2} display="flex" justifyContent="flex-end" alignItems="center">
                      <Grid item>
                        <Button color="secondary" size='small' onClick={() => handleEdit(functionalArea.id)}>
                          <CreateIcon />
                        </Button>
                      </Grid>
                      <Grid item>
                        <DeleteFunctionalAreaButton functionalAreaId={functionalArea.id} onDeleteSuccess={handleDeleteSuccess}/>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PageContainer>
      {totalCount === 0 && <p>No functional areas found</p>}
      {totalCount > 0 && 
        <Grid container display="flex" alignItems='center' mt={4}>
          <Grid item xs={6}>
            {currentPage * pageSize + 1 - 10} to {(currentPage + 1) * pageSize - 10}  of {totalCount} items
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

export default FunctionalAreaList;
