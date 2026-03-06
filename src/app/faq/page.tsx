'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  const questions = [
    {
      q: 'How do I get in touch with MA Collective?',
      a: 'You can reach us via the Contact page, email us at hello@aficlothing.com, or send us a message on WhatsApp. Our team responds within 24 hours on business days.',
    },
    {
      q: 'Do you have restock notifications?',
      a: 'Yes! You can sign up to be notified when an out-of-stock item is restocked. Simply visit the product page and click "Notify me when available" to enter your email.',
    },
    {
      q: 'How do I care for my items?',
      a: 'Each product comes with care instructions on the label. In general, we recommend machine washing on a cold/delicate cycle or hand washing. Hang to dry in shade and iron inside-out on a medium setting.',
    },
    {
      q: 'How do I know what size I am?',
      a: 'Each product page includes a detailed size guide with measurements in both centimetres and inches. We recommend measuring yourself and comparing to our size chart before ordering.',
    },
    {
      q: 'How do I use a gift card?',
      a: 'At checkout, enter your gift card code in the "Promo / Gift Card" field and click Apply. The value will be deducted from your order total automatically.',
    },
    {
      q: 'How often do you restock items?',
      a: 'We receive new stock weekly and restock popular items as quickly as possible. Subscribe to our newsletter or follow us on social media to be the first to know about new arrivals and restocks.',
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 14-day return window from the date of delivery. Items must be unworn, unwashed, and in their original packaging with tags attached. Contact us to initiate a return.',
    },
    {
      q: 'How long does delivery take?',
      a: 'Standard delivery takes 2–5 business days depending on your location. Express options are available at checkout. You will receive a tracking number once your order is dispatched.',
    },
  ];

  return (
    <main>
      {/* BREADCRUMB */}
      <div className="ul-container">
        <div className="ul-breadcrumb">
          <h2 className="ul-breadcrumb-title">FAQ</h2>
          <div className="ul-breadcrumb-nav">
            <Link href="/"><i className="flaticon-home"></i> Home</Link>
            <i className="flaticon-arrow-point-to-right"></i>
            <span className="current-page">FAQ</span>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <section className="ul-faq">
        <div className="ul-inner-page-container">
          <div className="ul-accordion">
            {questions.map((item, i) => (
              <div
                key={i}
                className={`ul-single-accordion-item${openIndex === i ? ' open' : ''}`}
              >
                <div
                  className="ul-single-accordion-item__header"
                  onClick={() => toggle(i)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="left">
                    <h3 className="ul-single-accordion-item__title">{item.q}</h3>
                  </div>
                  <span className="icon"><i className="flaticon-plus"></i></span>
                </div>
                <div className="ul-single-accordion-item__body">
                  <p className="mb-0">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
