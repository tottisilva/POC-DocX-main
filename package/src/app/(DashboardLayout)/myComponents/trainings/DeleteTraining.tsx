import { Button, IconButton, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation"; // Changed from next/navigation to next/router
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface DeleteTrainingButtonProps {
    trainingId: number;
    onDeleteSuccess: () => void; // Callback function to handle success actions
}

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const DeleteTrainingButton: React.FC<DeleteTrainingButtonProps> = ({ trainingId, onDeleteSuccess }) => {
    const router = useRouter();
    const [snackbarOpen, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleClick = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/trainings/deleteTraining/${trainingId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                console.error(`Failed to delete training with id ${trainingId}. Status: ${response.status}`);
                setSnackbarMessage(`Failed to delete training. Status: ${response.status}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                return;
            }

            console.log(`Training with id ${trainingId} deleted successfully.`);
            setSnackbarMessage(`Training deleted successfully.`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            // Refresh the page after showing the Snackbar
            setTimeout(() => {
                onDeleteSuccess(); // Reload the page
            }, 1200); // Adjust the delay as needed

        } catch (e) {
            console.error(e);
            setSnackbarMessage('An error occurred.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
      };

    return (
        <>
            <Button color="error" size='small' onClick={handleClick}><DeleteIcon /></Button>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert sx={{color: 'white'}} elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </>
    );
}

export default DeleteTrainingButton;
