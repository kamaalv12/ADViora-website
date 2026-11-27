import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  BUSINESS_VERTICALS,
  TRAINING_CATEGORIES,
  DELIVERY_LEVELS,
  CONSULTING_PACKAGES,
  CLIENT_LOGOS,
  ADVIORA_CONTACT,
  APPROACH_STEPS,
  WHY_CHOOSE_ADVIORA,
  ALLOWED_INTERESTS,
} from '../lib/data';
import { ALLOWED_DIGITAL_INTERESTS } from '../server/validators/user.validator';
import nextConfig from '../next.config';

describe('Adviora Digital Content & Vertical Architecture Verification', () => {
  it('1. Has exactly 4 business verticals with documented routes and services', () => {
    assert.equal(BUSINESS_VERTICALS.length, 4);

    const consulting = BUSINESS_VERTICALS.find((v) => v.id === 'consulting-advisory');
    assert.ok(consulting);
    assert.equal(consulting.title, 'Consulting & Advisory');
    assert.equal(consulting.route, '/consulting-advisory');
    assert.equal(consulting.services.length, 9);
    assert.ok(consulting.services.includes('ITSM and ITIL maturity assessments'));
    assert.ok(consulting.services.includes('Continual improvement programmes'));

    const tech = BUSINESS_VERTICALS.find((v) => v.id === 'technology-solutions');
    assert.ok(tech);
    assert.equal(tech.title, 'Technology & Digital Solutions');
    assert.equal(tech.navLabel, 'Technology Solutions');
    assert.equal(tech.route, '/technology-solutions');
    assert.equal(tech.services.length, 9);
    assert.ok(tech.services.includes('Artificial Intelligence and Generative AI adoption'));
    assert.ok(tech.services.includes('Site Reliability Engineering (SRE)'));

    const academy = BUSINESS_VERTICALS.find((v) => v.id === 'academy-training');
    assert.ok(academy);
    assert.equal(academy.title, 'Professional Academy & Training');
    assert.equal(academy.navLabel, 'Academy & Training');
    assert.equal(academy.route, '/academy-training');
    assert.equal(academy.services.length, 8);
    assert.ok(academy.services.includes('ITIL and IT Service Management'));
    assert.ok(academy.services.includes('Corporate and customised technology training'));

    const enterprise = BUSINESS_VERTICALS.find((v) => v.id === 'enterprise-solutions');
    assert.ok(enterprise);
    assert.equal(enterprise.title, 'Enterprise Capability Development');
    assert.equal(enterprise.navLabel, 'Enterprise Solutions');
    assert.equal(enterprise.route, '/enterprise-solutions');
    assert.equal(enterprise.services.length, 8);
    assert.ok(enterprise.services.includes('Workforce upskilling and reskilling'));
    assert.ok(enterprise.services.includes('Learning needs analysis and capability roadmaps'));
  });

  it('2. Maps all vertical interest choices to backend ALLOWED_DIGITAL_INTERESTS', () => {
    for (const vertical of BUSINESS_VERTICALS) {
      assert.ok(
        (ALLOWED_DIGITAL_INTERESTS as readonly string[]).includes(vertical.prefillInterest),
        `Vertical ${vertical.id} uses unsupported interest: ${vertical.prefillInterest}`
      );
    }
    for (const interest of ALLOWED_INTERESTS) {
      assert.ok((ALLOWED_DIGITAL_INTERESTS as readonly string[]).includes(interest));
    }
  });

  it('3. Professional Training Catalogue has exactly 6 categories and all documented courses', () => {
    assert.equal(TRAINING_CATEGORIES.length, 6);

    const [c1, c2, c3, c4, c5, c6] = TRAINING_CATEGORIES;

    // Category 1: IT Service Management & ITIL
    assert.equal(c1.id, 'itsm-itil');
    assert.equal(c1.name, 'IT Service Management & ITIL');
    assert.equal(c1.courses.length, 11);
    assert.ok(c1.courses.includes('ITIL Foundation and advanced learning pathways'));
    assert.ok(c1.courses.includes('ITIL 4 and ITIL Version 5'));
    assert.ok(c1.courses.includes('Experience Level Agreements (XLA)'));

    // Category 2: ISO Standards & Governance
    assert.equal(c2.id, 'iso-governance');
    assert.equal(c2.name, 'ISO Standards & Governance');
    assert.equal(c2.courses.length, 10);
    assert.ok(c2.courses.includes('ISO/IEC 20000-1 – IT Service Management'));
    assert.ok(c2.courses.includes('ISO/IEC 42001 – AI Management Systems'));

    // Category 3: Artificial Intelligence & Emerging Technologies
    assert.equal(c3.id, 'ai-emerging-tech');
    assert.equal(c3.courses.length, 10);
    assert.ok(c3.courses.includes('Generative AI for business professionals'));
    assert.ok(c3.courses.includes('Agentic AI awareness and applications'));

    // Category 4: Agile, DevOps & Modern IT Operations
    assert.equal(c4.id, 'agile-devops-ops');
    assert.equal(c4.courses.length, 10);
    assert.ok(c4.courses.includes('Site Reliability Engineering (SRE)'));
    assert.ok(c4.courses.includes('AIOps Foundation'));

    // Category 5: Enterprise Technology & Platforms
    assert.equal(c5.id, 'enterprise-platforms');
    assert.equal(c5.courses.length, 10);
    assert.ok(c5.courses.includes('ServiceNow Foundation and Administration'));
    assert.ok(c5.courses.includes('ServiceNow Predictive Intelligence'));

    // Category 6: Project Management & Business Skills
    assert.equal(c6.id, 'project-management-business');
    assert.equal(c6.courses.length, 9);
    assert.ok(c6.courses.includes('PRINCE2 Foundation and Practitioner'));
    assert.ok(c6.courses.includes('Service Management for Freshers'));
  });

  it('4. Has all 3 commercial delivery levels', () => {
    assert.equal(DELIVERY_LEVELS.length, 3);
    const levels = DELIVERY_LEVELS.map((d) => d.level);
    assert.deepEqual(levels, ['Awareness', 'Practitioner', 'Certification preparation']);
  });

  it('5. Has all 7 consulting packages', () => {
    assert.equal(CONSULTING_PACKAGES.length, 7);
    const titles = CONSULTING_PACKAGES.map((p) => p.title);
    assert.deepEqual(titles, [
      'ITSM Health Check',
      'ITIL Maturity Assessment',
      'ServiceNow Optimisation',
      'ISO 20000 Readiness',
      'IT Operations Excellence',
      'AI Readiness Assessment',
      'ITSM Transformation',
    ]);
  });

  it('6. Has all 9 client organisation logos', () => {
    assert.equal(CLIENT_LOGOS.length, 9);
    const names = CLIENT_LOGOS.map((c) => c.name);
    assert.deepEqual(names, [
      'Accenture',
      'HP',
      'SK Finance',
      'Bausch Health',
      'TC Energy',
      'Dyson',
      'SARS',
      'Birlasoft',
      'MTN',
    ]);
  });

  it('7. Contains exact approved contact details', () => {
    assert.equal(ADVIORA_CONTACT.phone, '+91 9945633771');
    assert.equal(ADVIORA_CONTACT.phoneHref, 'tel:+919945633771');
    assert.equal(ADVIORA_CONTACT.email, 'kamalkv@gmail.com');
    assert.equal(ADVIORA_CONTACT.emailHref, 'mailto:kamalkv@gmail.com');
    assert.equal(ADVIORA_CONTACT.whatsapp, '919945633771');
    assert.equal(ADVIORA_CONTACT.whatsappBaseUrl, 'https://wa.me/919945633771');
  });

  it('8. Approach has 4 steps and Why Choose has 6 selling points', () => {
    assert.equal(APPROACH_STEPS.length, 4);
    assert.deepEqual(
      APPROACH_STEPS.map((s) => s.title),
      ['Assess', 'Design', 'Implement', 'Optimise']
    );

    assert.equal(WHY_CHOOSE_ADVIORA.length, 6);
    assert.deepEqual(
      WHY_CHOOSE_ADVIORA.map((w) => w.title),
      [
        'Practitioner-led expertise',
        'Business-focused solutions',
        'Integrated capabilities',
        'Customised engagements',
        'Industry-relevant learning',
        'Flexible delivery',
      ]
    );
  });

  it('9. Permanent redirects configured in next.config.ts for legacy routes', async () => {
    assert.ok(typeof nextConfig.redirects === 'function');
    const redirects = await nextConfig.redirects();
    assert.ok(Array.isArray(redirects));

    const legacyRoutes = [
      { source: '/business-transformation', dest: '/consulting-advisory' },
      { source: '/technology-digital', dest: '/technology-solutions' },
      { source: '/professional-training', dest: '/academy-training' },
    ];

    for (const leg of legacyRoutes) {
      const match = redirects.find((r) => r.source === leg.source);
      assert.ok(match, `Missing redirect for ${leg.source}`);
      assert.equal(match.destination, leg.dest);
      assert.equal(match.permanent, true);
    }
  });
});
