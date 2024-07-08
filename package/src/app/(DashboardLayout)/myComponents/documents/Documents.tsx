'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import LoadingComponent from '../../layout/loading/Loading';
import { useSearchParams } from 'next/navigation'; 
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DocumentList from './DocumentsList';

type Document = {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  user: {
    name: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
  versions: {
    id: number;
    fileUrl: string;
    version: number;
  }[];
  functionalAreaId: number | null;
  functionalArea: {
    id: number;
    name: string;
  } | null;
  groupNames: {
    id: number;
    name: string;
  } | null;
  isCheckedOut: Boolean;
};

type DocumentData = {
  documents: Document[];
  totalDocuments: number;
  page: number;
  pageSize: number;
};

function DocumentsPageContent() {
  const searchParams = useSearchParams();
  const [documentData, setDocumentData] = useState<DocumentData>({
    documents: [],
    totalDocuments: 0,
    page: 1,
    pageSize: 10,
  });



  return (
    <PageContainer title="Documents" description="This is Documents Page">
      <DocumentList
        documents={documentData.documents}
        totalDocuments={documentData.totalDocuments}
        page={documentData.page}
        pageSize={documentData.pageSize}
        sortBy={searchParams.get('sortBy') || 'createdAt'}
        sortOrder={searchParams.get('sortOrder') || 'asc'}
        />
    </PageContainer>
  );
}

export default function DocumentsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingComponent />}>
        <DocumentsPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
