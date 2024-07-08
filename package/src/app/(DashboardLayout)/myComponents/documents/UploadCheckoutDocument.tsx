'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Typography, Box, Card, TextField, Button, Grid, Snackbar, MenuItem, Select, FormControl, InputLabel, Tabs, Tab, LinearProgress } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';


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

interface DocumentProps {
  documentId: number | null;
  onDrawerClose: () => void;
}

const DocumentCheckIn: React.FC<DocumentProps> = ({documentId, onDrawerClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const { data: session, status } = useSession();
 
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session]);

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
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!documentId || !file) {
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
  
    setUploading(true);
    // Step 1: Get presigned URL and versionId
    const presignedUrlResponse = await getPresignedUrl(file.name, file.type);
    if (!presignedUrlResponse || !presignedUrlResponse.url) {
      alert('Failed to get pre-signed URL');
      setUploading(false);
      return;
    }
  
    const { url, versionId: presignedVersionId } = presignedUrlResponse;
  
    try {
      // Step 2: Upload file to S3 using presigned URL
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });
  
      // Step 3: Fetch latest versionId
      const latestVersionId = await fetchLatestVersionId(file.name);
      if (!latestVersionId) {
        alert('Failed to fetch latest versionId');
        setUploading(false);
        return;
      }
  
      console.log('File uploaded successfully');
  
      // Step 4: Update document record in database
      const updateResponse = await fetch(`/api/documents/documentCheckIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: documentId,
          userId: parseInt(userId, 10),
          fileUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.name}?versionId=${latestVersionId}`,
        }),
      });
  
      if (!updateResponse.ok) {
        console.error('Failed to update document');
        return;
      }
  
      console.log('Document updated successfully');
  
      // Step 5: Create a new document version
      const addVersionResponse = await fetch('/api/documentVersions/addDocumentVersion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          fileUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.name}?versionId=${latestVersionId}`,
          userId: parseInt(userId, 10)
        }),
      });
  
      if (!addVersionResponse.ok) {
        console.error('Failed to update document version');
        setSnackbarMessage('Failed to update document version.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }
  
      console.log('Document and version updated successfully');
      setUploadProgress(0);
      setUploading(false);
  
      setSnackbarMessage('Document updated successfully.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        onDrawerClose();
        router.push('/Documents'); // Redirect after 1200 milliseconds
      }, 1200);
    } catch (error) {
      console.error('Submit error:', error);
      setSnackbarMessage('Failed to update document');
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
      <Box py={3}>
        <Typography component="h1" variant="h5"> CheckIn Document </Typography>
            <form onSubmit={handleSubmit}>
                <Grid item xs={12} sm={6} mt={2}>
                  <TextField
                    type="file"
                    label="Select File"
                    onChange={handleFileChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    InputProps={{ inputProps: { accept: '.pdf,.doc,.docx,.txt' } }}
                    required
                  />
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
  
                  <Grid xs={6} md={2} pl={1}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Save
                  </Button>
                  </Grid>
                </Grid>
              </Grid>
              
              </form>
              <Box mt={2}>
                  {uploading && (
                    <LinearProgress variant="determinate" value={uploadProgress} />
                  )}
                  {uploadedFileName && (
                    <Typography variant="body1" mt={2}>
                      Uploaded: {uploadedFileName}
                    </Typography>
                  )}
              </Box>
              
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

export default DocumentCheckIn;
