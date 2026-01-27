"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applyActionCode, checkActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

type ActionStatus = 'loading' | 'success' | 'error';

export default function AuthActionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<ActionStatus>('loading');
  const [message, setMessage] = useState('Processing...');

  useEffect(() => {
    const handleAction = async () => {
      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');

      if (!oobCode) {
        setStatus('error');
        setMessage('Invalid action link. Please try again.');
        return;
      }

      try {
        switch (mode) {
          case 'verifyEmail':
            // Verify the action code first
            await checkActionCode(auth, oobCode);
            // Apply the action code to verify email
            await applyActionCode(auth, oobCode);
            setStatus('success');
            setMessage('Your email has been verified successfully!');
            // Auto redirect to home after 2 seconds
            setTimeout(() => {
              router.push('/');
            }, 2000);
            break;

          case 'resetPassword':
            // Redirect to password reset page with the code
            router.push(`/reset-password?oobCode=${oobCode}`);
            break;

          case 'recoverEmail':
            await applyActionCode(auth, oobCode);
            setStatus('success');
            setMessage('Your email has been recovered successfully!');
            setTimeout(() => {
              router.push('/signin');
            }, 3000);
            break;

          default:
            setStatus('error');
            setMessage('Unknown action type.');
        }
      } catch (error) {
        console.error('Auth action error:', error);
        setStatus('error');
        if (error instanceof Error) {
          if (error.message.includes('expired')) {
            setMessage('This link has expired. Please request a new verification email.');
          } else if (error.message.includes('invalid')) {
            setMessage('This link is invalid or has already been used.');
          } else {
            setMessage('An error occurred. Please try again.');
          }
        } else {
          setMessage('An error occurred. Please try again.');
        }
      }
    };

    handleAction();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="w-16 h-16 animate-spin text-[#D4FF4F] mx-auto" />
            <h1 className="text-2xl font-bold text-white">Processing</h1>
            <p className="text-neutral-400">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-[#D4FF4F] mx-auto" />
            <h1 className="text-2xl font-bold text-white">Success!</h1>
            <p className="text-neutral-400">{message}</p>
            <p className="text-sm text-neutral-500">Redirecting to Reelzila...</p>
            <Link
              href="/"
              className="inline-block mt-4 text-[#D4FF4F] hover:underline"
            >
              Click here if not redirected
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold text-white">Error</h1>
            <p className="text-neutral-400">{message}</p>
            <div className="flex flex-col gap-2 mt-6">
              <Link
                href="/signin"
                className="inline-block text-[#D4FF4F] hover:underline"
              >
                Go to Sign In
              </Link>
              <Link
                href="/"
                className="inline-block text-neutral-400 hover:text-white"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
