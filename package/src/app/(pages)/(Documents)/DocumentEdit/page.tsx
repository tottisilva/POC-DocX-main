import React, { Suspense } from 'react';
import EditDocumentForm from "@/app/(DashboardLayout)/myComponents/documents/DocumentEdit";

export default function Documents() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditDocumentForm />
    </Suspense>
  );
}
