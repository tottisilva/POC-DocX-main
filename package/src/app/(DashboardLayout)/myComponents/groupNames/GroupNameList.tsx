import React, { useState, useEffect } from 'react';
import { TextField, TableSortLabel, Button, Table, Box, TableRow, TableBody, TableCell, TableContainer, TableHead, Paper, Grid, Snackbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MuiAlert from '@mui/material/Alert';
import Pagination from '../tables/pagination';
import { useRouter } from 'next/navigation';
import DeleteGroupNameButton from './DeleteGroupName';
import CreateIcon from '@mui/icons-material/Create';

type GroupName = {
  id: number;
  name: string;
  code: string;
};

type GroupNameListProps = {
  groupNames: GroupName[];
  totalGroupNames: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
};

const GroupNameList: React.FC<GroupNameListProps> = ({ groupNames: initialGroupNames, totalGroupNames: initialTotal, page, pageSize, sortBy, sortOrder }) => {
  const router = useRouter();
  const [groupNames, setGroupNames] = useState<GroupName[]>(initialGroupNames);
  const [totalCount, setTotalCount] = useState<number>(initialTotal);
  const [currentPage, setCurrentPage] = useState(page);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredGroupNames, setFilteredGroupNames] = useState<GroupName[]>(groupNames);
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);
  const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);

  const fetchGroupNames = async () => {
    try {
      const response = await fetch(`/api/groupName/getGroupNamesPaginated?page=${currentPage}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`);
      if (!response.ok) {
        console.error('Failed to fetch group names data');
        return;
      } 
        const data = await response.json();
        setGroupNames(data.groupNames);
        setTotalCount(data.totalCount);
      
    } catch (error) {
      console.error('Error fetching group names:', error);
    }
  };

  const handleSortChange = (column: string) => {
    const newOrder = currentSortBy === column && currentSortOrder === 'asc' ? 'desc' : 'asc';
    setCurrentSortBy(column);
    setCurrentSortOrder(newOrder);
    router.push(`/GroupNames?page=${currentPage}&pageSize=${pageSize}&sortBy=${column}&sortOrder=${newOrder}&searchTerm=${searchTerm}`, undefined);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    router.push(`/GroupNames?page=${currentPage}&pageSize=${pageSize}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}&searchTerm=${event.target.value}`, undefined);

  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`/GroupNames?page=${newPage}&pageSize=${pageSize}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}&searchTerm=${searchTerm}`, undefined);
  };

  const handleEdit = (id: number) => {
    router.push(`/GroupNameEdit?id=${id}`);
  };

  const handleDeleteSuccess = () => {
    fetchGroupNames();
  };

  useEffect(() => {
    const filtered = groupNames.filter(groupName => {
      const name = groupName.name || '';
      const code = groupName.code || '';
      const matchesSearch = searchTerm ? (name.toLowerCase().includes(searchTerm.toLowerCase()) || code.toLowerCase().includes(searchTerm.toLowerCase())) : true;
      return matchesSearch;
    });
    setFilteredGroupNames(filtered);
    setTotalCount(filtered.length);
  }, [searchTerm, groupNames]);

  useEffect(() => {
    fetchGroupNames();
  }, [currentPage, pageSize, currentSortBy, currentSortOrder, searchTerm]);

  return (
    <main>
      <Grid container spacing={2} mb={5} mt={2}>
        <Grid item xs={12} md={8}>
          <div><h1>Group Names</h1></div>
        </Grid>
        <Grid item xs={4} container direction="row" justifyContent="flex-end" alignItems="center">
          <div><Button variant='contained' href="/GroupNameDetail">Add Group Name</Button></div>
        </Grid>
      </Grid>
      <Box mb={2}>
        <Grid container>
          <Grid item xs={12} sm={12} md={3}>
            <TextField
              label="Search Group Name"
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
            {filteredGroupNames.map((groupName) => (
              <TableRow key={groupName.id}>
                <TableCell>{groupName.name}</TableCell>
                <TableCell>{groupName.code}</TableCell>
                <TableCell align="right">
                  <Button color="secondary" size='small' onClick={() => handleEdit(groupName.id)}>
                    <CreateIcon />
                  </Button>
                  <DeleteGroupNameButton groupNameId={groupName.id} onDeleteSuccess={handleDeleteSuccess} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalCount === 0 && <p>No group names found</p>}
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

export default GroupNameList;
