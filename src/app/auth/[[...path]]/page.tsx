'use client';

import { AuthView, useAuthenticate } from '@neondatabase/neon-js/auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { use } from 'react';
import './auth.css';

interface Props {
  params: Promise<{ path?: string[] }>;
}

function AuthPageInner({ pathname }: { pathname: string }) {
  // enabled: false — don't let this hook auto-redirect (AuthView handles its own auth flow)
  const { data: user, isPending } = useAuthenticate({ enabled: false } as { enabled: boolean });
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  // If already signed in, redirect immediately
  useEffect(() => {
    if (!isPending && user) {
      router.replace(redirectTo);
    }
  }, [user, isPending, router, redirectTo]);

  if (isPending) {
    return (
      <div className="auth-loader">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">
            <span className="brand-name">MA Collective</span> Admin
          </h1>
          <p className="auth-subtitle">Manage your fashion store</p>
        </div>
        <div className="auth-form-wrapper" style={{ colorScheme: 'light' }}>
          <AuthView pathname={pathname} redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}

export default function AuthPage({ params }: Props) {
  const { path = [] } = use(params);
  const pathname = path.length > 0 ? path.join('/') : 'sign-in';

  return (
    <Suspense fallback={
      <div className="auth-loader">
        <p>Loading...</p>
      </div>
    }>
      <AuthPageInner pathname={pathname} />
    </Suspense>
  );
}
