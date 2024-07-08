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
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PdfViewer from "./DocumentViewer";

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
  version: number;
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

interface FunctionalArea {
    id: number;
    name: string;
  }

interface DocumentsTableProps {
  trainingStepId: number | null;
}

interface PdfViewerProps {
  fileUrl: string;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({ trainingStepId }) => {
  const [url, setUrl] = useState<string>('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        if (!trainingStepId) return;
  
        let url = "/api/documents/getDocumentByTrainingId";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trainingStepId }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
  
        const data: Document[] = await response.json();
        setDocuments(data);
        
        // Set URL to the first document's file URL or any relevant logic
        if (data.length > 0) {
          setUrl(data[0].fileUrl);
        }
      } catch (error) {
        console.error("Fetch documents error:", error);
        setSnackbarMessage("Failed to fetch documents");
        setOpenSnackbar(true);
        setDocuments([]); // Set documents to empty array on error
      }
    };
  
    fetchDocuments();
  }, [trainingStepId]); // Fetch documents whenever trainingStepId changes
  
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
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Functional Area</TableCell>
                    <TableCell>Group Name</TableCell>
                    <TableCell>File</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {documents.length > 0 ? (
                    documents.map((doc) => (
                    <TableRow key={doc.id}>
                        <TableCell>{doc.title}</TableCell>
                        <TableCell>{doc.description}</TableCell>
                        <TableCell>{doc.functionalArea?.name || "-"}</TableCell>
                        <TableCell>{doc.groupNames?.name || "-"}</TableCell>
                        <TableCell>
                          <Link href={`${doc.fileUrl}`}>{doc.fileUrl || "-"}</Link>
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

export default DocumentsTable;
