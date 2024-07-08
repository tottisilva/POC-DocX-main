// DeleteRoleButton.tsx
'use client';

import { Button, Snackbar } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface DeleteRoleButtonProps {
    roleId: number;
    onDeleteSuccess: () => void; // Callback function to handle success actions
}

const DeleteRoleButton: React.FC<DeleteRoleButtonProps> = ({ roleId, onDeleteSuccess }) => {
    const router = useRouter();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleClick = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/roles/deleteRole/${roleId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                console.error(`Failed to delete role with id ${roleId}. Status: ${response.status}`);
                setSnackbarMessage(`Failed to delete role. Status: ${response.status}`);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }
            console.log(`Role with id ${roleId} deleted successfully.`);
            setSnackbarMessage(`Role with deleted successfully.`);
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

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };


    return (
        <>
            <Button size="small" color="error" onClick={handleClick}><DeleteIcon /></Button>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert sx={{ color: 'white' }} elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </>
    );
}

export default DeleteRoleButton;
