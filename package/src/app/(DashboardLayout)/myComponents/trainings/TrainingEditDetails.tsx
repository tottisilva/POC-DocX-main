import React, { useState, useEffect } from "react";
import MuiAlert from "@mui/material/Alert";
import {
  Snackbar,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Card,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import LoadingComponent from "../../layout/loading/Loading";
import UsersTab from "./AssignTrainingToUser";
import CreateQuiz from "../quiz/Quiz";
import DocumentsTab from "../documents/AssignDocumentToTraining";
import DocumentTable from "../documents/GetDocumentByTrainingId";

interface EditTrainingDetailsProps {
  trainingId: number | null;
}

type TrainingType = {
  id: number;
  title: string;
};

interface User {
  id: number;
  name: string;
}

type Document = {
  id: number;
  title: string;
};


const EditTrainingDetails: React.FC<EditTrainingDetailsProps> = ({ trainingId }) => {
  const [id, setId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [userId, setUserId] = useState("");
  const [url, setUrl] = useState("");
  const [typeId, setTypeId] = useState("");
  const [hours, setHours] = useState("");
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const router = useRouter();
  const [status, setStatus] = useState("Draft");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [value, setValue] = React.useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchUsersWithoutTraining = async () => {
      try {
        const response = await fetch("/api/users/getUsersWithoutTraining", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trainingId }),
        });
        if (response.ok) {
          const data: User[] = await response.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users without training");
        }
      } catch (error) {
        console.error("Fetch users without training error:", error);
      }
    };

    if (trainingId) {
      fetchUsersWithoutTraining();
    }
  }, [trainingId]);

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const response = await fetch("/api/documents/getDocumentsPaginated", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
  
        const data: Document[] = await response.json();
        console.log("Fetched documents:", data); // Log fetched documents
        setDocuments(data);
      } catch (error) {
        console.error("Fetch documents error:", error);
        setSnackbarMessage("Failed to fetch documents");
        setOpenSnackbar(true);
      }
    };
  
    fetchAllDocuments();
  }, []);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const response = await fetch(`/api/trainings/${trainingId}`);
        if (response.ok) {
          const data = await response.json();
          setId(Number(data.id)); // Ensure id is a number
          setDescription(data.description);
          setUserId(data.userId);
          setUrl(data.url);
        } else {
          console.error("Failed to fetch training details");
        }
      } catch (error) {
        console.error("Fetch training error:", error);
      }
    };

    const fetchTrainingTypes = async () => {
      try {
        const response = await fetch("/api/trainingType/getTrainingType");
        if (response.ok) {
          const data: TrainingType[] = await response.json();
          setTrainingTypes(data);
        } else {
          console.error("Failed to fetch training types");
        }
      } catch (error) {
        console.error("Fetch training types error:", error);
      }
    };

    if (trainingId) {
      fetchTraining();
    }

    fetchTrainingTypes();
  }, [trainingId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/trainings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          date: date?.toISOString(),
          url,
          userId: parseInt(userId, 10),
        }),
      });

      if (response.ok) {
        setSnackbarMessage('Training updated successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push('/Trainings'); // Redirect after 1200 milliseconds
        }, 1200);
      } else {
        console.error("Failed to update training");
        const errorData = await response.json();
        setSnackbarMessage(errorData.error);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSnackbarMessage('An error occurred while updating the training.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
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
            >
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
              <Grid
                container
                item
                rowSpacing={2}
                p={3}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid xs={12} sm={6} pr={{ xs: 0, sm: 1, md: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="description"
                    label="Description"
                    name="description"
                    autoComplete="description"
                    autoFocus
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    InputProps={{
                      readOnly: status === "Submitted" || status === "Approved",
                    }}
                  />
                </Grid>
                <Grid xs={12} sm={6} pl={{ xs: 0, sm: 1, md: 1 }}>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="url"
                    label="URL"
                    name="url"
                    autoComplete="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    InputProps={{
                      readOnly: status === "Submitted" || status === "Approved",
                    }}
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
                      href="/Trainings"
                      color="inherit"
                    >
                      Back
                    </Button>
                  </Grid>
                  <Grid xs={6} md={2} pl={1}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
    </>
  );  
};

export default EditTrainingDetails;
