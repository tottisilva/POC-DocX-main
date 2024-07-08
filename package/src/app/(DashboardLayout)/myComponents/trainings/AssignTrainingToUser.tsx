import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  SelectChangeEvent,
  Typography,
  Button,
  Grid
} from "@mui/material";
import UserTrainingTable from "../userTraining/UsersPerTraining";

type User = {
  id: number;
  name: string;
};

interface UsersTabProps {
  users: User[];
  trainingId: number;
}

const UsersTab: React.FC<UsersTabProps> = ({ users, trainingId }) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  const handleUserSelection = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedUsers(typeof value === 'string' ? value.split(',').map(Number) : value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/userTraining/addUserListToTraining", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          trainingId,
          createdBy: session?.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create UserTraining");
      }
      router.refresh();
      console.log("UserTrainings created successfully");
      
    } catch (error) {
      console.error("Error creating UserTrainings:", error);
    }
  };

  return (
    <>
      <Typography component="h1" variant="h5" mb={1}>
        Assign Training
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
      >
        <Grid
          container
          item
          rowSpacing={2}
          p={3}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          alignItems="center"
        >
          <Grid xs={12} sm={6} pr={{ xs: 0, sm: 1, md: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="users-label">Select Users</InputLabel>
              <Select
                labelId="users-label"
                id="users"
                multiple
                value={selectedUsers}
                onChange={handleUserSelection}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    {(selected as number[]).map((userId) => (
                      <Chip
                        key={userId}
                        label={users.find((user) => user.id === userId)?.name}
                      />
                    ))}
                  </Box>
                )}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} pl={{ xs: 0, sm: 1, md: 1 }} >
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
      <UserTrainingTable trainingId={trainingId} />
    </>
  );
};

export default UsersTab;
