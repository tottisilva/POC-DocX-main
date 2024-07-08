import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface StatusDialogProps {
  open: boolean;
  status: 'Completed' | 'Failed';
  message: string;
  onClose: () => void;
  attemptsLeft: number | null;
}

const StatusDialog: React.FC<StatusDialogProps> = ({ open, status, message, onClose, attemptsLeft }) => {
  const isCompleted = status === 'Completed';

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogContent>
        <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
          {isCompleted ? (
            <CheckCircleIcon color="success" style={{ fontSize: '120px' }} />
            
          ) : (
            <ErrorIcon color="error" style={{ fontSize: '120px' }} />
          )}
        </Box>
        <Typography align='center'>{message}</Typography>
        <Grid display='flex' justifyContent='center' mt={2}>
          <Typography component="h6" variant="h6">Attempts Left: {attemptsLeft}</Typography>
        </Grid>
        <Box display="flex" alignItems="center" justifyContent="center" mt={2} gap={1}>
            <Button onClick={onClose}>Close</Button>
        </Box>
      </DialogContent>
      <DialogActions>
        
      </DialogActions>
    </Dialog>
  );
};

export default StatusDialog;
