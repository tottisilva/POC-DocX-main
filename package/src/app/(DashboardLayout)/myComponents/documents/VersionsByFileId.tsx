'use client'
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  IconButton,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PdfViewer from "./DocumentViewer";
import DownloadIcon from '@mui/icons-material/Download';
import LoadingComponent from "../../layout/loading/Loading";

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
};

type DocumentVersion = {
  id: number;
  url: string;
  version: number;
  document: Document[];
  documentId: number | null;
  user: {
    id: number;
    name: string;
  } | null;
  createdAt: Date;
}

interface DocumentsTableProps {
  documentId: number | null;
}


const VersionsTable: React.FC<DocumentsTableProps> = ({ documentId }) => {
  const [url, setUrl] = useState<string>('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [version, setVersions] = useState<DocumentVersion[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(true);

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


  const router = useRouter();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        if (!documentId) return;
  
        let url = "/api/documentVersions/getVersionsByDocumentId";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ documentId }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
  
        const data: DocumentVersion[] = await response.json();
        setVersions(data);
      
      } catch (error) {
        console.error("Fetch documents error:", error);
        setSnackbarMessage("Failed to fetch documents");
        setOpenSnackbar(true);
        setDocuments([]); // Set documents to empty array on error
      } finally {
        setLoading(false);
      }
    };
  
    fetchDocuments();
  }, [documentId]); // Fetch documents whenever documentId changes

  const handleDownload = (versionUrl: string) => {
    const downloadUrl = versionUrl;
    window.location.href = downloadUrl;
  };

  if (loading) {
    return <LoadingComponent />
  }
  
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
          severity="error"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
          <Grid item xs={12} sm={12} md={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Version</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {version.length > 0 ? (
                    version.map((version) => (
                    <TableRow key={version.id}>
                        <TableCell>{version.version}</TableCell>
                        <TableCell>{version.url}</TableCell>
                        <TableCell>{version.user?.name}</TableCell>
                        <TableCell>{dateFormatter(version.createdAt)}</TableCell>
                        <TableCell align="right">
                          <IconButton edge="end" aria-label="download" onClick={() => handleDownload(version.url)}>
                            <DownloadIcon />
                          </IconButton>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={2}>No documents found.</TableCell>
                    </TableRow>
                )}
                </TableBody>
              </Table>
            </TableContainer>
        </Grid>
        <Box mt={4}>
          {url && <PdfViewer fileUrl={url} />}
        </Box>
    </>
  );
};

export default VersionsTable;

