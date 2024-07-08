import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Menu,
  TextField, Paper, Link, Drawer, IconButton,
  TableSortLabel
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { SelectChangeEvent } from "@mui/material/Select";
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PublishIcon from '@mui/icons-material/Publish';
import GetAppIcon from '@mui/icons-material/GetApp';
import DocumentCheckIn from "./UploadCheckoutDocument";
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { useSession } from "next-auth/react";
import Pagination from "../tables/pagination";

type Document = {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  user: {
    name: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
  versions: {
    id: number;
    fileUrl: string;
    version: number;
  }[];
  functionalAreaId: number | null;
  functionalArea: {
    id: number;
    name: string;
  } | null;
  groupNames: {
    id: number;
    name: string;
  } | null;
  isCheckedOut: Boolean;
};

interface FunctionalArea {
  id: number;
  name: string;
}

interface GroupName {
  id: number;
  name: string;
}

interface DocumentListProps {
  documents: Document[];
  totalDocuments: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
}


const DocumentsTab: React.FC<DocumentListProps> = ({ page, pageSize, sortBy, sortOrder }) => {
  const [id, setId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("error");
  const [filterFunctionalArea, setFilterFunctionalArea] = useState<number | null>(null);
  const [filterGroupName, setFilterGroupName] = useState<number | null>(null);
  const [functionalAreas, setFunctionalAreas] = useState<FunctionalArea[]>([]);
  const [groupNames, setGroupNames] = useState<GroupName[]>([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalCount, setTotalCount] = useState<number>(totalDocuments);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);
  const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);  // State to manage Drawer
  const [anchorElMap, setAnchorElMap] = useState<{ [key: number]: HTMLElement | null }>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userId, setUserId] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, pageSize, currentSortBy, currentSortOrder, searchTerm]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/documents/getDocumentsPaginated?page=${currentPage}&pageSize=${pageSize}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`);
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      const data = await response.json();
      setDocuments(data.documents);
      filterDocuments(data.documents, searchTerm);
      setTotalDocuments(data.totalDocuments)
    } catch (error) {
      console.error("Fetch documents error:", error);
      setSnackbarMessage("Failed to fetch documents");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

    const fetchFunctionalAreas = async () => {
      try {
        const response = await fetch("/api/functionalArea/getFunctionalAreas");
        if (!response.ok) {
          throw new Error("Failed to fetch functional areas");
        }
        const data: FunctionalArea[] = await response.json();
        setFunctionalAreas(data || []);
      } catch (error) {
        console.error("Fetch functional areas error:", error);
        setSnackbarMessage("Failed to fetch functional areas");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };

    const fetchGroupNames = async () => {
      try {
        const response = await fetch("/api/groupName/getGroupNames");
        if (!response.ok) {
          throw new Error("Failed to fetch group names");
        }
        const data: GroupName[] = await response.json();
        setGroupNames(data || []);
      } catch (error) {
        console.error("Fetch group names error:", error);
        setSnackbarMessage("Failed to fetch group names");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    
    const filterDocuments = (documents: Document[], searchTerm: string) => {
      if (searchTerm.trim() !== '') {
        const filtered = documents.filter(doc =>
          doc.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredDocuments(filtered);
      } else {
        setFilteredDocuments(documents);
      }
    };
    
    const handleSortChange = (column: string) => {
      const newOrder = currentSortBy === column && currentSortOrder === 'asc' ? 'desc' : 'asc';
      setCurrentSortBy(column);
      setCurrentSortOrder(newOrder);
      router.push(`/documents/getDocumentsPaginated?page=${currentPage}&pageSize=${pageSize}&sortBy=${column}&sortOrder=${newOrder}`);
    };
  
    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
      router.push(`/Documents?page=${newPage}&pageSize=${pageSize}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`);
      fetchDocuments();
    };
  
    const handleFilterChange = (event: SelectChangeEvent<string | number>, filterType: string) => {
      const value = event.target.value;
      if (filterType === 'functionalArea') {
        setFilterFunctionalArea(value === '' ? null : Number(value));
      } else if (filterType === 'groupNames') {
        setFilterGroupName(value === '' ? null : Number(value));
      }
    };
  
    const handleResetFilter = () => {
      setFilterFunctionalArea(null);
      setFilterGroupName(null);
      setFunctionalAreas([]);
      setGroupNames([]);
      setSearchTerm('');
      router.push(`/Documents?page=1`);
    };


  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session]);

  // Function to handle the opening of the menu
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, documentId: number) => {
    setAnchorElMap((prev) => ({ ...prev, [documentId]: event.currentTarget }));
  };

  // Function to handle the closing of the menu
  const handleClose = (documentId: number) => {
    setAnchorElMap((prev) => ({ ...prev, [documentId]: null }));
    router.push('/Documents');
  };

  const openDrawer = (documentId: number, name: string) => (event: React.KeyboardEvent | React.MouseEvent) => {
    setId(documentId);
    setDrawerOpen(true);
    handleClose(documentId);
  };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (!open) {
        setId(null);  // Reset id when drawer is closed
      }
      setDrawerOpen(open);
    };

  useEffect(() => {
    filterDocuments(documents, searchTerm);
  }, [searchTerm, documents]);


  const handleEdit = (id: number) => {
    router.push(`DocumentEdit?id=${id}`);
  };


  const getCurrentVersion = (versions: { id: number; fileUrl: string; version: number }[]) => {
    if (versions.length === 0) return "N/A";
    return versions.reduce((latest, version) => {
      return version.version > latest.version ? version : latest;
    }).version;
  };

  const handleDownload = async (documentId: number, fileUrl: string) => {
    if (!documentId || !fileUrl) {
      console.error('Please provide a valid document ID and file URL.');
      return;
    }
  
    try {
      const updateResponse = await fetch(`/api/documents/documentCheckOut`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: documentId,
          userId: userId
        }),
      });
  
      if (!updateResponse.ok) {
        console.error('Failed to update document');
        return;
      }
  
      // Fetch the file from S3 using a server-side route
      const downloadResponse = await fetch(`/api/documents/downloadS3File?url=${encodeURIComponent(fileUrl)}`, {
        method: 'GET',
      });
  
      if (!downloadResponse.ok) {
        console.error('Failed to download file');
        return;
      }
  
     // Extract the filename from the URL
    let filenameWithQuery = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    let filename = filenameWithQuery.split('?')[0];

    console.log('Filename:', filename);

    // Assuming you have a response object from a fetch call
    // Trigger the download on the client side
    const blob = await downloadResponse.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Set the download attribute with the extracted file name
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  
      setSnackbarMessage("File downloaded successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("File download error:", error);
      setSnackbarMessage("Failed to download file");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  
    handleClose(documentId);
  };  

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <>
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
          <Typography component="h1" variant="h1">
            Documents
          </Typography>
        </Grid>
        <Grid item container xs={12} md={4} gap={2} direction="row" justifyContent="flex-end" alignItems="center">
          <Grid xs={12} md="auto">
            <Button variant='contained' href={'/DocumentDetail'}>Add Document</Button>
          </Grid>
        </Grid>
      </Grid>
      <Box mb={2}>
        <Grid container>
          <Grid item xs={12} sm={12} md={4}>
            <TextField
              label="Search by Title"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon />
              }}
            />
          </Grid>
          <Grid xs={12} sm={12} md={8} container gap={1} direction="row" display="flex" justifyContent="flex-end" alignItems="center" alignContent="center">
            <Button onClick={handleResetFilter} style={{ height: '53.13px' }}>Reset</Button>
            <Grid >
              <FormControl style={{ minWidth: 218 }}>
                <InputLabel id="functional-areas-label">Filter by Functional Area</InputLabel>
                <Select
                  labelId="functional-areas-label"
                  id="functional-areas-filter"
                  value={filterFunctionalArea || ''}
                  onChange={(event) => handleFilterChange(event, 'functionalArea')}
                >
                  <MenuItem value="">All</MenuItem>
                  {functionalAreas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid pl={1}>
              <FormControl style={{ minWidth: 218 }}>
                <InputLabel id="group-names-label">Filter by Group Name</InputLabel>
                <Select
                  labelId="group-names-label"
                  id="group-names-filter"
                  value={filterGroupName || ''}
                  onChange={(event) => handleFilterChange(event, 'groupNames')}
                >
                  <MenuItem value="">All</MenuItem>
                  {groupNames.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4} md={3}></Grid>
        <Grid item xs={12} sm={4} md={3}></Grid>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>
                  <TableSortLabel
                    active={currentSortBy === 'title'}
                    direction={currentSortOrder as 'asc' | 'desc'}
                    onClick={() => handleSortChange('title')}
                  >
                    Title
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
                    active={currentSortBy === 'functionalAreaId'}
                    direction={currentSortOrder as 'asc' | 'desc'}
                    onClick={() => handleSortChange('functionalAreaId')}
                  >
                    Functional Area
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={currentSortBy === 'groupNameId'}
                    direction={currentSortOrder as 'asc' | 'desc'}
                    onClick={() => handleSortChange('groupNameId')}
                  >
                    Group Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Is Checked Out</TableCell>
                <TableCell>Current Version</TableCell>
                <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocuments.map((document) => (
              <TableRow key={document.id} hover>
                <TableCell>{document.title}</TableCell>
                <TableCell>
                  <Link href={`${document.fileUrl}`}>
                    {document.fileUrl ? `${document.fileUrl.slice(0, 50)}${document.fileUrl.length > 50 ? '...' : ''}` : "N/A"}
                  </Link>
                </TableCell>
                <TableCell>{document.functionalArea?.name || "N/A"}</TableCell>
                <TableCell>{document.groupNames?.name || "N/A"}</TableCell>
                <TableCell>{document.isCheckedOut ? <CheckIcon /> : ''}</TableCell>
                <TableCell>{getCurrentVersion(document.versions)}</TableCell>
                <TableCell align='right'>
                  <Button
                    id="basic-button"
                    aria-controls={anchorElMap[document.id] ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={anchorElMap[document.id] ? 'true' : undefined}
                    onClick={(event) => handleClick(event, document.id)}
                  >
                    <MoreHorizIcon />
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorElMap[document.id]}
                    open={Boolean(anchorElMap[document.id])}
                    onClose={() => handleClose(document.id)}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={() => handleEdit(document.id)}>
                      <IconButton size='small' color="secondary" sx={{fontSize:'12px'}}>
                        <CreateIcon /> <Box ml={1}>Details</Box>
                      </IconButton>
                    </MenuItem>
                    {document.isCheckedOut && (
                      <MenuItem onClick={openDrawer(document.id, document.description)}>
                        <IconButton size='small' color="secondary" sx={{fontSize:'12px'}}>
                          <PublishIcon /> <Box ml={1}>Check in Document</Box>
                        </IconButton>
                      </MenuItem>
                    )}
                    {!document.isCheckedOut && (
                      <MenuItem onClick={() => handleDownload(document.id, document.fileUrl)}>
                        <IconButton href={document.fileUrl} download target="_blank" size='small' color="secondary" sx={{fontSize:'12px'}}>
                          <GetAppIcon /> <Box ml={1}>Check out Document</Box>
                        </IconButton>
                      </MenuItem>
                    )}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalDocuments === 0 && <p>No trainings found</p>}
      {totalDocuments > 0 &&
        <Grid container display="flex" alignItems='center' mt={4}>
          <Grid item xs={6}>
            {`1 to ${Math.min(currentPage * pageSize, totalDocuments)} of ${totalDocuments} items`}
          </Grid>
          <Grid item xs={6} display="flex" justifyContent="flex-end">
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={totalDocuments}
              onPageChange={handlePageChange}
            />
          </Grid>
        </Grid>
      }
      </Box>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 500, p: 3 }}
          role="presentation"
          >
          <Grid container display="flex" justifyContent="flex-end">
            <Grid><IconButton onClick={toggleDrawer(false)}><ClearIcon/></IconButton></Grid>
          </Grid>
          <DocumentCheckIn documentId={id} onDrawerClose={handleDrawerClose}/>
        </Box>
      </Drawer>
    </>
  );
};

export default DocumentsTab;
