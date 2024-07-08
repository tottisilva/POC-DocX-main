import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Button, TableSortLabel, TextField, Box, Snackbar } from '@mui/material';
import DeleteRoleButton from './DeleteRole';
import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '../tables/pagination';
import { useRouter } from 'next/navigation';
import MuiAlert from '@mui/material/Alert';

type Role = {
  id: number;
  name: string | null;
};

type RoleProps = {
  roles: Role[];
totalRoles: number;
  page: number; 
  pageSize: number;
  sortBy: string;
  sortOrder: string;
};

const RolesList: React.FC<RoleProps> = ({ roles: initialRoles, totalRoles: initialTotal, page, pageSize, sortBy, sortOrder }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(page);
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);
  const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [totalCount, setTotalCount] = useState<number>(initialTotal);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredRoles, setFilteredRoles] = useState<Role[]>(initialRoles);


  const fetchRoles = async () => {
    try {
      const response = await fetch(`/api/roles/getRolesPaginated?page=${currentPage}&pageSize=${pageSize}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}&name=${searchTerm}`);
      if (!response.ok) {
        console.error('Failed to fetch roles data');
        return; 
      } 
       const data = await response.json();
        setRoles(data.roles);
        setTotalCount(data.totalRoles);  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSortChange = (column: string) => {
    const newOrder = currentSortBy === column && currentSortOrder === 'asc' ? 'desc' : 'asc';
    setCurrentSortBy(column);
    setCurrentSortOrder(newOrder);
    router.push(`/Roles?page=${currentPage}&pageSize=${pageSize}&sortBy=${column}&sortOrder=${newOrder}&name=${searchTerm}`, undefined);
  }

  const handleEdit = (id: number) => {
    router.push(`/RoleEdit?id=${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`/Roles?page=${newPage}&pageSize=${pageSize}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}&name=${searchTerm}`, undefined);
  };

  const handleDeleteSuccess = () => {
    fetchRoles();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    router.push(`/Roles?page=${currentPage}&pageSize=${pageSize}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}&name=${event.target.value}`, undefined);
  };  
    
  useEffect(() => {
    fetchRoles();
  }, [currentPage, pageSize, currentSortBy, currentSortOrder, searchTerm]);


  useEffect(() => {
    const filtered = roles.filter(role => {
      const name = role.name || '';
      return searchTerm ? name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    });
    setFilteredRoles(filtered);
    setTotalCount(filtered.length);
  }, [searchTerm, roles]);


  return (
    <main>
      <Grid container spacing={2} mb={5} mt={2}>
        <Grid item xs={12} md={8}>
          <div><h1>Roles</h1></div>
        </Grid>
        <Grid item container xs={12} md={4} gap={2} direction="row" justifyContent="flex-end" alignItems="center">
          <Grid item xs={12} md="auto">
            <Button variant='contained' href={'/RoleDetail'}>Add Role</Button>
          </Grid>
        </Grid>
      </Grid>
      <Box mb={2}>
        <Grid container>
          <Grid item xs={12} sm={12} md={3}>
            <TextField
              label="Search Role"
              variant="outlined"
              value={searchTerm}
              fullWidth
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: <SearchIcon />
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <TableContainer component={Paper}>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
            mt: 2,
            width: '100%'
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={currentSortBy === 'name'}
                  direction={currentSortBy === 'name' ? currentSortOrder as "asc" | "desc" : undefined}
                  onClick={() => handleSortChange('name')}
                >
                  Role
                </TableSortLabel>
              </TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell align='right'>
                  <Grid container spacing={2} display="flex" justifyContent="flex-end" alignItems="center">
                    <Grid item>
                      <Button size='small' color="secondary" onClick={() => handleEdit(role.id)}>
                        <CreateIcon />
                      </Button>
                    </Grid>
                    <Grid item>
                      <DeleteRoleButton roleId={role.id} onDeleteSuccess={handleDeleteSuccess} />
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalCount === 0 && <p>No roles found</p>}
      {totalCount > 0 &&
        <Grid container spacing={2} display="flex" alignItems='center' mt={2}>
          <Grid item xs={4} md={6} >
          {currentPage * pageSize + 1 - 10} to {(currentPage + 1) * pageSize - 10} of {totalCount} items
          </Grid>
          <Grid item xs={8} md={6} display="flex" justifyContent="flex-end">
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

export default RolesList;
