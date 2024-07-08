import React, { useState, useEffect, ChangeEvent } from 'react';
import { TextField, Snackbar, Card, Box, LinearProgress, Button, Typography, MenuItem, Select, FormControl, InputLabel, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MuiAlert from '@mui/material/Alert';

interface FunctionalArea {
  id: string;
  name: string;
}

interface GroupName {
  id: string;
  name: string;
}

const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [functionalAreas, setFunctionalAreas] = useState<FunctionalArea[]>([]);
  const [groupNames, setGroupNames] = useState<GroupName[]>([]);
  const [selectedFunctionalArea, setSelectedFunctionalArea] = useState<string>('');
  const [selectedGroupName, setSelectedGroupName] = useState<string>('');
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState('');
  const [versionId, setVersionId] = useState<string>(''); // State for storing versionId
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [status, session]);

  useEffect(() => {
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
      }
    };

    fetchFunctionalAreas();
    fetchGroupNames();
  }, []);

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !title || !description || !selectedFunctionalArea || !selectedGroupName) {
      console.error("Please fill in all required fields.");
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;

    }
  
    // Get pre-signed URL for S3 upload
    const presignedUrlResponse = await getPresignedUrl(file.name, file.type);
    if (!presignedUrlResponse || !presignedUrlResponse.url) {
      alert('Failed to get pre-signed URL');
      setUploading(false);
      return;
    }
    const { url, versionId: presignedVersionId } = presignedUrlResponse;
  
    // Upload file to S3 using the pre-signed URL
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
  
    try {
      setUploading(true);
  
      // Fetch latest versionId
      const latestVersionId = await fetchLatestVersionId(file.name);
      if (!latestVersionId) {
        alert('Failed to fetch latest versionId');
        setUploading(false);
        return;
      }
  
      // Create document record in the database
      const formData = new FormData();
      formData.append('title', title);
      formData.append('fileUrl', `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.name}?versionId=${latestVersionId}`);
      formData.append('description', description);
      formData.append('functionalAreaId', selectedFunctionalArea);
      formData.append('groupNameId', selectedGroupName);
      formData.append('userId', session?.user?.id ?? '');
  
      const res = await fetch('/api/documents/uploadDocuments', {
        method: 'POST',
        body: formData,
      });
  
      if (!res.ok) {
        throw new Error(`Failed to create document: ${await res.text()}`);

      }
  
      const { document } = await res.json();
      if (!document || !document.id) {
        throw new Error('Failed to get documentId');
        const errorData = await res.json();
        setSnackbarMessage(errorData.error || 'Failed to get documentId');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
  
      // Create version for the document
      const createVersionRes = await fetch('/api/documentVersions/addDocumentVersion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: document.id,
          fileUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.name}?versionId=${latestVersionId}`,
          userId: parseInt(userId, 10),
        }),
      });
  
      if (!createVersionRes.ok) {
        throw new Error(`Failed to create document version: ${await createVersionRes.text()}`);
      }
  
      setUploadedFileName(document.title);
      setUploadProgress(0);
      setUploading(false);
      setSnackbarMessage('Document created successfully.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push('/Documents'); // Redirect after 1200 milliseconds
      }, 1200);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploading(false);
      alert('Failed to upload file');
      setSnackbarMessage('Failed to upload file.');
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
      <Card sx={{ p: 3 }}>
        <Typography component="h1" variant="h5" mb={1}> Detail </Typography>
        <form onSubmit={onSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Grid container>
              <Grid xs={12} sm={6} pr={1}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor="functional-area">Functional Area</InputLabel>
                  <Select
                    label="Functional Area"
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
              <Grid xs={12} sm={6} pl={1}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor="group-name">Group Name</InputLabel>
                  <Select
                    label="Group Name"
                    value={selectedGroupName}
                    onChange={(e) => setSelectedGroupName(e.target.value as string)}
                    required
                  >
                    {groupNames.map((groupName) => (
                      <MenuItem key={groupName.id} value={groupName.id}>
                        {groupName.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={12} sm={6} pr={1}>
                <TextField
                  type="file"
                  label="Select File"
                  onChange={handleFileChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ inputProps: { accept: '.pdf,.doc,.docx,.txt' } }}
                  required
                />
              </Grid>
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
            {uploading && (
              <LinearProgress variant="determinate" value={uploadProgress} />
            )}
            {uploadedFileName && (
              <Typography variant="body1" mt={2}>
                Uploaded: {uploadedFileName}
              </Typography>
            )}
          </Box>
        </form>
      </Card>
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

export default UploadForm;
