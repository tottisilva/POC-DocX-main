import { Button, Snackbar } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';

interface DeleteGroupNameButtonProps {
    groupNameId: number;
    onDeleteSuccess: () => void;
}

const DeleteGroupNameButton = ({ groupNameId, onDeleteSuccess }: DeleteGroupNameButtonProps): JSX.Element => {
    const router = useRouter();
    const [snackbarOpen, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleClick = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/groupName/deleteGroupName/${groupNameId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Failed to delete Group Name with id ${groupNameId}. Status: ${response.status}`);
                setSnackbarMessage(errorData.error || 'Failed to delete Group Name.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                return;
            }
            console.log(`Group Name with id ${groupNameId} deleted successfully.`);
            setSnackbarMessage(`Group Name deleted successfully.`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

             // Refresh the page after showing the Snackbar
            setTimeout(() => {
                 onDeleteSuccess(); // Reload the page
            }, 1200); // Adjust the delay as needed
        } catch (error) {
            console.error('Error deleting Group Name:', error);
            setSnackbarMessage('An error occurred while deleting the Group Name.');
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
};

export default DeleteGroupNameButton;
