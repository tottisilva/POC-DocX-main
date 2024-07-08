import { Button, Snackbar } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface DeleteFunctionalAreaButtonProps {
    functionalAreaId: number;
    onDeleteSuccess: () => void;
}
const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};


export default function DeleteFunctionalAreaButton({ functionalAreaId, onDeleteSuccess }: DeleteFunctionalAreaButtonProps): JSX.Element {
    const router = useRouter();
    const [snackbarOpen, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    async function handleClick(): Promise<void> {
        try {
            const response = await fetch(`/api/functionalArea/deleteFunctionalArea/${functionalAreaId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                console.error(`Failed to delete Functional Area with id ${functionalAreaId}. Status: ${response.status}`);
                setSnackbarMessage(`Failed to delete Functional Area. Status: ${response.status}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                return;
            }
            console.log(`Functional Area with id ${functionalAreaId} deleted successfully.`);
            setSnackbarMessage(`Functional Area deleted successfully.`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            // Refresh the page after showing the Snackbar
            setTimeout(() => {
                onDeleteSuccess(); // Reload the page
            }, 1200); // Adjust the delay as needed
        } catch (e) {
            console.error(e);
            setSnackbarMessage('An error occurred while deleting the Functional Area.');
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
