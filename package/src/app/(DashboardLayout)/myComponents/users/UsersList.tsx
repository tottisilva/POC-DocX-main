import React, { useState, useEffect } from 'react';
import { TextField, TableSortLabel, Button, Table, Box, TableRow, TableBody, TableCell, TableContainer, TableHead, Paper, Grid, Snackbar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MuiAlert from '@mui/material/Alert';
import Pagination from '../tables/pagination';
import { useRouter } from 'next/navigation';
import DeleteUserButton from './DeleteUser';
import CreateIcon from '@mui/icons-material/Create';
import { SelectChangeEvent } from "@mui/material/Select";


type User = {
  id: number;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: {
    name: string;
  } | null;
};

type UserProps = {
  users: User[];
  totalUsers: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
};

type Role = {
  id: number;
  name: string | null;
};

const UserList: React.FC<UserProps> = ({ users, totalUsers, page, pageSize, sortBy, sortOrder }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(page);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("error");
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);
  const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);
  const [roles, setRoles] = useState<Role[]>([]);
  const [filterRole, setFilterRole] = useState<number | null>(null);

  const handleSortChange = (column: string) => {
    const newOrder = currentSortBy === column && currentSortOrder === 'asc' ? 'desc' : 'asc';
    setCurrentSortBy(column);
    setCurrentSortOrder(newOrder);
    router.push(`/Users?page=${currentPage}&pageSize=${pageSize}&sortBy=${column}&sortOrder=${newOrder}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchUsers(newPage, pageSize, searchTerm, filterRole);
  };

  const handleEdit = (id: number) => {
    router.push(`/UserEdit?id=${id}`);
  };

  const fetchUsers = async (page: number, pageSize: number, name: string, roleId: number | null) => {
    try {
      const response = await fetch(`/api/users/getUsersPaginated?page=${page}&pageSize=${pageSize}&name=${name}&roleId=${roleId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users data');
      }
      const data = await response.json();
      setFilteredUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbarMessage("Failed to fetch users");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles/getRoles");
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      const data: Role[] = await response.json();
      setRoles(data || []);
    } catch (error) {
      console.error("Fetch roles error:", error);
      setSnackbarMessage("Failed to fetch roles");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteSuccess = () => {
    fetchUsers(currentPage, pageSize, searchTerm, filterRole);
  };

  useEffect(() => {
    const filtered = users.filter(user => {
      const name = user.name || '';
      const matchesSearch = searchTerm ? name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchesRole = filterRole ? user.role?.name === roles.find(role => role.id === filterRole)?.name : true;
      return matchesSearch && matchesRole;
    });
    setFilteredUsers(filtered);
  }, [searchTerm, filterRole, users, roles]);

  useEffect(() => {
    setCurrentPage(page);
    fetchRoles();
  }, [page]);

  const handleFilterChange = (event: SelectChangeEvent<string | number>, filterType: string) => {
    const value = event.target.value;
    setFilterRole(value === '' ? null : Number(value));
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterRole(null);
    fetchUsers(currentPage, pageSize, '', null);
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
          <div><h1>Users</h1></div>
        </Grid>
        <Grid item xs={4} container direction="row" justifyContent="flex-end" alignItems="center">
          <div><Button variant='contained' href="/UserDetail">Add User</Button></div>
        </Grid>
      </Grid>
      <Box mb={2}>
      <Grid container spacing={2} display="flex" justifyContent="space-between">
      <Grid item xs={12} sm={12} md={3}>
      <TextField
              label="Search Name"
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
          <Button onClick={handleResetFilters} style={{ height: '53.13px' }}>Reset</Button>
          <Grid>
          <FormControl style={{ minWidth: 218 }}>
          <InputLabel id="role-filter-label">Filter by Role</InputLabel>
              <Select
                labelId="role-filter-label"
                id="role-filter"
                value={filterRole || ''}
                onChange={(event) => handleFilterChange(event, 'functionalArea')}
                label="Filter by Role"
              >
                <MenuItem value={0}>All</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </Grid>
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
                  active={currentSortBy === 'email'}
                  direction={currentSortBy === 'email' ? currentSortOrder as "asc" | "desc" : undefined}
                  onClick={() => handleSortChange('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={currentSortBy === 'roleId'}
                  direction={currentSortBy === 'roleId' ? currentSortOrder as "asc" | "desc" : undefined}
                  onClick={() => handleSortChange('roleId')}
                >
                  Role
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
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role?.name ?? 'N/A'}</TableCell>
                <TableCell>{dateFormatter(user.createdAt)}</TableCell>
                <TableCell align="right">
                  <Button color="secondary" size='small' onClick={() => handleEdit(user.id)}>
                    <CreateIcon />
                  </Button>
                  <DeleteUserButton userId={user.id} onDeleteSuccess={handleDeleteSuccess} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalUsers === 0 && <p>No users found</p>}
      {totalUsers > 0 &&
        <Grid container display="flex" alignItems='center' mt={4}>
          <Grid item xs={6}>
          {currentPage * pageSize + 1 - 10} to {(currentPage + 1) * pageSize - 10} of {totalUsers} items
          </Grid>
          <Grid item xs={6} display="flex" justifyContent="flex-end">
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={totalUsers}
              onPageChange={handlePageChange}
            />
          </Grid>
        </Grid>}
    </main>
  );
};

export default UserList;
