'use client';

import { Button, IconButton, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation"; // Changed from next/navigation to next/router
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface DeleteTrainingButtonProps {
    trainingStepId: number;
    onDeleteSuccess: () => void; // Callback function to handle success actions
}

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const DeleteTrainingStepButton: React.FC<DeleteTrainingButtonProps> = ({ trainingStepId, onDeleteSuccess }) => {
    const router = useRouter();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleClick = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/steps/deleteTrainingStep/${trainingStepId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                console.error(`Failed to delete Training Step with id ${trainingStepId}. Status: ${response.status}`);
                setSnackbarMessage(`Failed to delete Training Step. Status: ${response.status}`);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            console.log(`Training Step with id ${trainingStepId} deleted successfully.`);
            setSnackbarMessage(`Training Step deleted successfully.`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            // Refresh the page after showing the Snackbar
            setTimeout(() => {
                onDeleteSuccess(); // Reload the page
            }, 1200); // Adjust the delay as needed

        } catch (e) {
            console.error(e);
            setSnackbarMessage('An error occurred.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <>
            <IconButton size="small" color="error" onClick={handleClick}><DeleteIcon /></IconButton>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </>
    );
}

export default DeleteTrainingStepButton;
