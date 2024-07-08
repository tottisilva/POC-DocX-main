'use client';

import { Button, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface DeleteUserTrainingButtonProps {
    userId: number;
    trainingId: number;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DeleteUserTrainingButton({ userId, trainingId }: DeleteUserTrainingButtonProps): JSX.Element {
    const router = useRouter();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    async function handleClick(): Promise<void> {
        try {
            const response = await fetch(`/api/userTraining/deleteUserTraining/${userId}/${trainingId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                console.error(`Failed to delete userTraining with userId ${userId} and trainingId ${trainingId}. Status: ${response.status}`);
                setSnackbarMessage(`Failed to delete userTraining. Status: ${response.status}`);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }
            console.log(`UserTraining with userId ${userId} and trainingId ${trainingId} deleted successfully.`);
            setSnackbarMessage(`UserTraining deleted successfully.`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (e) {
            console.error(e);
            setSnackbarMessage('Deletion error');
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
            <Button size="small" color="error" onClick={handleClick} startIcon={<DeleteIcon />}></Button>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
