// DeleteUserButton.tsx

import { Button, Snackbar } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface DeleteUserButtonProps {
    userId: number;
    onDeleteSuccess: () => void; // Callback function to handle success actions
}

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ userId, onDeleteSuccess }) => {
    const router = useRouter();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleClick = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/users/deleteUser/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Failed to delete user with id ${userId}. Status: ${response.status}`);
                setSnackbarMessage(`Failed to delete user. Status: ${response.status}`);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            console.log(`User with id ${userId} deleted successfully.`);
            setSnackbarMessage(`User deleted successfully.`);
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
            <Button color="error" size='small' onClick={handleClick}><DeleteIcon /></Button>
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

export default DeleteUserButton;
