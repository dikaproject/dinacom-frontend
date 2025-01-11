import { FiDollarSign, FiCreditCard } from 'react-icons/fi';

export const PAYMENT_METHODS = {
  BANK_TRANSFER: {
    id: 'BANK_TRANSFER',
    name: 'Bank Transfer',
    icon: FiDollarSign,
    description: 'Manual bank transfer'
  },
  QRIS: {
    id: 'QRIS',
    name: 'QRIS',
    icon: '/icons/qris.png',
    description: 'Pay with any QRIS-supported app'
  },
  MIDTRANS: {
    id: 'MIDTRANS',
    name: 'Credit Card / E-Wallet',
    icon: FiCreditCard,
    description: 'Pay with various payment methods through Midtrans'
  }
} as const;

export const PAYMENT_STEPS = {
  BANK_TRANSFER: [
    'Copy the account number',
    'Open your mobile banking app',
    'Transfer the exact amount',
    'Upload payment proof',
    'Wait for verification (1x24 hours)'
  ],
  QRIS: [
    'Open your preferred payment app',
    'Scan the QRIS code',
    'Enter the exact amount',
    'Complete the payment',
    'Wait for automatic confirmation'
  ]
} as const;