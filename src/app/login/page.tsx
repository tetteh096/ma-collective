'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/client-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? 'Login failed');
        setLoading(false);
        return;
      }

      const { user } = await res.json();
      // Store user in sessionStorage for client-side use
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(user));
      }
      // Redirect to account page
      router.push('/account');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      {/* BREADCRUMB */}
      <div className="ul-container">
        <div className="ul-breadcrumb">
          <h2 className="ul-breadcrumb-title">Log In</h2>
          <div className="ul-breadcrumb-nav">
            <Link href="/"><i className="flaticon-home"></i> Home</Link>
            <i className="flaticon-arrow-point-to-right"></i>
            <span className="current-page">Log In</span>
          </div>
        </div>
      </div>

      <div className="ul-container">
        <div className="ul-login">
          <div className="ul-inner-page-container">
            <div className="row justify-content-evenly align-items-center flex-column-reverse flex-md-row">
              <div className="col-md-5">
                <div className="ul-login-img text-center">
                  <img src="/assets/img/login-img.svg" alt="Login Image" />
                </div>
              </div>
              <div className="col-xl-4 col-md-7">
                {error && (
                  <p style={{ color: 'red', marginBottom: 12, fontSize: '0.9rem' }}>{error}</p>
                )}
                <form onSubmit={handleSubmit} className="ul-contact-form">
                  <div className="row">
                    <div className="form-group">
                      <div className="position-relative">
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group">
                      <div className="position-relative">
                        <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group">
                      <button
                        type="submit"
                        disabled={loading}
                        className="ul-btn ul-btn-primary"
                        style={{ width: '100%' }}
                      >
                        {loading ? 'Logging in...' : 'Log In'}
                      </button>
                    </div>
                  </div>

                  <p style={{ textAlign: 'center', marginTop: 12 }}>
                    Don't have an account?{' '}
                    <Link href="/signup" style={{ color: '#e85d04', fontWeight: 600 }}>
                      Sign up here
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
