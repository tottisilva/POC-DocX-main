import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import DeleteUserTrainingButton from "./DeleteUserTraining";
import LoadingComponent from "../../layout/loading/Loading";

interface UserTraining {
  id: number;
  userId: number;
  user: {
    name: string;
  }
}

interface UserTrainingTableProps {
  trainingId: number;
}

const UserTrainingTable: React.FC<UserTrainingTableProps> = ({ trainingId }) => {
  const [userTrainings, setUserTrainings] = useState<UserTraining[] | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTrainings = async () => {
      try {
        const response = await fetch(`/api/userTraining/getUsersPerTrainingId`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trainingId }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user trainings");
        }
        const data = await response.json();
        setUserTrainings(data);
      } catch (error) {
        setError("Error fetching user trainings");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTrainings();
  }, [trainingId]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

  if (!userTrainings || userTrainings.length === 0) {
    return <div>No users assigned.</div>; // Show message if userTrainings is undefined or empty
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell  align="right">
                Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userTrainings.map((userTraining) => (
            <TableRow key={userTraining.id}>
              <TableCell>{userTraining.userId}</TableCell>
              <TableCell>{userTraining.user.name}</TableCell>
              <TableCell align="right">
                  <Grid container spacing={2} display="flex" justifyContent="flex-end">
                    <Grid item>
                    <DeleteUserTrainingButton userId={userTraining.userId} trainingId={trainingId} />
                    </Grid>
                  </Grid>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTrainingTable;
