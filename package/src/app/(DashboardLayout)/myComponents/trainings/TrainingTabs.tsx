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
  Tabs,
  Tab,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import LoadingComponent from "../../layout/loading/Loading";
import UsersTab from "./AssignTrainingToUser";
import DocumentsTab from "../documents/AssignDocumentToTraining";
import CreateQuiz from "../quiz/Quiz";
import EditTrainingDetails from "./TrainingEditDetails";
import TrainingStepList from "../trainingSteps/StepsByTrainingId";

type TrainingType = {
  id: number;
  title: string;
};

type TrainingStep = {
  id: number;
  description: string;
  url: string;
  typeId: number;
  stepNumber: number;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface User {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

type Document = {
  id: number;
  title: string;
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const EditTrainingTabs: React.FC = () => {
  const [id, setId] = useState<number | null>(null);
  const [trainingSteps, setTrainingSteps] = useState<TrainingStep[]>([]);
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [value, setValue] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const trainingId = searchParams.get("id");
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (tab !== null) {
      setValue(Number(tab));
    }
  }, [tab]);

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

  const fetchTraining = async () => {
    try {
      const response = await fetch(`/api/trainings/${trainingId}`);
      if (response.ok) {
        const data = await response.json();
        setId(Number(data.id)); // Ensure id is a number
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

  const fetchTrainingSteps = async () => {
    if (!trainingId) return;

    try {
      const response = await fetch("/api/steps/getSteps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trainingId }),
      });
      if (response.ok) {
        const data: TrainingStep[] = await response.json();
        setTrainingSteps(data);
      } else {
        console.error("Failed to fetch training steps");
      }
    } catch (error) {
      console.error("Error fetching training steps:", error);
    }
  };

  useEffect(() => {
    if (trainingId) {
      fetchTraining();
      fetchTrainingSteps();
    }

    fetchTrainingTypes();
  }, [trainingId]);

  const handleAddStep = () => {
    if (trainingSteps.length < 3) {
      const newStepNumber = trainingSteps.length + 1;
      const newStep: TrainingStep = {
        id: 0,
        description: "",
        url: "",
        typeId: 0,
        stepNumber: newStepNumber,
      };
      setTrainingSteps([...trainingSteps, newStep]);
      setValue(newStepNumber + 1); // Switch to the newly added tab
    }
  };

  const handleRemoveStep = (index: number) => {
    const newTrainingSteps = [...trainingSteps];
    newTrainingSteps.splice(index, 1);
    setTrainingSteps(newTrainingSteps);
    setValue(0); // Switch to the first tab after removal
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }} mb={2}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Detail" {...a11yProps(0)} />
            <Tab label="Steps" {...a11yProps(1)} />
            <Tab label="Users" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <Card>
          <CustomTabPanel value={value} index={0}>
            <Typography component="h1" variant="h5" mb={1}>
              Detail
            </Typography>
            <EditTrainingDetails trainingId={id} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <TrainingStepList trainingSteps={[]} totalTrainingSteps={0} page={0} pageSize={0} sortBy={""} sortOrder={""} trainingId={id} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            {id !== null && <UsersTab users={users} trainingId={id} />}
          </CustomTabPanel>
        </Card>
      </Box>
    </>
  );
};

export default EditTrainingTabs;
