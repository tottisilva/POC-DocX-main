import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Radio
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { SelectChangeEvent } from "@mui/material/Select";

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
  training: {
    id: number;
    name: string;
    documentId: number;
  } | null;
  isAssigned: boolean;
};

interface DocumentsTabProps {
  trainingStepId: number | null;
}

interface FunctionalArea {
  id: number;
  name: string;
}

interface GroupName {
  id: number;
  name: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ trainingStepId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("error");
  const [filterFunctionalArea, setFilterFunctionalArea] = useState<number | null>(null);
  const [functionalAreas, setFunctionalAreas] = useState<FunctionalArea[]>([]);
  const [filterGroupName, setFilterGroupName] = useState<number | null>(null);
  const [groupNames, setGroupNames] = useState<GroupName[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [trainingDetails, setTrainingDetails] = useState<{ id: number; name: string; documentId: number; } | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const fetchTrainingDetails = async () => {
      try {
        if (trainingStepId && selectedDocument === null) { // Add condition to fetch only if selectedDocument is null
          const response = await fetch(`/api/steps/${trainingStepId}`); // Adjust API endpoint as per your actual API
          if (!response.ok) {
            throw new Error("Failed to fetch training details");
          }
          const data: { id: number; name: string; documentId: number } = await response.json();
          setTrainingDetails(data);
          setSelectedDocument(data.documentId);
        }
      } catch (error) {
        console.error("Fetch training details error:", error);
        setSnackbarMessage("Failed to fetch training details");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
  
    const fetchDocuments = async () => {
      try {
        let url = "/api/documents/getDocumentsPaginated";
        const params = new URLSearchParams({
          page: "1",
          pageSize: "10",
          sortBy: "title",
          sortOrder: "asc",
          functionalAreaId: filterFunctionalArea?.toString() || "",
          groupNameId: filterGroupName?.toString() || "",
          trainingStepId: trainingStepId?.toString() || "",
        });
        url += `?${params.toString()}`;
  
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
  
        const data: { documents: Document[] } = await response.json();
        setDocuments(data.documents);
  
        // Filter documents based on search term
        if (searchTerm.trim() !== "") {
          const filtered = data.documents.filter((doc) =>
            doc.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredDocuments(filtered);
        } else {
          setFilteredDocuments(data.documents);
        }
      } catch (error) {
        console.error("Fetch documents error:", error);
        setSnackbarMessage("Failed to fetch documents");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
  
    const fetchFunctionalAreas = async () => {
      try {
        const url = "/api/functionalArea/getFunctionalAreas";
  
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
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
  
    fetchTrainingDetails();
    fetchDocuments();
    fetchFunctionalAreas();
    fetchGroupNames();
  }, [filterFunctionalArea, filterGroupName, searchTerm, trainingStepId]);  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/trainings/addDocumentsToTrainingStep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trainingStepId: trainingStepId,
          documentId: selectedDocument,
          createdBy: 1, // TO DO: Replace with actual user id or use session data
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to assign document to training");
      }
      router.refresh();
      setSnackbarMessage("Document assigned successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error assigning document:", error);
      setSnackbarMessage("Failed to assign document to training");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
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
    router.push(`/Documents?page=1`);
  };

  const isAssignButtonDisabled = trainingDetails?.documentId === selectedDocument;

  const isSelected = (id: number) => selectedDocument === id;

  const handleDocumentSelection = (id: number) => {
    setSelectedDocument(id); // This will update the selected document
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
      <Typography component="h1" variant="h5" mb={1}>
        Assign Document
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
        mt={4}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={4}>
            <TextField
              label="Search by Title"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={8} container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button onClick={handleResetFilter} variant="text" color="primary">
                Reset
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="functional-areas-label">Filter by Functional Area</InputLabel>
                <Select
                  labelId="functional-areas-label"
                  id="functional-areas-filter"
                  value={filterFunctionalArea || ''}
                  onChange={(event) => handleFilterChange(event, 'functionalArea')}
                  fullWidth
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
            <Grid item xs={12} sm={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="group-names-label">Filter by Group Name</InputLabel>
                <Select
                  labelId="group-names-label"
                  id="group-names-filter"
                  value={filterGroupName || ''}
                  onChange={(event) => handleFilterChange(event, 'groupNames')}
                  fullWidth
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
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Select</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Functional Area</TableCell>
                    <TableCell>Group Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <Radio
                        checked={isSelected(doc.id)}
                        onChange={() => handleDocumentSelection(doc.id)}
                      />
                    </TableCell>
                    <TableCell>{doc.title}</TableCell>
                    <TableCell>{doc.functionalArea?.name}</TableCell>
                    <TableCell>{doc.groupNames?.name}</TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" disabled={isAssignButtonDisabled}>
              Assign
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );  
};

export default DocumentsTab;
