'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
          message: form.message,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Failed to send message');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      {/* BREADCRUMB */}
      <div className="ul-container">
        <div className="ul-breadcrumb">
          <h2 className="ul-breadcrumb-title">Contact Us</h2>
          <div className="ul-breadcrumb-nav">
            <Link href="/"><i className="flaticon-home"></i> Home</Link>
            <i className="flaticon-arrow-point-to-right"></i>
            <span className="current-page">Contact Us</span>
          </div>
        </div>
      </div>

      {/* CONTACT INFO BOXES */}
      <section className="ul-contact-infos">
        <div className="ul-contact-info">
          <div className="icon"><i className="flaticon-location"></i></div>
          <div className="txt">
            <h6 className="title">Our Address</h6>
            <p className="descr mb-0">Tudu, Accra, Ghana</p>
            <p className="descr mb-0">(Near Stanbic Bank)</p>
          </div>
        </div>
        <div className="ul-contact-info">
          <div className="icon"><i className="flaticon-email"></i></div>
          <div className="txt">
            <h6 className="title">Email Address</h6>
            <p className="descr mb-0">hello@aficlothing.com</p>
            <p className="descr mb-0">support@aficlothing.com</p>
          </div>
        </div>
        <div className="ul-contact-info">
          <div className="icon"><i className="flaticon-stop-watch-1"></i></div>
          <div className="txt">
            <h6 className="title">Hours of Operation</h6>
            <p className="descr mb-0">Mon–Sat: 8AM–8PM</p>
            <p className="descr mb-0">Sunday: 10AM–5PM</p>
          </div>
        </div>
      </section>

      {/* GOOGLE MAP */}
      <div className="ul-contact-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.068!2d-0.21360!3d5.55340!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9ba3de4f8d49d%3A0xcb75a16b24e8e7dd!2sTudu%2C%20Accra!5e0!3m2!1sen!2sgh!4v1700000000000"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ayekwa Collective Location"
        ></iframe>
      </div>

      {/* CONTACT FORM */}
      <div className="ul-contact-from-section">
        <div className="ul-contact-form-container">
          <h3 className="ul-contact-form-container__title">Get in Touch</h3>
          {submitted ? (
            <p style={{ textAlign: 'center', padding: '40px 0', fontSize: '1.1rem' }}>
              ✅ Thank you! We&apos;ll get back to you within 24 hours.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="ul-contact-form">
              {error && (
                <p style={{ marginBottom: 16, padding: 12, background: '#fef2f2', color: '#b91c1c', borderRadius: 8 }}>
                  {error}
                </p>
              )}
              <div className="grid">
                <div className="form-group">
                  <div className="position-relative">
                    <input type="text" name="firstName" id="firstname" placeholder="First Name" required value={form.firstName} onChange={handleChange} />
                    <span className="field-icon"><i className="flaticon-user"></i></span>
                  </div>
                </div>
                <div className="form-group">
                  <div className="position-relative">
                    <input type="text" name="lastName" id="lastname" placeholder="Last Name" required value={form.lastName} onChange={handleChange} />
                    <span className="field-icon"><i className="flaticon-user"></i></span>
                  </div>
                </div>
                <div className="form-group">
                  <div className="position-relative">
                    <input type="tel" name="phone" id="phone-number" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
                    <span className="field-icon"><i className="flaticon-user"></i></span>
                  </div>
                </div>
                <div className="form-group">
                  <div className="position-relative">
                    <input type="email" name="email" id="email" placeholder="Enter Email Address" required value={form.email} onChange={handleChange} />
                    <span className="field-icon"><i className="flaticon-email"></i></span>
                  </div>
                </div>
                <div className="form-group">
                  <div className="position-relative">
                    <textarea name="message" id="message" placeholder="Write Message..." value={form.message} onChange={handleChange}></textarea>
                    <span className="field-icon"><i className="flaticon-edit"></i></span>
                  </div>
                </div>
              </div>
              <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : undefined }}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
