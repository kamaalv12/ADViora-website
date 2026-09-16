import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DIVISIONS, DIGITAL_CAPABILITIES } from '@/lib/data';
import { DivisionCard } from '@/components/DivisionCard';
import { BookingPanel } from '@/components/BookingPanel';
import { ProcessSteps } from '@/components/ProcessSteps';
import { BrandMeaning } from '@/components/BrandMeaning';
import { ContactSection } from '@/components/ContactSection';
import { FaqSection } from '@/components/FaqSection';
import { EnquiryTrigger } from '@/components/EnquiryTrigger';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="consulting-hero wrap">
        <div>
          <span className="eyebrow">ADViora Consulting</span>
          <h1>
            Turning potential
            <br />
            into <em>performance.</em>
          </h1>
          <p>
            Advancing people, strengthening organizations and shaping what comes next. Consulting,
            technology and learning—with a clear purpose.
          </p>
          <div className="hero-actions">
            <Link href="#divisions" className="button">
              Explore our divisions ↗
            </Link>
            <EnquiryTrigger variant="button secondary">Let’s talk</EnquiryTrigger>
          </div>
          <div className="hero-caption">Business Transformation · Technology · Training · Sports</div>
        </div>

        <div className="consulting-visual">
          <Image
            src="/images/consulting.webp"
            alt="A professional team collaborating on business strategy"
            width={800}
            height={500}
            priority
          />
          <div className="visual-pills">
            <span>Strategy</span>
            <span>People</span>
            <span>Progress</span>
          </div>
          <div className="visual-caption">
            <span>Advance. Vision. Aura.</span>
            <strong>
              Progress begins
              <br />
              with perspective.
            </strong>
          </div>
        </div>
      </section>

      {/* Quick Bar */}
      <div className="quick-bar">
        <div className="wrap quick-inner">
          <div>
            <strong>One purpose. Multiple possibilities.</strong>
            <span>People, organizations and performance.</span>
          </div>
          <Link href="/digital">ADViora Digital ↗</Link>
          <Link href="/academy">ADViora Academy ↗</Link>
        </div>
      </div>

      {/* Divisions Section */}
      <section className="section wrap" id="divisions">
        <div className="section-intro">
          <span className="eyebrow">Two divisions. One shared purpose.</span>
          <h2>
            Different strengths.
            <br />
            Greater possibilities.
          </h2>
          <p>
            From the way organizations work to the way individuals learn and compete, ADViora connects
            ambition with a practical path forward.
          </p>
        </div>
        <div className="divisions">
          {DIVISIONS.map((division) => (
            <DivisionCard key={division.id} division={division} />
          ))}
        </div>
      </section>

      {/* Digital Capabilities Section */}
      <section className="section digital-section" id="digital">
        <div className="wrap">
          <div className="heading-row">
            <div>
              <span className="eyebrow">ADViora Digital</span>
              <h2>
                Build a business
                <br />
                ready for what’s next.
              </h2>
            </div>
            <p>
              Make change work for your organization—with a clear strategy, useful technology and people
              equipped to deliver.
            </p>
          </div>
          <div className="capabilities">
            {DIGITAL_CAPABILITIES.map((cap) => (
              <article key={cap.number} className="capability">
                <b>
                  {cap.number} — {cap.category}
                </b>
                <h3>{cap.title}</h3>
                <p>{cap.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Academy Section */}
      <section className="section wrap" id="academy">
        <div className="academy-head">
          <div>
            <span className="eyebrow">ADViora Academy</span>
            <h2>
              Develop people.
              <br />
              Expand possibilities.
            </h2>
            <p>
              Professional training, sports and athlete development bring learning into practice.
              Explore pathways for individuals, teams and institutions.
            </p>
            <Link href="/professional-training" className="button">
              Explore learning &amp; development ↗
            </Link>
          </div>
          <div className="academy-image">
            <Image
              src="/images/training.webp"
              alt="Attendees learning at a professional workshop"
              width={600}
              height={330}
            />
            <span className="image-label">Learning that moves people forward</span>
          </div>
        </div>
      </section>

      {/* Booking / Engagements Section */}
      <section className="booking-band" id="booking">
        <div className="wrap booking-grid">
          <div>
            <span className="eyebrow">Your journey starts here</span>
            <h2>
              Discuss your requirements.
              <br />
              Plan the engagement.
            </h2>
            <p>
              Discuss your goals and scope with ADViora to find the right service, programme and next
              steps.
            </p>
          </div>
          <BookingPanel />
        </div>
      </section>

      {/* Process Section */}
      <ProcessSteps />

      {/* Story / Meaning Section */}
      <BrandMeaning />

      {/* Contact Section */}
      <ContactSection />

      {/* FAQ Section */}
      <FaqSection />
    </>
  );
}
