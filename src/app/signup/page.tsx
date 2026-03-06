'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/client-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, city }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? 'Signup failed');
        setLoading(false);
        return;
      }

      const { user } = await res.json();
      // Store user in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(user));
      }
      setSuccess(true);
      // Redirect to login after 1 second
      setTimeout(() => router.push('/login'), 1000);
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
          <h2 className="ul-breadcrumb-title">Sign Up</h2>
          <div className="ul-breadcrumb-nav">
            <Link href="/"><i className="flaticon-home"></i> Home</Link>
            <i className="flaticon-arrow-point-to-right"></i>
            <span className="current-page">Sign Up</span>
          </div>
        </div>
      </div>

      <div className="ul-container">
        <div className="ul-inner-page-container">
          <div className="row justify-content-evenly align-items-center flex-column-reverse flex-md-row">
            <div className="col-md-5">
              <div className="ul-login-img text-center">
                <img src="/assets/img/login-img.svg" alt="Sign Up Image" />
              </div>
            </div>
            <div className="col-xl-4 col-md-7">
              {success ? (
                <p className="text-center" style={{ padding: '40px 0', fontSize: '1.1rem', color: '#10b981' }}>
                  ✅ Account created! Redirecting to login...
                </p>
              ) : (
                <>
                  {error && (
                    <p style={{ color: 'red', marginBottom: 12, fontSize: '0.9rem' }}>{error}</p>
                  )}
                  <form onSubmit={handleSubmit} className="ul-contact-form">
                    <div className="row">
                      <div className="form-group">
                        <div className="position-relative">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="position-relative">
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="position-relative">
                          <input
                            type="tel"
                            placeholder="Phone Number (optional)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="position-relative">
                          <input
                            type="text"
                            placeholder="City (optional)"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="ul-btn ul-btn-primary"
                      style={{ width: '100%' }}
                    >
                      {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                  </form>
                </>
              )}
              <p className="text-center mt-4 mb-0">
                Already have an account?{' '}
                <Link href="/login" style={{ color: '#e85d04', fontWeight: 600 }}>
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
