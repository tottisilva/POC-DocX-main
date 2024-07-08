import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import LoadingComponent from '../../layout/loading/Loading';

interface DocumentAudiLogProps {
  documentId: number | null;
}

interface DocumentAuditLog {
  id: number;
  documentId: number;
  comment: string;
  user: {
    name: string;
  };
  timestamp: Date;
}

const DocumentAuditLogTable: React.FC<DocumentAudiLogProps> = ({ documentId }) => {
  const [auditLogs, setAuditLogs] = useState<DocumentAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String>('');

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await fetch(`/api/documents/getAuditLogs/${documentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch audit logs');
        }
        const data = await response.json();
        setAuditLogs(data);
      } catch (error) {
        setError("Failed to fetch Audit Logs");
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [documentId]);

  if (loading) {
    return <LoadingComponent />
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Comment</TableCell>
          <TableCell>User</TableCell>
          <TableCell>Created At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {auditLogs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{log.comment}</TableCell>
            <TableCell>{log.user.name}</TableCell>
            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  );
};

export default DocumentAuditLogTable;
