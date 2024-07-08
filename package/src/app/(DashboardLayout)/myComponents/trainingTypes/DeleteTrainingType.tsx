'use client';

import { Button, Snackbar } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';

interface DeleteTrainingTypeButtonProps {
    trainingTypeId: number;
    onDeleteSuccess: () => void;
}

const DeleteTrainingTypeButton: React.FC<DeleteTrainingTypeButtonProps> = ({ trainingTypeId, onDeleteSuccess }) => {
    const router = useRouter();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleClick = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/trainingType/deleteTrainingType/${trainingTypeId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Failed to delete Training Type with id ${trainingTypeId}. Status: ${response.status}`);
                setSnackbarMessage(`Failed to delete Training Type. Status: ${response.status}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                return;
            }
            console.log(`Training Type with id ${trainingTypeId} deleted successfully.`);
            setSnackbarMessage(`Training Type deleted successfully.`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            // Refresh the page after showing the Snackbar
            setTimeout(() => {
                    onDeleteSuccess(); // Notify parent component of success
                }, 1200);
        } catch (e) {
            console.error(e);
            setSnackbarMessage('An error occurred while deleting the Training Type.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Button color="error" size='small' onClick={handleClick}><DeleteIcon /></Button>
            <Snackbar
                open={openSnackbar}
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
};

export default DeleteTrainingTypeButton;
