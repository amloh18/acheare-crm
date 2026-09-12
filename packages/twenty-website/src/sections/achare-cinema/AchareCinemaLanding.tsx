'use client';

import { useState, useEffect } from 'react';
import {
  IconArrowRight,
  IconAward,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconFileText,
  IconPlayerPlay,
  IconReceipt,
  IconShieldCheck,
  IconTrendingUp,
  IconUser,
  IconUserCheck,
  IconUsers,
  IconWallet,
  IconX,
} from '@tabler/icons-react';

const SectionDivider = () => (
  <div className="section-divider">
    <span className="section-divider-crosshair-left">+</span>
    <span className="section-divider-crosshair-right">+</span>
  </div>
);

export function AchareCinemaLanding() {
  // Candidate pipeline simulation (Section 01)
  const [candAdvancementState, setCandAdvancementState] = useState(0);

  // Aisha Khan Employee Detail Active Tab (Section 03)
  const [aishaTab, setAishaTab] = useState<'profile' | 'employment' | 'attendance' | 'payroll' | 'documents' | 'activity'>('profile');

  // Time Tracking Clock-In Toggle (Section 04)
  const [isClockedIn, setIsClockedIn] = useState(false);

  // Documents Stack Hover State (Section 06)
  const [docHovered, setDocHovered] = useState(false);

  // Testimonials Carousel State
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Demo Modal State
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  // Catalyze AI Suite Interactive States
  const [approachTab, setApproachTab] = useState<number>(1);
  const [isoAngle, setIsoAngle] = useState({ rotX: 54, rotZ: -34 });
  const [barsAnimated, setBarsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBarsAnimated(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const testimonials = [
    {
      quote:
        '"Achare replaced three separate SaaS subscriptions within our first two weeks. Having recruitment, timesheets, and payroll under one cohesive roof eliminated virtually all administrative duplicate entry."',
      author: 'Clara Lindqvist',
      role: ' — VP of People & Culture, Kinetic Tech',
    },
    {
      quote:
        '"Our candidate experience improved dramatically. Candidates move through screening into offers, and on day one their employee profile is already complete with tax and bank data."',
      author: 'Tariq Mansour',
      role: ' — Head of Talent Acquisition, Frontier Labs',
    },
    {
      quote:
        '"The time tracking to payroll pipeline saved our finance department over twenty hours every bi-weekly cycle. We have 100% confidence in our compliance records."',
      author: 'Helena Vance',
      role: ' — Chief Operating Officer, Align Media',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#F8F8F5',
        color: '#111318',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        minHeight: '100vh',
      }}
    >
      <style>{`
        .achare-btn-primary {
          background-color: #111318;
          color: #FFFFFF;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          padding: 0.75rem 1.4rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          border: none;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(20, 25, 40, 0.08);
        }
        .achare-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(20, 25, 40, 0.14);
        }
        .achare-btn-primary:active {
          transform: scale(0.98);
        }

        .achare-btn-secondary {
          background-color: #FFFFFF;
          color: #111318;
          border: 1px solid #E6E7E3;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          padding: 0.75rem 1.4rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 2px 6px rgba(20, 25, 40, 0.04);
        }
        .achare-btn-secondary:hover {
          background-color: #F3F4F1;
          border-color: #D2D4CD;
          transform: translateY(-2px);
        }
        .achare-btn-secondary:active {
          transform: scale(0.98);
        }

        .interactive-tilt {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
        }
        .interactive-tilt:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(20, 25, 40, 0.10);
        }

        .puzzle-float-piece {
          filter: drop-shadow(0 20px 30px rgba(16, 185, 129, 0.35));
          transition: transform 0.15s ease-out, filter 0.25s ease;
          cursor: grab;
        }
        .puzzle-float-piece:hover {
          filter: drop-shadow(0 28px 45px rgba(16, 185, 129, 0.5));
        }

        .lightning-pattern {
          background-color: #10B981;
          background-image: radial-gradient(rgba(255, 255, 255, 0.22) 1.5px, transparent 1.5px),
                            radial-gradient(rgba(255, 255, 255, 0.22) 1.5px, #10B981 1.5px);
          background-size: 24px 24px;
          background-position: 0 0, 12px 12px;
        }

        .dollar-pattern {
          background-color: #0F6B45;
          background-image: radial-gradient(rgba(255, 255, 255, 0.18) 1.5px, transparent 1.5px);
          background-size: 20px 20px;
        }

        .isometric-stage {
          perspective: 1200px;
          transform-style: preserve-3d;
        }
        .isometric-plane {
          transform-style: preserve-3d;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .comp-bar-height {
          transition: height 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .editorial-canvas {
          border-left: 1px solid #E6E7E3;
          border-right: 1px solid #E6E7E3;
        }
        .section-divider {
          position: relative;
          width: calc(100% + 2px);
          margin-left: -1px;
          margin-right: -1px;
          border-top: 1px solid #E6E7E3;
        }
        .section-divider-crosshair-left {
          position: absolute;
          left: -6px;
          top: -7px;
          font-size: 11px;
          line-height: 1;
          font-family: monospace;
          color: #9A9590;
          user-select: none;
        }
        .section-divider-crosshair-right {
          position: absolute;
          right: -6px;
          top: -7px;
          font-size: 11px;
          line-height: 1;
          font-family: monospace;
          color: #9A9590;
          user-select: none;
        }
      `}</style>

      {/* 1. EDITORIAL NAVBAR */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          width: '100%',
          padding: '1rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            padding: '0.75rem 1.5rem',
            borderRadius: '16px',
            border: '1px solid #E6E7E3',
            boxShadow: '0 2px 8px rgba(20, 25, 40, 0.05)',
          }}
        >
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img src="/images/core/logo.svg" alt="Achare" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#111318', letterSpacing: '-0.02em' }}>
              ACHARE
            </span>
          </a>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '14px', fontWeight: 500, color: '#626873' }}>
            <a href="#product-modules" style={{ color: 'inherit', textDecoration: 'none' }}>Platform</a>
            <a href="#connected-workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Workflow</a>
            <a href="#workspace-builder" style={{ color: 'inherit', textDecoration: 'none' }}>Workspace Builder</a>
            <a href="#pricing-section" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
            <a href="#faq-section" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a
              href="http://localhost:3001"
              className="achare-btn-secondary"
              style={{ padding: '0.5rem 1.25rem', fontSize: '13px', textDecoration: 'none' }}
            >
              Login
            </a>
          </div>
        </div>
      </header>

      {/* EDITORIAL CANVAS WRAPPER */}
      <main className="editorial-canvas" style={{ maxWidth: '1320px', margin: '0 auto', overflowX: 'hidden' }}>

        {/* 2. HERO SECTION */}
        <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '2.5rem 2rem 3rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', borderRight: '1px solid #E6E7E3', paddingRight: '2.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: '#EAE2FF',
                color: '#8566F5',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                width: 'fit-content',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8566F5' }}></span>
              <span>PEOPLE. PROCESS. PROGRESS.</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.75rem)',
                fontWeight: 800,
                color: '#111318',
                letterSpacing: '-0.035em',
                lineHeight: 0.98,
                margin: 0,
              }}
            >
              The all-in-one platform for modern people operations.
            </h1>

            <p style={{ fontSize: '18px', color: '#626873', lineHeight: 1.6, margin: 0, maxWidth: '34rem' }}>
              Achare brings CRM, recruitment, employees, time tracking, payroll, and documents into one seamless system. Built for teams that value velocity over complexity.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.5rem' }}>
              <a href="#pricing-section" className="achare-btn-primary" style={{ padding: '0.85rem 1.6rem', fontSize: '15px' }}>
                <span>Buy Achare</span>
                <IconArrowRight size={16} />
              </a>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="achare-btn-secondary"
                style={{ padding: '0.85rem 1.6rem', fontSize: '15px' }}
              >
                <IconPlayerPlay size={16} color="#4169F5" />
                <span>Explore Interactive Demo</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '12px', color: '#9297A1', fontWeight: 500, paddingTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <IconCheck size={16} color="#68D39A" />
                <span>No credit card required</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <IconCheck size={16} color="#68D39A" />
                <span>Self-hosted or Cloud</span>
              </div>
            </div>
          </div>

          {/* Hero Product UI */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E7E3',
                borderRadius: '28px',
                padding: '1.75rem',
                boxShadow: '0 24px 70px rgba(20, 25, 40, 0.10)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E6E7E3', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#EAE2FF', color: '#8566F5', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                    AK
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111318' }}>Aisha Khan</div>
                    <div style={{ fontSize: '12px', color: '#626873' }}>Senior Product Designer</div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#36B978', backgroundColor: '#DDF4E6', padding: '0.25rem 0.6rem', borderRadius: '9999px' }}>
                  Active Employee
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: '#F8F8F5', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(230,231,227,0.7)' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#9297A1', fontWeight: 600 }}>Weekly Hours</span>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#111318', margin: '0.25rem 0' }}>38h 12m</div>
                  <div style={{ fontSize: '11px', color: '#36B978', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <IconTrendingUp size={13} /> On schedule
                  </div>
                </div>
                <div style={{ backgroundColor: '#F8F8F5', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(230,231,227,0.7)' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#9297A1', fontWeight: 600 }}>Next Payroll</span>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#111318', margin: '0.25rem 0' }}>$6,450</div>
                  <div style={{ fontSize: '11px', color: '#8566F5' }}>Friday, Mar 15</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#626873' }}>
                  <span>Onboarding Checklist</span>
                  <span style={{ color: '#4169F5' }}>5 of 6 completed</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F1', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '83%', height: '100%', backgroundColor: '#4169F5', borderRadius: '9999px' }}></div>
                </div>
              </div>
            </div>

            {/* Floating micro cards */}
            <div
              style={{
                position: 'absolute',
                top: '-18px',
                left: '-20px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E7E3',
                borderRadius: '16px',
                padding: '0.75rem 1rem',
                boxShadow: '0 10px 30px rgba(20, 25, 40, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#DDF4E6', color: '#36B978', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCheck size={16} />
              </div>
              <div style={{ fontSize: '12px' }}>
                <div style={{ fontWeight: 700, color: '#111318' }}>Payroll Approved</div>
                <div style={{ color: '#9297A1' }}>$42,800 sent directly</div>
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: '-18px',
                left: '-16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E7E3',
                borderRadius: '16px',
                padding: '0.75rem 1rem',
                boxShadow: '0 10px 30px rgba(20, 25, 40, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#EAE2FF', color: '#8566F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconUserCheck size={16} />
              </div>
              <div style={{ fontSize: '12px' }}>
                <div style={{ fontWeight: 700, color: '#111318' }}>Offer Accepted</div>
                <div style={{ color: '#9297A1' }}>Marcus Vance joined Engineering</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION DIVIDER: HERO ➔ WHY GROWING TEAMS SWITCH */}
      <SectionDivider />

      {/* 2. WHY GROWING TEAMS SWITCH TO ACHARE - COMPARATIVE BARS */}
      <section
        id="why-achare"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '3rem 2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E7E3',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#111318',
              }}
            >
              <span style={{ color: '#D97706' }}>✦</span> THE PROBLEM
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#111318', letterSpacing: '-0.035em', lineHeight: 1.08, margin: '0.75rem 0 0 0', maxWidth: '44rem' }}>
              Why growing teams switch to Achare
            </h2>
            <p style={{ fontSize: '16px', color: '#626873', maxWidth: '36rem', lineHeight: 1.6, margin: '0.75rem 0 0 0' }}>
              Most teams are stuck juggling 5+ disconnected tools. Here's why they consolidate.
            </p>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFFFFF', border: '1px solid #E6E7E3', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, color: '#111318' }}>
            <span>% of operations leaders surveyed</span>
            <span style={{ color: '#D97706', fontWeight: 800, fontSize: '14px' }}>✳</span>
          </div>
        </div>

        {/* 3 Comparative Percentage Columns with Side Content Dividers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginTop: '3.5rem', alignItems: 'flex-end' }}>
          
          {/* Column 1: 73% — Duplicate Data Entry */}
          <div className="interactive-tilt" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderRight: '1px solid #E6E7E3', paddingRight: '1.5rem' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#111318', letterSpacing: '-0.03em' }}>
              73%
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111318', margin: 0 }}>
              Duplicate data entry
            </h3>
            <div style={{ height: '280px', width: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div
                className="comp-bar-height"
                style={{
                  height: barsAnimated ? '100%' : '0px',
                  width: '100%',
                  borderRadius: '16px',
                  backgroundColor: '#D97706',
                  boxShadow: '0 8px 24px rgba(217, 119, 6, 0.25)',
                  position: 'relative',
                  transition: 'height 1s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#FFFFFF', fontSize: '24px' }}>
                  📋
                </div>
                <div style={{ position: 'absolute', top: '16px', right: '16px', color: 'rgba(255,255,255,0.9)', fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '9999px' }}>
                  #1 PAIN POINT
                </div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#626873', lineHeight: 1.6, margin: '0.5rem 0 0 0' }}>
              Copying candidate data into HR, then re-entering it into payroll — the same person's information typed 3+ times across disconnected tools.
            </p>
          </div>

          {/* Column 2: 61% — Paying for tool sprawl */}
          <div className="interactive-tilt" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderRight: '1px solid #E6E7E3', paddingRight: '1.5rem', paddingLeft: '0.5rem' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#111318', letterSpacing: '-0.03em' }}>
              61%
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111318', margin: 0 }}>
              Paying for tool sprawl
            </h3>
            <div style={{ height: '220px', width: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div
                className="comp-bar-height"
                style={{
                  height: barsAnimated ? '100%' : '0px',
                  width: '100%',
                  borderRadius: '16px',
                  backgroundColor: '#1E293B',
                  boxShadow: '0 6px 18px rgba(30, 41, 59, 0.2)',
                  position: 'relative',
                  transition: 'height 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
                }}
              >
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#94A3B8', fontSize: '14px', fontFamily: 'monospace', fontWeight: 700 }}>
                  $$$
                </div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#626873', lineHeight: 1.6, margin: '0.5rem 0 0 0' }}>
              Separate CRM ($50/user), ATS ($80/user), HRIS ($40/user), time tracker ($10/user), and payroll ($20/user) — when one platform does all of it.
            </p>
          </div>

          {/* Column 3: 54% — Broken handoffs */}
          <div className="interactive-tilt" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '0.5rem' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#111318', letterSpacing: '-0.03em' }}>
              54%
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111318', margin: 0 }}>
              Broken handoffs
            </h3>
            <div style={{ height: '170px', width: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div
                className="comp-bar-height"
                style={{
                  height: barsAnimated ? '100%' : '0px',
                  width: '100%',
                  borderRadius: '16px',
                  backgroundColor: '#F3F1ED',
                  border: '2px solid #D1D5DB',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                  position: 'relative',
                  transition: 'height 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
                }}
              >
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#626873', fontSize: '12px', fontFamily: 'monospace', fontWeight: 700 }}>
                  BROKEN
                </div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#626873', lineHeight: 1.6, margin: '0.5rem 0 0 0' }}>
              Candidate data doesn't flow to onboarding. Timesheet hours don't reach payroll without manual export. Information falls through the cracks.
            </p>
          </div>

        </div>

        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #E6E7E3', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '12px', color: '#626873' }}>
          <span>Source: Gartner State of Revenue Operations 2024 & internal Achare customer survey</span>
          <span style={{ color: '#D97706', fontWeight: 700 }}>Survey of 1,200+ people & operations leaders at companies with 20–500 employees</span>
        </div>
      </section>

      {/* SECTION DIVIDER: WHY GROWING TEAMS SWITCH ➔ PLATFORM BENTO */}
      <SectionDivider />

      {/* 4.1 OUR PLATFORM - 5-CARD BENTO GRID (CATALYZE AI REFERENCE 1) */}
      <section
        id="platform-bento"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '3rem 2rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E6E7E3',
              boxShadow: '0 2px 8px rgba(20, 25, 40, 0.05)',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#111318',
              width: 'fit-content',
            }}
          >
            <span style={{ color: '#10B981' }}>✦</span> OUR PLATFORM
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.4rem)',
              fontWeight: 800,
              color: '#111318',
              letterSpacing: '-0.035em',
              lineHeight: 1.08,
              maxWidth: '56rem',
              margin: 0,
            }}
          >
            A smarter way to acquire high net worth clients & high-intent talent
          </h2>
          <p
            style={{
              fontSize: '17px',
              color: '#626873',
              maxWidth: '42rem',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Achare combines verified market intelligence, proprietary trigger alerts, and automated multi-touch workflows into one unfair operational advantage.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '1.5rem',
            marginTop: '3rem',
          }}
        >
          {/* Card 1: Exclusive (7 cols) */}
          <div
            className="interactive-tilt"
            style={{
              gridColumn: 'span 7',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E6E7E3',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '420px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(20, 25, 40, 0.05)',
            }}
          >
            <div style={{ position: 'relative', zIndex: 10 }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111318', margin: '0 0 0.5rem 0' }}>
                Exclusive
              </h3>
              <p style={{ fontSize: '15px', color: '#626873', lineHeight: 1.6, maxWidth: '28rem', margin: 0 }}>
                Lead generation and client intelligence that is 100% exclusive to you in your territory. No shared pipeline, no bidding wars.
              </p>
            </div>

            {/* Diamond Art Centerpiece */}
            <div style={{ position: 'relative', padding: '2rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.15) 50%, transparent 70%)',
                  filter: 'blur(20px)',
                  pointerEvents: 'none',
                }}
              />
              <div style={{ position: 'relative', zIndex: 10 }}>
                <svg width="200" height="160" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="60,40 160,40 190,75 30,75" fill="#BAE6FD" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round"/>
                  <polygon points="30,75 60,40 75,75" fill="#38BDF8" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="1.5"/>
                  <polygon points="60,40 110,40 110,75 75,75" fill="#06B6D4" fillOpacity="0.9" stroke="#FFFFFF" strokeWidth="1.5"/>
                  <polygon points="110,40 160,40 145,75 110,75" fill="#10B981" fillOpacity="0.9" stroke="#FFFFFF" strokeWidth="1.5"/>
                  <polygon points="160,40 190,75 145,75" fill="#34D399" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="1.5"/>
                  <polygon points="30,75 75,75 110,165" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round"/>
                  <polygon points="75,75 110,75 110,165" fill="#0D9488" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round"/>
                  <polygon points="110,75 145,75 110,165" fill="#059669" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round"/>
                  <polygon points="145,75 190,75 110,165" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                <span style={{ position: 'absolute', top: '-10px', left: '15px', color: '#F59E0B', fontSize: '20px' }}>✦</span>
                <span style={{ position: 'absolute', top: '50%', right: '-15px', color: '#10B981', fontSize: '18px' }}>✦</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#626873', borderTop: '1px solid #F1F2ED', paddingTop: '1rem' }}>
              <span>Territory lock: 1 Advisor per Metro</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>● 100% Protected Capacity</span>
            </div>
          </div>

          {/* Card 2: In your backyard (5 cols) */}
          <div
            className="interactive-tilt"
            style={{
              gridColumn: 'span 5',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E6E7E3',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '420px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(20, 25, 40, 0.05)',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111318', margin: '0 0 0.5rem 0' }}>
                In your backyard
              </h3>
              <p style={{ fontSize: '15px', color: '#626873', lineHeight: 1.6, margin: 0 }}>
                Target the high-value opportunities right in your local market or defined region with geo-fenced intelligence.
              </p>
            </div>

            {/* Picket Fence Art */}
            <div style={{ padding: '1.5rem 0' }}>
              <div style={{ background: 'linear-gradient(to bottom, #E0F2FE 0%, #ECFDF5 70%, transparent 100%)', borderRadius: '16px', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '8px', left: '12px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, color: '#111318' }}>
                  <span style={{ color: '#EF4444' }}>📍</span> Austin Metro • 25mi Radius
                </div>
                <svg viewBox="0 0 340 85" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', marginTop: '2.5rem' }}>
                  <rect x="0" y="68" width="340" height="17" rx="4" fill="#34D399"/>
                  <rect x="0" y="72" width="340" height="13" rx="4" fill="#10B981"/>
                  <rect x="10" y="30" width="320" height="6" rx="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1"/>
                  <rect x="10" y="50" width="320" height="6" rx="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1"/>
                  {[26, 56, 86, 116, 146, 176, 206, 236, 266, 296, 326].map((x, i) => (
                    <polygon key={i} points={`${x},10 ${x+6},20 ${x+6},70 ${x-6},70 ${x-6},20`} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1"/>
                  ))}
                </svg>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#626873', borderTop: '1px solid #F1F2ED', paddingTop: '1rem' }}>
              <span>Local postal radius search</span>
              <span style={{ color: '#3B82F6', fontWeight: 700 }}>● High density precision</span>
            </div>
          </div>

          {/* Card 3: High net worth (4 cols) */}
          <div
            className="interactive-tilt"
            style={{
              gridColumn: 'span 4',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E6E7E3',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '360px',
              boxShadow: '0 2px 8px rgba(20, 25, 40, 0.05)',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111318', margin: '0 0 0.5rem 0' }}>
                High net worth
              </h3>
              <p style={{ fontSize: '13px', color: '#626873', lineHeight: 1.5, margin: 0 }}>
                Focus strictly on high-value clients with verifiable wealth, liquidity triggers, and proven buying power.
              </p>
            </div>

            {/* Banknotes Art */}
            <div style={{ position: 'relative', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{
                  width: '180px',
                  height: '90px',
                  backgroundColor: '#EAF7EE',
                  border: '2px solid #A3D9B1',
                  borderRadius: '10px',
                  transform: 'rotate(-6deg) translate(8px, 8px)',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: 0.85,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', fontFamily: 'monospace', fontWeight: 700, color: '#15803D' }}>
                  <span>FEDERAL RESERVE</span>
                  <span>$100</span>
                </div>
                <div style={{ textAlign: 'center', fontWeight: 800, color: '#15803D', fontSize: '14px' }}>$</div>
                <div style={{ fontSize: '7px', fontFamily: 'monospace', color: '#15803D', textAlign: 'right' }}>100 DOLLARS</div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  width: '190px',
                  height: '95px',
                  backgroundColor: '#F0FDF4',
                  border: '2px solid #22C55E',
                  borderRadius: '10px',
                  transform: 'rotate(5deg) translate(-6px, -4px)',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 12px 24px rgba(16, 185, 129, 0.15)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'monospace', fontWeight: 800, color: '#15803D' }}>
                  <span>UNITED STATES</span>
                  <span>$100</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#DCFCE7', border: '1px solid #16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#15803D', fontSize: '12px' }}>$</div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#111318' }}>$1.5M+ Min</div>
                    <div style={{ fontSize: '8px', color: '#626873' }}>Verifiable Assets</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7px', fontFamily: 'monospace', color: '#15803D' }}>
                  <span>SERIES 2026</span>
                  <span>LIQUIDITY READY</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#626873', borderTop: '1px solid #F1F2ED', paddingTop: '0.75rem' }}>
              <span>Minimum asset floor</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>$1.5M+ Average</span>
            </div>
          </div>

          {/* Card 4: High propensity (4 cols) */}
          <div
            className="interactive-tilt"
            style={{
              gridColumn: 'span 4',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E6E7E3',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '360px',
              boxShadow: '0 2px 8px rgba(20, 25, 40, 0.05)',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111318', margin: '0 0 0.5rem 0' }}>
                High propensity
              </h3>
              <p style={{ fontSize: '13px', color: '#626873', lineHeight: 1.5, margin: 0 }}>
                Target high-intent clients and candidates at the exact moment they are ready to transact.
              </p>
            </div>

            {/* Circular Gauge Diagram */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem 0' }}>
              <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#F1F3F5" strokeWidth="10" fill="transparent"/>
                  <circle cx="50" cy="50" r="40" stroke="#10B981" strokeWidth="10" strokeLinecap="round" fill="transparent"
                          strokeDasharray="251.2" strokeDashoffset="30.1"/>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '26px', fontWeight: 900, color: '#111318', letterSpacing: '-0.03em' }}>88%</span>
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', color: '#10B981' }}>Propensity</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#626873', borderTop: '1px solid #F1F2ED', paddingTop: '0.75rem' }}>
              <span>Timing score model</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>● 4.2x Close Rate</span>
            </div>
          </div>

          {/* Card 5: Emerald Green View Pricing Card (4 cols) */}
          <a
            href="#pricing-section"
            className="interactive-tilt dollar-pattern"
            style={{
              gridColumn: 'span 4',
              backgroundColor: '#0F6B45',
              borderRadius: '24px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '360px',
              color: '#FFFFFF',
              textDecoration: 'none',
              boxShadow: '0 10px 30px rgba(15, 107, 69, 0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.9 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                ✦
              </div>
              <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#A7F3D0', backgroundColor: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '9999px' }}>
                TRANSPARENT ROI
              </div>
            </div>

            <div style={{ marginTop: '2.5rem' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>View pricing</span>
                <span style={{ fontSize: '1.85rem', fontWeight: 300 }}>→</span>
              </div>
              <p style={{ color: 'rgba(209, 250, 229, 0.85)', fontSize: '14px', lineHeight: 1.6, marginTop: '0.75rem' }}>
                Unlock your pipeline with our predictable, transparent pricing tiers designed for high-growth firms.
              </p>
            </div>

            <div style={{ fontSize: '11px', color: 'rgba(209, 250, 229, 0.8)', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>No long-term locks</span>
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>Get started in 5 min</span>
            </div>
          </a>
        </div>
      </section>

      {/* SECTION DIVIDER: PLATFORM BENTO ➔ WHY ACHARE */}
      <SectionDivider />

      {/* 4.3 OUR APPROACH - DARK 3D ISOMETRIC GRID (CATALYZE AI REF 2) */}
      <section
        id="our-approach"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '2.5rem 2rem',
          position: 'relative',
        }}
      >
        <div id="connected-workflow" style={{ position: 'absolute', top: '-6rem', pointerEvents: 'none' }} />
        <div
          style={{
            backgroundColor: '#0B1017',
            borderRadius: '32px',
            border: '1px solid #1F2937',
            padding: '3.5rem 3rem',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* TOP ROW: Heading + Narrative (Left) & "5 tools → 1 platform" Card (Right) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              paddingBottom: '2.5rem',
              borderBottom: '1px solid #1E293B',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Left Col: Badge, Heading, Subtitle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: '#13221C',
                  border: '1px solid #1F3E30',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#34D399',
                  width: 'fit-content',
                }}
              >
                <span>✦</span> WHY ACHARE
              </div>

              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
                One person. One record.<br />
                <span style={{ color: '#34D399' }}>One unified timeline.</span>
              </h2>

              <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.6, margin: 0, maxWidth: '34rem' }}>
                Stop pasting candidate records into spreadsheets, re-entering employee data into payroll, and chasing contracts across email. Achare replaces 5 fragmented tools with a single connected thread from initial lead to seasoned executive.
              </p>
            </div>

            {/* Right Col: "5 tools → 1 platform" Card Next to Heading */}
            <div
              style={{
                backgroundColor: '#131B26',
                border: '1px solid #1E293B',
                borderRadius: '20px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1, letterSpacing: '-0.04em' }}>5</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706' }}>tools</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#68D39A' }}>→</span>
                <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1, letterSpacing: '-0.04em' }}>1</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34D399' }}>platform</span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                Consolidate your CRM, ATS, HR, Time Tracking, and Payroll into a single source of truth. Zero sync lag.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span>See Pricing</span>
                  <IconArrowRight size={15} />
                </button>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  CRM ➔ ATS ➔ HR ➔ PAY
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: 4 Tabs (Left) & 3D Isometric Visualization (Right) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
              paddingTop: '2.5rem',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Left Col: 4 Tabs with right border divider */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                paddingRight: '1.5rem',
                borderRight: '1px solid #1E293B',
              }}
            >
              {[
                { num: 1, title: 'Single Database', stat: 'PostgreSQL', desc: 'One shared PostgreSQL database powers every module. No sync jobs, no mapping layers, no stale copies.' },
                { num: 2, title: 'Connected Records', stat: 'Zero Duplication', desc: 'A candidate record becomes an employee record. Interview notes flow into onboarding. Timesheets feed payroll. No manual handoffs.' },
                { num: 3, title: 'Unified Timeline', stat: '6 Modules', desc: 'One continuous activity timeline from initial lead discovery to contract signing, daily time tracking, and bi-weekly payroll execution.' },
                { num: 4, title: 'Open Source Core', stat: 'Full Access', desc: 'Inspect every line of code. Deploy on your own infrastructure. No vendor lock-in, ever.' },
              ].map((t) => {
                const isActive = approachTab === t.num;
                return (
                  <div
                    key={t.num}
                    onClick={() => setApproachTab(t.num)}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      border: isActive ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid #1E293B',
                      backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(19, 27, 38, 0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, color: isActive ? '#FFFFFF' : '#94A3B8', fontSize: '15px' }}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: isActive ? '#10B981' : '#334155', color: isActive ? '#000000' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900 }}>
                          {t.num}
                        </span>
                        <span>{t.title}</span>
                      </div>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: isActive ? '#34D399' : '#64748B' }}>{t.stat}</span>
                    </div>
                    {isActive && (
                      <p style={{ color: '#CBD5E1', fontSize: '12px', lineHeight: 1.5, margin: '0.5rem 0 0 2rem' }}>
                        {t.desc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Col: 3D Isometric Visualization */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div
                className="isometric-stage"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
                  const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
                  setIsoAngle({ rotX: 54 - dy * 10, rotZ: -34 + dx * 12 });
                }}
                onMouseLeave={() => setIsoAngle({ rotX: 54, rotZ: -34 })}
                style={{ width: '100%', height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab' }}
              >
                <div
                  className="isometric-plane"
                  style={{
                    position: 'relative',
                    width: '320px',
                    height: '320px',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(15, 29, 43, 0.9) 0%, rgba(10, 16, 24, 0.95) 100%)',
                    transform: `rotateX(${isoAngle.rotX}deg) rotateZ(${isoAngle.rotZ}deg)`,
                  }}
                >
                  {/* Pillar 1 */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '40px',
                      left: '40px',
                      width: '45px',
                      height: approachTab === 1 ? '150px' : '120px',
                      background: 'linear-gradient(to top, #064E3B, #059669, #34D399)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: approachTab === 1 ? '0 0 25px rgba(16, 185, 129, 0.8)' : '0 0 10px rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.4s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      paddingTop: '4px',
                    }}
                  >
                    <div style={{ width: '35px', height: '8px', borderRadius: '4px', backgroundColor: '#A7F3D0' }} />
                    <span style={{ fontSize: '8px', fontFamily: 'monospace', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>40M+</span>
                  </div>

                  {/* Pillar 2 */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '80px',
                      left: '110px',
                      width: '45px',
                      height: approachTab === 2 ? '190px' : '160px',
                      background: 'linear-gradient(to top, #164E63, #0891B2, #38BDF8)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: approachTab === 2 ? '0 0 25px rgba(6, 182, 212, 0.8)' : '0 0 10px rgba(6, 182, 212, 0.3)',
                      transition: 'all 0.4s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      paddingTop: '4px',
                    }}
                  >
                    <div style={{ width: '35px', height: '8px', borderRadius: '4px', backgroundColor: '#BAE6FD' }} />
                    <span style={{ fontSize: '8px', fontFamily: 'monospace', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>EVENTS</span>
                  </div>

                  {/* Pillar 3 */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '50px',
                      right: '90px',
                      width: '45px',
                      height: approachTab === 3 ? '220px' : '190px',
                      background: 'linear-gradient(to top, #022C22, #10B981, #6EE7B7)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: approachTab === 3 ? '0 0 35px rgba(16, 185, 129, 0.9)' : '0 0 15px rgba(16, 185, 129, 0.4)',
                      transition: 'all 0.4s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      paddingTop: '4px',
                    }}
                  >
                    <div style={{ width: '35px', height: '8px', borderRadius: '4px', backgroundColor: '#FFFFFF' }} />
                    <span style={{ fontSize: '8px', fontFamily: 'monospace', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>98.4%</span>
                  </div>

                  {/* Pillar 4 */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '100px',
                      right: '30px',
                      width: '45px',
                      height: approachTab === 4 ? '170px' : '140px',
                      background: 'linear-gradient(to top, #312E81, #4F46E5, #818CF8)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: approachTab === 4 ? '0 0 25px rgba(99, 102, 241, 0.8)' : '0 0 10px rgba(99, 102, 241, 0.3)',
                      transition: 'all 0.4s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      paddingTop: '4px',
                    }}
                  >
                    <div style={{ width: '35px', height: '8px', borderRadius: '4px', backgroundColor: '#C7D2FE' }} />
                    <span style={{ fontSize: '8px', fontFamily: 'monospace', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>QUEUE</span>
                  </div>

                  {/* Floating HUD Badges */}
                  <div style={{ position: 'absolute', top: '-15px', left: '15px', backgroundColor: 'rgba(19, 27, 38, 0.9)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 10px', borderRadius: '8px', fontSize: '9px', fontFamily: 'monospace', color: '#6EE7B7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    Trigger: Series B ($42M)
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748B', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10B981' }}>●</span> Move mouse over stage to rotate 3D perspective
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION DIVIDER: OUR APPROACH ➔ FEATURES */}
      <SectionDivider />

      {/* 5. FEATURES SHOWCASE (INSPIRED BY ACHARE FEATURE BLUEPRINT / feature.png) */}
      <section id="features" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 2rem 3rem 2rem', display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
        
        {/* Section 0: Feature Intro Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <div style={{ borderRight: '1px solid #E6E7E3', paddingRight: '2.5rem' }}>
            <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#2563EB', marginBottom: '0.75rem' }}>
              FEATURES
            </span>
            <h2 style={{ fontSize: 'clamp(2.5rem, 4.5vw, 3.8rem)', fontWeight: 800, color: '#111318', letterSpacing: '-0.035em', lineHeight: 1.08, margin: '0 0 1.25rem 0' }}>
              Everything your<br />team needs.<br />In one workspace.
            </h2>
            <p style={{ fontSize: '17px', color: '#525866', lineHeight: 1.6, maxWidth: '28rem', margin: '0 0 2rem 0' }}>
              From recruitment to payroll, Achare brings all your people operations together — so you can work smarter, not harder.
            </p>
            <a href="#recruitment-crm" className="achare-btn-primary" style={{ padding: '0.85rem 1.6rem', fontSize: '14px' }}>
              <span>Explore All Features</span>
              <IconArrowRight size={15} />
            </a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px', height: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Soft Lilac Disc */}
              <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', backgroundColor: '#E4DEFC', top: '20px', left: '20px' }} />

              {/* Purple Triangle Accent (Top Right) */}
              <div style={{ position: 'absolute', top: '-12px', right: '32px', zIndex: 10 }}>
                <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
                  <polygon points="23,0 46,46 0,46" fill="#8B5CF6" transform="rotate(22 23 23)" />
                </svg>
              </div>

              {/* Emerald Mini Triangle Accent (Bottom Left) */}
              <div style={{ position: 'absolute', bottom: '24px', left: '12px', zIndex: 10 }}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <polygon points="15,0 30,30 0,30" fill="#10B981" transform="rotate(-30 15 15)" />
                </svg>
              </div>

              {/* Cutout Portrait: Woman holding tablet */}
              <div style={{ position: 'relative', zIndex: 10, width: '280px', height: '360px', overflow: 'hidden', borderBottomLeftRadius: '9999px', borderBottomRightRadius: '9999px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80"
                  alt="Operations Lead"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>

              {/* Floating Module Directory Card */}
              <div style={{ position: 'absolute', right: '-10px', top: '40px', zIndex: 20, width: '210px', backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1rem', boxShadow: '0 12px 36px rgba(20,25,40,0.08)', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.35rem 0.5rem', borderRadius: '10px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconUsers size={14} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#111318' }}>Recruitment</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.35rem 0.5rem', borderRadius: '10px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconUser size={14} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#111318' }}>Employees</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.35rem 0.5rem', borderRadius: '10px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconClock size={14} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#111318' }}>Time Tracking</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.35rem 0.5rem', borderRadius: '10px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconWallet size={14} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#111318' }}>Payroll</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.35rem 0.5rem', borderRadius: '10px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#FFE4E6', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconFileText size={14} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#111318' }}>Documents</span>
                </div>
              </div>

              {/* Handwritten Annotation: "One platform for what matters." */}
              <div style={{ position: 'absolute', bottom: '-28px', right: '0px', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', userSelect: 'none' }}>
                <span style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: '22px', color: '#374151', transform: 'rotate(-5deg)', fontWeight: 600 }}>
                  One platform for what matters.
                </span>
                <svg width="60" height="36" viewBox="0 0 60 36" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 45 4 C 30 18, 15 22, 6 28" />
                  <path d="M 6 28 L 13 22" />
                  <path d="M 6 28 L 11 34" />
                </svg>
              </div>

            </div>
          </div>
        </div>

        {/* FEATURE SUB-DIVIDER */}
        <div style={{ borderTop: '1px solid #E6E7E3' }} />

        {/* Section 01: RECRUITMENT CRM */}
        <div id="recruitment-crm" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <div style={{ borderRight: '1px solid #E6E7E3', paddingRight: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#7C3AED' }}>01</span>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#7C3AED' }}>
                RECRUITMENT CRM
              </span>
            </div>
            <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#111318', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem 0' }}>
              Turn hiring into<br />a growth engine.
            </h3>
            <p style={{ fontSize: '16px', color: '#525866', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Manage jobs, candidates, interviews and communication — all in one connected pipeline.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => setDemoModalOpen(true)}
                style={{ background: 'none', border: 'none', color: '#7C3AED', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: 0 }}
              >
                <span>Explore Recruitment</span>
                <span>→</span>
              </button>
              <button
                onClick={() => setCandAdvancementState((prev) => (prev + 1) % 3)}
                style={{ fontSize: '12px', padding: '0.4rem 0.85rem', borderRadius: '9999px', backgroundColor: '#F3E8FF', color: '#7C3AED', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Advance Candidate</span>
                <IconPlayerPlay size={12} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '540px' }}>
              
              {/* Soft Mint Disc */}
              <div style={{ position: 'absolute', width: '360px', height: '360px', borderRadius: '50%', backgroundColor: '#CBF0DD', top: '-15px', left: '50%', transform: 'translateX(-50%)' }} />

              {/* Sunburst Doodle */}
              <div style={{ position: 'absolute', top: '-10px', right: '35px', zIndex: 10, color: '#3B82F6' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M16 4v6" />
                  <path d="M7.5 7.5l4.2 4.2" />
                  <path d="M24.5 7.5l-4.2 4.2" />
                </svg>
              </div>

              {/* White Pipeline Card */}
              <div style={{ position: 'relative', zIndex: 10, backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 14px 40px rgba(20,25,40,0.07)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F1', paddingBottom: '0.65rem', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111318' }}>Candidates</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '12px', color: '#525866' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <span>Active pipeline: <strong style={{ color: '#111318' }}>67</strong></span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', textAlign: 'center', fontSize: '12px' }}>
                  <div style={{ backgroundColor: '#FAF9F5', borderRadius: '12px', padding: '0.6rem 0.35rem', border: '1px solid #EBEBE6' }}>
                    <div style={{ fontSize: '11px', color: '#717684' }}>New</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#111318' }}>24</div>
                  </div>
                  <div style={{ backgroundColor: '#FAF9F5', borderRadius: '12px', padding: '0.6rem 0.35rem', border: '1px solid #EBEBE6' }}>
                    <div style={{ fontSize: '11px', color: '#717684' }}>Screening</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#111318' }}>18</div>
                  </div>
                  <div style={{ backgroundColor: '#F4EFFF', borderRadius: '12px', padding: '0.6rem 0.35rem', border: '1px solid rgba(124,58,237,0.3)' }}>
                    <div style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700 }}>Interview</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#7C3AED' }}>{candAdvancementState === 0 ? 9 : 8}</div>
                  </div>
                  <div style={{ backgroundColor: '#FAF9F5', borderRadius: '12px', padding: '0.6rem 0.35rem', border: '1px solid #EBEBE6' }}>
                    <div style={{ fontSize: '11px', color: '#717684' }}>Offer</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: candAdvancementState === 1 ? '#7C3AED' : '#111318' }}>
                      {candAdvancementState === 1 ? 5 : 4}
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#EBFBF2', borderRadius: '12px', padding: '0.6rem 0.35rem', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>Hired</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#10B981' }}>{candAdvancementState === 2 ? 13 : 12}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FEATURE SUB-DIVIDER */}
        <div style={{ borderTop: '1px solid #E6E7E3' }} />

        {/* Section 02: JOBS */}
        <div id="jobs" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <div style={{ borderRight: '1px solid #E6E7E3', paddingRight: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#EA580C' }}>02</span>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#EA580C' }}>
                JOBS
              </span>
            </div>
            <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#111318', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem 0' }}>
              Create opportunities.<br />Find the right people.
            </h3>
            <p style={{ fontSize: '16px', color: '#525866', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Post jobs, assign them to your team and track progress from one place.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={() => setDemoModalOpen(true)}
                style={{ background: 'none', border: 'none', color: '#EA580C', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: 0 }}
              >
                <span>Explore Jobs</span>
                <span>→</span>
              </button>

              <span style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: '22px', color: '#374151', transform: 'rotate(-3deg)', fontWeight: 600, userSelect: 'none' }}>
                Great people<br />build great<br />companies.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px', height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Peach Disc */}
              <div style={{ position: 'absolute', width: '340px', height: '340px', borderRadius: '50%', backgroundColor: '#FDE2D0', top: '25px', left: '25px' }} />

              {/* Sunburst Doodle */}
              <div style={{ position: 'absolute', top: '5px', right: '25px', zIndex: 10, color: '#3B82F6' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M16 4v6" />
                  <path d="M7.5 7.5l4.2 4.2" />
                  <path d="M24.5 7.5l-4.2 4.2" />
                </svg>
              </div>

              {/* Portrait: Smiling man with glasses in green shirt */}
              <div style={{ position: 'relative', zIndex: 10, width: '270px', height: '350px', overflow: 'hidden', borderBottomLeftRadius: '9999px', borderBottomRightRadius: '9999px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80"
                  alt="Talent Lead"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>

              {/* Job Card Overlay */}
              <div style={{ position: 'absolute', right: '-15px', bottom: '40px', zIndex: 20, width: '240px', backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.1rem', boxShadow: '0 12px 36px rgba(20,25,40,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#111318' }}>Frontend Developer</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '0.65rem' }}>Engineering · Full-time</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F3F4F1', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#111318' }}>12 Candidates</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                    Open
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FEATURE SUB-DIVIDER */}
        <div style={{ borderTop: '1px solid #E6E7E3' }} />

        {/* Section 03: EMPLOYEES (REVERSED) */}
        <div id="employees" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', borderRight: '1px solid #E6E7E3', paddingRight: '2.5rem' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px', height: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Butter Disc */}
              <div style={{ position: 'absolute', width: '340px', height: '340px', borderRadius: '50%', backgroundColor: '#FEF08A', top: '20px', left: '30px' }} />

              {/* Hand-drawn Loop Annotation */}
              <div style={{ position: 'absolute', left: '-15px', top: '35px', zIndex: 20, userSelect: 'none', pointerEvents: 'none' }}>
                <div style={{ position: 'relative', padding: '0.75rem' }}>
                  <span style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: '20px', color: '#374151', fontWeight: 600, display: 'block', transform: 'rotate(-4deg)', lineHeight: 1.2 }}>
                    One person.<br />One record.<br />One timeline.
                  </span>
                  <svg width="150" height="90" viewBox="0 0 160 110" fill="none" stroke="#CA8A04" strokeWidth="1.6" strokeLinecap="round" style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
                    <path d="M 20,55 C 15,15 145,10 150,55 C 155,95 20,105 22,60 C 24,35 125,25 145,55" />
                    <path d="M 145,55 C 150,65 155,75 160,85" />
                    <path d="M 160,85 L 150,82" />
                  </svg>
                </div>
              </div>

              {/* Aisha Khan Card */}
              <div style={{ position: 'relative', zIndex: 10, width: '260px', backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 14px 40px rgba(20,25,40,0.08)', border: '1px solid rgba(0,0,0,0.06)', marginLeft: '6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&q=80"
                    alt="Aisha Khan"
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#111318' }}>Aisha Khan</div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>UI/UX Designer</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '12px' }}>
                  {(['profile', 'employment', 'attendance', 'payroll', 'documents', 'activity'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAishaTab(tab)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: aishaTab === tab ? 700 : 500,
                        backgroundColor: aishaTab === tab ? '#EDE9FE' : 'transparent',
                        color: aishaTab === tab ? '#7C3AED' : '#525866',
                        textTransform: 'capitalize',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{tab}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div style={{ paddingLeft: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#D97706' }}>03</span>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#D97706' }}>
                EMPLOYEES
              </span>
            </div>
            <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#111318', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem 0' }}>
              A complete view<br />of your people.
            </h3>
            <p style={{ fontSize: '16px', color: '#525866', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Keep all employee information, documents, attendance and payroll in one place.
            </p>
            <button
              onClick={() => setDemoModalOpen(true)}
              style={{ background: 'none', border: 'none', color: '#D97706', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: 0 }}
            >
              <span>Explore Employee Management</span>
              <span>→</span>
            </button>
          </div>

        </div>

        {/* FEATURE SUB-DIVIDER */}
        <div style={{ borderTop: '1px solid #E6E7E3' }} />

        {/* Section 04: TIME TRACKING */}
        <div id="time-tracking" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <div style={{ borderRight: '1px solid #E6E7E3', paddingRight: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#059669' }}>04</span>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#059669' }}>
                TIME TRACKING
              </span>
            </div>
            <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#111318', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem 0' }}>
              Know where time<br />goes, without the<br />hassle.
            </h3>
            <p style={{ fontSize: '16px', color: '#525866', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Make time tracking simple for your team and get the insights you need.
            </p>
            <button
              onClick={() => setDemoModalOpen(true)}
              style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: 0 }}
            >
              <span>Explore Time Tracking</span>
              <span>→</span>
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px', height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Mint Disc */}
              <div style={{ position: 'absolute', width: '340px', height: '340px', borderRadius: '50%', backgroundColor: '#CBF0DD', top: '15px', left: '20px' }} />

              {/* Purple Wedge Accent */}
              <div style={{ position: 'absolute', bottom: '25px', right: '35px', zIndex: 10 }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <polygon points="0,60 60,60 60,0" fill="#8B5CF6" />
                </svg>
              </div>

              {/* Clock In Floating Card */}
              <div style={{ position: 'absolute', top: '35px', left: '30px', zIndex: 20, backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '0.85rem 1.25rem', boxShadow: '0 12px 36px rgba(20,25,40,0.08)', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: isClockedIn ? '#10B981' : '#6B7280', textTransform: 'uppercase' }}>
                    {isClockedIn ? 'Clocked In' : 'Clock In'}
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#111318' }}>
                    {isClockedIn ? '09:02 AM' : '05:30 PM'}
                  </div>
                </div>
                <button
                  onClick={() => setIsClockedIn(!isClockedIn)}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#16A34A', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <IconArrowRight size={16} />
                </button>
              </div>

              {/* Bar Chart Weekly Card */}
              <div style={{ position: 'absolute', bottom: '40px', left: '70px', zIndex: 20, backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.25rem', width: '240px', boxShadow: '0 14px 40px rgba(20,25,40,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>This Week</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#111318', marginBottom: '0.65rem' }}>38h 12m</div>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.4rem', height: '60px' }}>
                  {[
                    { day: 'M', h: '32px', c: '#C7D2FE' },
                    { day: 'T', h: '44px', c: '#A5B4FC' },
                    { day: 'W', h: '56px', c: '#818CF8' },
                    { day: 'T', h: '48px', c: '#6366F1' },
                    { day: 'F', h: '28px', c: '#C7D2FE' },
                  ].map((bar) => (
                    <div key={bar.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <div style={{ width: '100%', height: bar.h, backgroundColor: bar.c, borderRadius: '9999px' }} />
                      <span style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '4px' }}>{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hand-drawn Annotation */}
              <div style={{ position: 'absolute', top: '-15px', right: '10px', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none', pointerEvents: 'none' }}>
                <span style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: '20px', color: '#374151', transform: 'rotate(2deg)', fontWeight: 600, textAlign: 'right' }}>
                  Simple for your team.<br />Powerful for you.
                </span>
                <svg width="55" height="35" viewBox="0 0 60 40" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 45 4 C 40 20, 25 28, 12 30" />
                  <path d="M 12 30 L 20 25" />
                </svg>
              </div>

            </div>
          </div>
        </div>

        {/* FEATURE SUB-DIVIDER */}
        <div style={{ borderTop: '1px solid #E6E7E3' }} />

        {/* Section 05: PAYROLL (REVERSED) */}
        <div id="payroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', borderRight: '1px solid #E6E7E3', paddingRight: '2.5rem' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px', height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Lilac Disc */}
              <div style={{ position: 'absolute', width: '340px', height: '340px', borderRadius: '50%', backgroundColor: '#E4DEFC', top: '20px', left: '30px' }} />

              {/* Amber Triangle Accent */}
              <div style={{ position: 'absolute', bottom: '15px', left: '25px', zIndex: 10 }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <polygon points="20,0 40,40 0,40" fill="#F59E0B" transform="rotate(35 20 20)" />
                </svg>
              </div>

              {/* Portrait: Smiling woman with glasses and bun */}
              <div style={{ position: 'relative', zIndex: 10, width: '270px', height: '350px', overflow: 'hidden', borderBottomLeftRadius: '9999px', borderBottomRightRadius: '9999px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80"
                  alt="Payroll Specialist"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>

              {/* Status Pill Card */}
              <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '-15px', zIndex: 20, backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '0.75rem 1.1rem', boxShadow: '0 12px 36px rgba(20,25,40,0.08)', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconCheck size={16} stroke={2.5} />
                </div>
                <div style={{ fontSize: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#111318' }}>Payroll Processed</div>
                  <div style={{ color: '#16A34A', fontWeight: 600, fontSize: '11px' }}>Successfully</div>
                </div>
              </div>

              {/* 4-Step Checklist Card */}
              <div style={{ position: 'absolute', top: '40px', right: '0px', zIndex: 20, backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1rem', width: '170px', boxShadow: '0 14px 40px rgba(20,25,40,0.08)', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Prepare', 'Review', 'Approve'].map((step) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', fontWeight: 600, color: '#111318' }}>
                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</span>
                    <span>{step}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', fontWeight: 500, color: '#717684' }}>
                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>○</span>
                  <span>Process</span>
                </div>
              </div>

            </div>
          </div>

          <div style={{ paddingLeft: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#6366F1' }}>05</span>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#6366F1' }}>
                PAYROLL
              </span>
            </div>
            <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#111318', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem 0' }}>
              Turn work into<br />a seamless payroll.
            </h3>
            <p style={{ fontSize: '16px', color: '#525866', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Automatically bring tracked time and employee data into a streamlined payroll workflow.
            </p>
            <button
              onClick={() => setDemoModalOpen(true)}
              style={{ background: 'none', border: 'none', color: '#6366F1', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: 0 }}
            >
              <span>Explore Payroll</span>
              <span>→</span>
            </button>
          </div>

        </div>

        {/* FEATURE SUB-DIVIDER */}
        <div style={{ borderTop: '1px solid #E6E7E3' }} />

        {/* Section 06: DOCUMENTS */}
        <div id="documents" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <div style={{ borderRight: '1px solid #E6E7E3', paddingRight: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#E11D48' }}>06</span>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#E11D48' }}>
                DOCUMENTS
              </span>
            </div>
            <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#111318', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem 0' }}>
              All your files.<br />Finally in one place.
            </h3>
            <p style={{ fontSize: '16px', color: '#525866', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Contracts, payslips, policies and everything in between — organized and easy to find.
            </p>
            <button
              onClick={() => setDemoModalOpen(true)}
              style={{ background: 'none', border: 'none', color: '#E11D48', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: 0 }}
            >
              <span>Explore Documents</span>
              <span>→</span>
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: '1.5rem' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px', height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Peach Disc */}
              <div style={{ position: 'absolute', width: '340px', height: '340px', borderRadius: '50%', backgroundColor: '#FDE2D0', top: '15px', left: '25px' }} />

              {/* Emerald Triangle Accent */}
              <div style={{ position: 'absolute', bottom: '20px', right: '35px', zIndex: 10 }}>
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <polygon points="17,0 34,34 0,34" fill="#10B981" transform="rotate(-20 17 17)" />
                </svg>
              </div>

              {/* Cascading Fanned Cards */}
              <div
                onMouseEnter={() => setDocHovered(true)}
                onMouseLeave={() => setDocHovered(false)}
                style={{ position: 'relative', zIndex: 10, width: '230px', height: '220px', cursor: 'pointer' }}
              >
                {/* Certificate */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transform: docHovered ? 'translate(80px, -28px) rotate(14deg)' : 'translate(44px, -14px) rotate(7deg)',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconAward size={14} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#111318' }}>Certificate</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#9CA3AF' }}>Verified</span>
                </div>

                {/* Policy */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transform: docHovered ? 'translate(54px, -20px) rotate(8deg)' : 'translate(30px, -10px) rotate(4deg)',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconShieldCheck size={14} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#111318' }}>Policy</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#9CA3AF' }}>SOC 2 v2.4</span>
                </div>

                {/* Payslip */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transform: docHovered ? 'translate(28px, -12px) rotate(2deg)' : 'translate(15px, -5px) rotate(2deg)',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconReceipt size={14} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#111318' }}>Payslip</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#9CA3AF' }}>March 2026</span>
                </div>

                {/* Contract (Front) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '1.25rem',
                    boxShadow: '0 14px 40px rgba(20,25,40,0.09)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transform: docHovered ? 'translateY(-6px) rotate(-4deg)' : 'none',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FFE4E6', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                      <IconFileText size={18} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#111318' }}>Employment</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>Contract.pdf</div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', paddingTop: '0.5rem', borderTop: '1px solid #F3F4F1' }}>
                    2.4 MB
                  </div>
                </div>
              </div>

              {/* Hand-drawn Annotation */}
              <div style={{ position: 'absolute', top: '-15px', right: '15px', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none', pointerEvents: 'none' }}>
                <span style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: '20px', color: '#374151', transform: 'rotate(-3deg)', fontWeight: 600, textAlign: 'right' }}>
                  Less searching.<br />More progress.
                </span>
                <svg width="55" height="35" viewBox="0 0 60 40" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 45 6 C 35 22, 20 28, 8 32" />
                  <path d="M 8 32 L 16 26" />
                </svg>
              </div>

            </div>
          </div>
        </div>

        {/* FEATURE SUB-DIVIDER */}
        <div style={{ borderTop: '1px solid #E6E7E3' }} />

        {/* Section 07: READY TO GET STARTED? (WORKSPACE CALLOUT BANNER) */}
        <div style={{ backgroundColor: '#EEF4FF', borderRadius: '28px', padding: '3.5rem', border: '1px solid #DCE7FD', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#2563EB', marginBottom: '0.75rem' }}>
                READY TO GET STARTED?
              </span>
              <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#111318', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem 0' }}>
                Build a workspace<br />that works for you.
              </h3>
              <p style={{ fontSize: '16px', color: '#525866', lineHeight: 1.6, maxWidth: '28rem', margin: '0 0 2rem 0' }}>
                Choose the features you need and start your Achare journey today.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <a href="#pricing-section" className="achare-btn-primary" style={{ padding: '0.85rem 1.6rem', fontSize: '14px' }}>
                  <span>Buy Achare</span>
                  <IconArrowRight size={15} />
                </a>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="achare-btn-secondary"
                  style={{ padding: '0.85rem 1.6rem', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#E0E7FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconPlayerPlay size={10} />
                  </span>
                  <span>Explore Demo</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', userSelect: 'none', pointerEvents: 'none' }}>
                <svg width="45" height="30" viewBox="0 0 50 36" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 6 30 C 15 15, 30 10, 42 12" />
                  <path d="M 42 12 L 34 8" />
                </svg>
                <span style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: '20px', color: '#374151', transform: 'rotate(-2deg)', fontWeight: 600 }}>
                  Your workspace. Your rules.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '260px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Cobalt Blue Fan */}
                <div style={{ width: '160px', height: '160px', backgroundColor: '#2563EB', borderTopLeftRadius: '9999px', boxShadow: '0 8px 24px rgba(37,99,235,0.2)' }} />
                {/* Hot Pink Circle */}
                <div style={{ position: 'absolute', top: '10px', right: '15px', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EC4899' }} />
                {/* Soft Backdrop */}
                <div style={{ position: 'absolute', bottom: '-5px', left: '-5px', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#DBEAFE', zIndex: -1 }} />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* SECTION DIVIDER: FEATURES ➔ PRICING */}
      <SectionDivider />

      {/* 6. PRICING SECTION */}
      <section id="pricing-section" style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 2rem 3rem 2rem' }}>
        
        <div style={{ textAlign: 'center', maxWidth: '42rem', margin: '0 auto 3rem auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#9297A1', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            TRANSPARENT PLANS
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#111318', margin: '0 0 1rem 0' }}>
            Simple, honest pricing for growing teams.
          </h2>
          <p style={{ fontSize: '15px', color: '#626873', margin: '0 0 1.5rem 0' }}>
            No hidden implementation fees. All plans include full unified people &amp; revenue operations.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#E8F0EA', border: '1px solid rgba(45, 106, 90, 0.3)', padding: '0.45rem 1rem', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, color: '#2D6A5A' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#36B978', display: 'inline-block' }} />
            <span>LIFETIME LICENSE — PAY ONCE, OWN FOREVER • NO RECURRING SAAS FEES</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          
          {/* Startup Tier */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E7E3', borderRadius: '28px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#9297A1', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Startup</div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#36B978', backgroundColor: '#E8F0EA', padding: '0.15rem 0.6rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lifetime License</span>
              </div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#111318', marginBottom: '0.5rem' }}>
                ₹49,999<span style={{ fontSize: '14px', fontWeight: 400, color: '#626873' }}> / one-time</span>
              </div>

              {/* Maintenance Callout */}
              <div style={{ backgroundColor: '#F5EDE4', color: '#D97706', border: '1px solid rgba(217, 119, 6, 0.2)', borderRadius: '14px', padding: '0.75rem', fontSize: '12px', margin: '0.75rem 0 1.25rem 0' }}>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>🎁</span> +1 Year Maintenance on Us
                </div>
                <div style={{ fontSize: '11px', color: '#A25700', marginTop: '3px', lineHeight: 1.4 }}>
                  Includes automated daily data backups &amp; continuous new feature releases.
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#626873', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                For early-stage startups and high-velocity teams looking to unify CRM, candidate tracking, and employee records under one roof.
              </p>
              <div style={{ borderTop: '1px solid #E6E7E3', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Lifetime software access &amp; ownership</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Up to 25 team members</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Complete CRM &amp; Deal Pipeline</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Recruitment &amp; Candidate Tracking</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Employee Directory &amp; Records</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> <strong>1 Year Maintenance &amp; Backups on Us</strong></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Self-Host or 1-Click Cloud Deploy</div>
              </div>
            </div>
            <button onClick={() => setDemoModalOpen(true)} className="achare-btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }}>
              Get Started with Startup
            </button>
          </div>

          {/* SME Tier (Recommended) */}
          <div style={{ backgroundColor: '#FFFFFF', border: '2px solid #2D6A5A', borderRadius: '28px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', boxShadow: '0 10px 30px rgba(45, 106, 90, 0.12)' }}>
            <div style={{ position: 'absolute', top: '-12px', right: '1.5rem', backgroundColor: '#2D6A5A', color: '#FFFFFF', fontSize: '10px', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
              Most Popular
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#2D6A5A', textTransform: 'uppercase', marginBottom: '0.5rem' }}>SME</div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#2D6A5A', backgroundColor: '#E8F0EA', padding: '0.15rem 0.6rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lifetime License</span>
              </div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#111318', marginBottom: '0.5rem' }}>
                ₹99,999<span style={{ fontSize: '14px', fontWeight: 400, color: '#626873' }}> / one-time</span>
              </div>

              {/* Maintenance Callout */}
              <div style={{ backgroundColor: '#E8F0EA', color: '#2D6A5A', border: '1px solid rgba(45, 106, 90, 0.2)', borderRadius: '14px', padding: '0.75rem', fontSize: '12px', margin: '0.75rem 0 1.25rem 0' }}>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#1A453A' }}>
                  <span>🎁</span> +1 Year Maintenance on Us
                </div>
                <div style={{ fontSize: '11px', color: '#2D6A5A', marginTop: '3px', lineHeight: 1.4 }}>
                  Includes automated cloud data backups &amp; continuous feature upgrades.
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#626873', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Complete operations platform for growing small &amp; medium enterprises scaling recruitment, attendance tracking, and automated payroll.
              </p>
              <div style={{ borderTop: '1px solid #E6E7E3', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> <strong>Unlimited team members &amp; employees</strong></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Lifetime software access &amp; ownership</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Full Recruitment &amp; Interview Scheduler</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Precision Time &amp; Attendance Tracking</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Automated Direct Deposit Payroll &amp; Taxes</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Custom Document Vault &amp; E-Sign</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> <strong>1 Year Priority Maintenance on Us</strong></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Priority Onboarding &amp; WhatsApp Support</div>
              </div>
            </div>
            <button onClick={() => setDemoModalOpen(true)} className="achare-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }}>
              <span>Deploy SME Platform</span>
              <IconArrowRight size={14} />
            </button>
          </div>

          {/* Enterprise Tier */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E7E3', borderRadius: '28px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#9297A1', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Enterprise</div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#8066E8', backgroundColor: '#EAE2FF', padding: '0.15rem 0.6rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Perpetual License</span>
              </div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#111318', marginBottom: '0.5rem' }}>Custom</div>

              {/* Maintenance Callout */}
              <div style={{ backgroundColor: '#F3F1ED', color: '#111318', border: '1px solid #E6E7E3', borderRadius: '14px', padding: '0.75rem', fontSize: '12px', margin: '0.75rem 0 1.25rem 0' }}>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#111318' }}>
                  <span>⚡</span> Bespoke Architecture &amp; SLA
                </div>
                <div style={{ fontSize: '11px', color: '#626873', marginTop: '3px', lineHeight: 1.4 }}>
                  Custom infrastructure, dedicated staging, and compliance auditing.
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#626873', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                For multi-entity corporations, conglomerates, and regulated industries requiring custom deployment, security SLAs, and enterprise integrations.
              </p>
              <div style={{ borderTop: '1px solid #E6E7E3', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Perpetual Enterprise source code license</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Air-Gapped Private Cloud &amp; Self-Host</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Dedicated Account Engineer &amp; 24/7 SLA</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Multi-Entity &amp; Multi-Branch Hierarchy</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Custom ERP, Banking &amp; Biometric APIs</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IconCheck size={14} color="#36B978" /> Custom Feature Engineering &amp; Migration</div>
              </div>
            </div>
            <button onClick={() => setDemoModalOpen(true)} className="achare-btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }}>
              Talk to Enterprise Team
            </button>
          </div>

        </div>

      </section>

      {/* SECTION DIVIDER: PRICING ➔ TESTIMONIALS */}
      <SectionDivider />

      {/* 7. TESTIMONIAL CAROUSEL */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 2rem 3rem 2rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E7E3', borderRadius: '28px', padding: '3rem', boxShadow: '0 2px 8px rgba(20, 25, 40, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#9297A1', textTransform: 'uppercase' }}>
              WHAT PEOPLE OPERATIONS LEADERS SAY
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #E6E7E3', backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <IconChevronLeft size={16} />
              </button>
              <button
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #E6E7E3', backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <IconChevronRight size={16} />
              </button>
            </div>
          </div>

          <p style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.65rem)', fontWeight: 500, color: '#111318', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
            {testimonials[testimonialIndex].quote}
          </p>

          <div style={{ fontSize: '13px' }}>
            <span style={{ fontWeight: 700, color: '#111318' }}>{testimonials[testimonialIndex].author}</span>
            <span style={{ color: '#626873' }}>{testimonials[testimonialIndex].role}</span>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER: TESTIMONIALS ➔ FAQ */}
      <SectionDivider />

      {/* 8. FAQ ACCORDION */}
      <section id="faq-section" style={{ maxWidth: '1320px', margin: '0 auto', padding: '2.5rem 2rem 3rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem' }}>
          {/* Left Column: Heading & Support card with right border */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRight: '1px solid #E6E7E3', paddingRight: '2.5rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111318', margin: 0, lineHeight: 1.15 }}>
              Answers to common questions.
            </h2>
            <p style={{ fontSize: '15px', color: '#626873', lineHeight: 1.6, margin: 0 }}>
              Can't find what you're looking for? Reach out to our technical architecture and sales engineering team.
            </p>
            <div style={{ backgroundColor: '#F8F8F5', border: '1px solid #E6E7E3', borderRadius: '16px', padding: '1.25rem', marginTop: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#111318', marginBottom: '0.25rem' }}>Need specialized assistance?</div>
              <p style={{ fontSize: '12px', color: '#626873', margin: '0 0 0.75rem 0' }}>We can arrange a customized architecture review session for your infrastructure.</p>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="achare-btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '12px' }}
              >
                Schedule Architecture Review
              </button>
            </div>
          </div>

          {/* Right Column: FAQ Items */}
          <div style={{ borderTop: '1px solid #E6E7E3' }}>
            {[
              {
                q: 'How does Achare compare to separate CRM and HR tools?',
                a: 'Unlike point solutions that require fragile third-party automations (like Zapier or custom webhooks), Achare shares a single underlying PostgreSQL database. When a candidate accepts an offer, they instantly become an active employee with automatic payroll readiness.',
              },
              {
                q: 'Can we self-host Achare on our own servers?',
                a: 'Yes. Achare is built on open architecture. You can run it in your own Docker, Kubernetes, or AWS environment with full access to the source code and complete data sovereignty.',
              },
              {
                q: 'How does automated payroll handle compliance and taxes?',
                a: 'Achare supports automated tax calculations, statutory deductions, local overtime thresholds, and standardized electronic pay stubs formatted for direct export into accounting systems.',
              },
              {
                q: 'What happens to our existing spreadsheet and CRM records?',
                a: 'Achare includes built-in CSV and spreadsheet import assistants with intelligent field mapping, allowing you to migrate thousands of customer, candidate, and employee records in minutes.',
              },
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} style={{ borderBottom: '1px solid #E6E7E3', padding: '1.25rem 0' }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#111318',
                      textAlign: 'left',
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: '20px', color: '#9297A1' }}>{isOpen ? '×' : '+'}</span>
                  </button>
                  {isOpen && (
                    <p style={{ fontSize: '14px', color: '#626873', lineHeight: 1.6, marginTop: '0.75rem', marginBottom: 0 }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER: FAQ ➔ FINAL CTA */}
      <SectionDivider />

      {/* 9. GRAND FINALE CTA */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 2rem 2.5rem 2rem' }}>
        <div
          style={{
            backgroundColor: '#111318',
            color: '#FFFFFF',
            borderRadius: '28px',
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#68D39A', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            WORK MOVES FORWARD
          </span>
          <h2 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: 800, color: '#FFFFFF', margin: 0, lineHeight: 1.05 }}>
            Ready to unify your people and process?
          </h2>
          <p style={{ fontSize: '16px', color: '#9297A1', maxWidth: '36rem', margin: 0, lineHeight: 1.6 }}>
            Join thousands of modern organizations using Achare to accelerate hiring, manage employees, and execute precision payroll.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <a href="#pricing-section" className="achare-btn-primary" style={{ backgroundColor: '#FFFFFF', color: '#111318', padding: '0.85rem 1.8rem' }}>
              <span>Buy Achare</span>
              <IconArrowRight size={16} />
            </a>
            <button onClick={() => setDemoModalOpen(true)} className="achare-btn-secondary" style={{ backgroundColor: 'transparent', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.25)', padding: '0.85rem 1.8rem' }}>
              <span>Schedule Consultation</span>
            </button>
          </div>
        </div>
      </section>

      </main>

      {/* 10. FOOTER */}
      <footer style={{ borderTop: '1px solid #E6E7E3', backgroundColor: '#F8F8F5', padding: '4rem 2rem 2rem 2rem', fontSize: '12px', color: '#626873' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <img src="/images/core/logo.svg" alt="Achare" style={{ width: '22px', height: '22px' }} />
                <span style={{ fontWeight: 800, fontSize: '16px', color: '#111318' }}>ACHARE</span>
              </div>
              <p style={{ lineHeight: 1.6, maxWidth: '22rem', margin: 0 }}>
                People. Process. Progress.<br />
                The all-in-one CRM and people-operations platform for fast-growing businesses.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#36B978', fontWeight: 600, marginTop: '0.75rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#36B978' }}></span>
                <span>All Systems Operational (99.99%)</span>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, color: '#111318', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Modules</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span>CRM Engine</span>
                <span>Recruitment</span>
                <span>Job Postings</span>
                <span>Employees Directory</span>
                <span>Time Tracking</span>
                <span>Automated Payroll</span>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, color: '#111318', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Solutions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="#connected-workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Connected Workflow</a>
                <a href="#workspace-builder" style={{ color: 'inherit', textDecoration: 'none' }}>Workspace Builder</a>
                <a href="#pricing-section" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing &amp; Plans</a>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, color: '#111318', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Legal</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span>SOC2 Type II Certified</span>
                <span>GDPR Compliant</span>
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #E6E7E3', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', color: '#9297A1', fontSize: '11px' }}>
            <div>© 2026 ACHARE INC. ALL RIGHTS RESERVED.</div>
            <div>PEOPLE. PROCESS. PROGRESS.</div>
          </div>
        </div>
      </footer>

      {/* DEMO MODAL */}
      {demoModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setDemoModalOpen(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E6E7E3',
              borderRadius: '24px',
              padding: '2rem',
              maxWidth: '30rem',
              width: '100%',
              boxShadow: '0 24px 70px rgba(20, 25, 40, 0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E6E7E3', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#111318' }}>Schedule an Achare Demo</div>
                <div style={{ fontSize: '12px', color: '#626873' }}>Experience the all-in-one platform in action.</div>
              </div>
              <button
                onClick={() => setDemoModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9297A1' }}
              >
                <IconX size={18} />
              </button>
            </div>

            {!demoSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDemoSubmitted(true);
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '12px' }}
              >
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Work Email</label>
                  <input
                    required
                    type="email"
                    placeholder="you@company.com"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #E6E7E3', backgroundColor: '#F8F8F5', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>Company Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Acme Inc"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #E6E7E3', backgroundColor: '#F8F8F5', boxSizing: 'border-box' }}
                  />
                </div>
                <button type="submit" className="achare-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                  Request Demo Session →
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#DDF4E6', color: '#36B978', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <IconCheck size={20} />
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#111318' }}>Demo Request Confirmed!</div>
                <div style={{ fontSize: '13px', color: '#626873', marginTop: '0.5rem' }}>Our team will reach out within 2 business hours.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
