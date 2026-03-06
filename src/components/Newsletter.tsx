'use client';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to your email service (SendGrid, etc.)
    setSubmitted(true);
  };

  return (
    <div className="ul-container">
      <section className="ul-nwsltr-subs">
        <div className="ul-inner-container">
          <div className="ul-section-heading justify-content-center text-center">
            <div>
              <span className="ul-section-sub-title text-white">GET NEWSLETTER</span>
              <h2 className="ul-section-title text-white">Sign Up for Exclusive Deals</h2>
            </div>
          </div>

          <div className="ul-nwsltr-subs-form-wrapper">
            <div className="icon"><i className="flaticon-airplane"></i></div>
            {submitted ? (
              <p style={{ color: '#fff', fontSize: '1.1rem' }}>
                🎉 Thank you! You&apos;re subscribed. We&apos;ll send deals straight to your inbox.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="ul-nwsltr-subs-form">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
                <button type="submit">
                  Subscribe Now <i className="flaticon-up-right-arrow"></i>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
