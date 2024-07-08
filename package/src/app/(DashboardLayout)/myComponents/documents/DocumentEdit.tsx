'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Typography, Box, Card, TextField, Button, Grid, Snackbar, MenuItem, Select, FormControl, InputLabel, Tabs, Tab, LinearProgress } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import { useSession } from 'next-auth/react';
import VersionsTab from './VersionsByFileId';
import DocumentAuditLogTable from './DocumentAuditLogTable';

const CustomTabPanel: React.FC<{ children?: React.ReactNode; index: number; value: number }> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const EditDocumentForm: React.FC = () => {
  const [id, setId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploadDate, setUploadDate] = useState<Dayjs | null>(null);
  const [selectedFunctionalArea, setSelectedFunctionalArea] = useState<string>('');
  const [selectedGroupName, setSelectedGroupName] = useState<string>('');
  const [functionalAreas, setFunctionalAreas] = useState<{ id: string; name: string }[]>([]);
  const [groupNames, setGroupNames] = useState<{ id: string; name: string }[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get('id');
  const [userId, setUserId] = useState('');
  const { data: session, status } = useSession();
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [value, setValue] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (documentId) {
      fetchDocument();
    }
    fetchFunctionalAreas();
    fetchGroupNames();
  }, [documentId]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}`);
      if (response.ok) {
        const data = await response.json();
        setId(data.id);
        setTitle(data.title);
        setDescription(data.description);
        setUploadDate(dayjs(data.uploadDate));
        setSelectedFunctionalArea(data.functionalAreaId);
        setSelectedGroupName(data.groupNameId);
        setUrl(data.fileUrl)
      } else {
        console.error('Failed to fetch document details');
      }
    } catch (error) {
      console.error('Fetch document error:', error);
    }
  };

  const fetchFunctionalAreas = async () => {
    try {
      const response = await fetch('/api/functionalArea/getFunctionalAreas');
      if (response.ok) {
        const data = await response.json();
        setFunctionalAreas(data);
      } else {
        console.error('Failed to fetch functional areas');
      }
    } catch (error) {
      console.error('Fetch functional areas error:', error);
    }
  };

  const fetchGroupNames = async () => {
    try {
      const response = await fetch('/api/groupName/getGroupNames');
      if (response.ok) {
        const data = await response.json();
        setGroupNames(data);
      } else {
        console.error('Failed to fetch group names');
      }
    } catch (error) {
      console.error('Fetch group names error:', error);
    }
  };

  const getPresignedUrl = async (fileName: string, fileType: string) => {
    try {
      const response = await fetch(`/api/getPresignedUrl?fileName=${encodeURIComponent(fileName)}&fileType=${encodeURIComponent(fileType)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pre-signed URL');
      }
      const data = await response.json();
      return { url: data.url, versionId: data.versionId };
    } catch (error) {
      console.error('Error fetching pre-signed URL:', error);
      return null;
    }
  };  

  const fetchLatestVersionId = async (fileName: string) => {
    try {
      const response = await fetch(`/api/documentVersions/getLatestVersionId?fileName=${encodeURIComponent(fileName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch latest versionId');
      }
      const data = await response.json();
      return data.versionId;
    } catch (error) {
      console.error('Error fetching latest versionId:', error);
      return null;
    }
  };  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !title || !description || !selectedFunctionalArea || !selectedGroupName) {
      console.error('Please fill in all required fields and upload a file.');
      return;
    }
    if (!userId) {
      console.error('UserId is not set');
      setSnackbarMessage('Failed to get userId');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      // Step 3: Update document record in database
      const updateResponse = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title,
          description,
          uploadDate: uploadDate?.toISOString(),
          functionalAreaId: selectedFunctionalArea,
          groupNameId: selectedGroupName,
          userId: parseInt(userId, 10),
        }),
      });

      if (!updateResponse.ok) {
        console.error('Failed to update document');
        setSnackbarMessage('Failed to update document.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      console.log('Document updated successfully');
      setSnackbarMessage('Document updated successfully.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push('/Documents'); // Redirect after 1200 milliseconds
      }, 1200);

    } catch (error) {
      console.error('Submit error:', error);
      setSnackbarMessage('An error occurred while updating the document.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Grid container spacing={2} mb={5} mt={2}>
        <Grid item xs={12} md={8}>
          <Typography component="h1" variant="h1">
            Edit Document
          </Typography>
        </Grid>
      </Grid>

      <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
        <Tab label="Details" />
        <Tab label="Versions" />
        <Tab label="Audit Log" />
      </Tabs>

      <Box mt={2}>
        <CustomTabPanel value={value} index={0}>
          <Card sx={{ p: 3 }}>
            <Typography component="h1" variant="h5" mb={2}> Detail </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="functional-area-label">Functional Area</InputLabel>
                    <Select
                      labelId="functional-area-label"
                      value={selectedFunctionalArea}
                      onChange={(e) => setSelectedFunctionalArea(e.target.value as string)}
                      required
                    >
                      {functionalAreas.map((area) => (
                        <MenuItem key={area.id} value={area.id}>
                          {area.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="group-name-label">Group Name</InputLabel>
                    <Select
                      labelId="group-name-label"
                      value={selectedGroupName}
                      onChange={(e) => setSelectedGroupName(e.target.value as string)}
                      required
                    >
                      {groupNames.map((group) => (
                        <MenuItem key={group.id} value={group.id}>
                          {group.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid
                container
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                mt={2}
                display={"flex"}
                justifyContent={"flex-end"}
              >
                <Grid xs={0} md={7}></Grid>
                <Grid container display={"flex"} justifyContent={"flex-end"}>
                  <Grid item xs={6} md={2} pr={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      href="/Documents"
                      color="inherit"
                    >
                      Back
                    </Button>
                  </Grid>
                  <Grid xs={6} md={2} pl={1}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Save
                  </Button>
                  </Grid>
                </Grid>
              </Grid>
              </Grid>
              {uploading && (
              <LinearProgress variant="determinate" value={uploadProgress} />
            )}
            {uploadedFileName && (
              <Typography variant="body1" mt={2}>
                Uploaded: {uploadedFileName}
              </Typography>
            )}
            </form>
          </Card>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <VersionsTab documentId={id}  />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <DocumentAuditLogTable documentId={id}  />
        </CustomTabPanel>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert 
        sx={{ color: 'white' }}
        elevation={6}
        variant="filled"
        onClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default EditDocumentForm;
