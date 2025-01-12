"use client"

import { useParams } from 'next/navigation';
import MidtransStatus from '@/components/MidtransStatus';

export default function TransactionStatusPage() {
  const params = useParams();
  const status = params.status as 'success' | 'pending' | 'error';
  

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <MidtransStatus 
        status={status}
      />
    </div>
  );
}