import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink,
  MessageCircle,
  Clock,
  ShieldAlert,
  BrainCircuit,
  Bot
} from 'lucide-react';
import { buildReferralUrl } from '../services/api.js';
import { 
  trackReferralLinkCopied, 
  trackWhatsAppShareClicked, 
  trackProjectCardDownloaded 
} from '../services/analytics.js';

export default function ShareableProjectCard({ 
  projectTitle, 
  category, 
  difficulty, 
  referralCode,
  studentName 
}) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  const referralUrl = buildReferralUrl(referralCode);

  useEffect(() => {
    if (referralUrl) {
      QRCode.toDataURL(referralUrl, {
        width: 140,
        margin: 1,
        color: {
          dark: '#0a0d14',
          light: '#ffffff'
        }
      }).then(url => {
        setQrDataUrl(url);
      }).catch(err => {
        console.warn('QR code generation failed:', err);
      });
    }
  }, [referralUrl]);

  // Copy referral URL
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true);
      trackReferralLinkCopied(referralCode);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // WhatsApp share
  const handleWhatsAppShare = () => {
    trackWhatsAppShareClicked(referralCode);
    const text = `I got my AI project 🎯 Mine is "${projectTitle}". What AI project will you get? 👀 Discover and build yours free in 60 mins with NxtWave: ${referralUrl} #BuildWithNxtWave`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Web Share API fallback
  const handleWebShare = async () => {
    const shareData = {
      title: 'What AI Project Should You Build?',
      text: `I got my AI project: "${projectTitle}". What will you get? Discover and build yours free with NxtWave!`,
      url: referralUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // High-Quality HTML5 Canvas Card Generation for Download
  const handleDownloadCard = () => {
    setDownloading(true);
    trackProjectCardDownloaded(referralCode);
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 920;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 700, 920);
    bgGradient.addColorStop(0, '#0f1422');
    bgGradient.addColorStop(0.5, '#121826');
    bgGradient.addColorStop(1, '#0a0d14');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 700, 920);

    // Decorative cyber glow
    const radial = ctx.createRadialGradient(350, 200, 20, 350, 200, 300);
    radial.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 700, 500);

    // Outer border
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 660, 880);

    // Brand Header
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6366f1';
    ctx.textAlign = 'center';
    ctx.fillText('NXTWAVE 60-MIN AI CHALLENGE', 350, 70);

    // Card Badge
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.beginPath();
    ctx.roundRect(230, 95, 240, 36, 18);
    ctx.fill();
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#a5b4fc';
    ctx.fillText('MY 60-MIN AI PROJECT', 350, 119);

    // Project Title
    ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    // Wrap long titles if necessary
    const words = projectTitle.split(' ');
    let line1 = projectTitle;
    let line2 = '';
    if (words.length > 4) {
      const mid = Math.ceil(words.length / 2);
      line1 = words.slice(0, mid).join(' ');
      line2 = words.slice(mid).join(' ');
      ctx.fillText(line1, 350, 190);
      ctx.fillText(line2, 350, 230);
    } else {
      ctx.fillText(projectTitle, 350, 210);
    }

    // Category & Difficulty Subtitle
    ctx.font = '600 18px sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`⚡ ${difficulty || 'Intermediate'} • ~60 Minute Build`, 350, 280);

    // Pitch Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(70, 320, 560, 100, 16);
    ctx.fill();
    ctx.stroke();

    ctx.font = '600 18px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText("I'm building this project live with NxtWave.", 350, 360);
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#c084fc';
    ctx.fillText("What AI project will YOU build?", 350, 395);

    // Draw QR Code
    if (qrDataUrl) {
      const qrImg = new Image();
      qrImg.onload = () => {
        // Draw white rounded background for QR
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(260, 450, 180, 180, 16);
        ctx.fill();

        ctx.drawImage(qrImg, 275, 465, 150, 150);

        // QR instruction
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Scan to discover your project', 350, 665);

        // Referral Code Pill
        ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
        ctx.beginPath();
        ctx.roundRect(220, 690, 260, 44, 22);
        ctx.fill();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Code: ${referralCode}`, 350, 718);

        // Footer Tagline
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('#BuildWithNxtWave  •  nxtwave.tech', 350, 830);

        // Trigger download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `my-ai-project-${referralCode}.png`;
        link.href = dataUrl;
        link.click();
        setDownloading(false);
      };
      qrImg.src = qrDataUrl;
    } else {
      setDownloading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      {/* Visual Project Card */}
      <div 
        ref={cardRef}
        className="glass-panel" 
        style={{
          padding: '28px 24px',
          textAlign: 'center',
          border: '2px solid var(--accent-primary)',
          boxShadow: '0 12px 40px rgba(99, 102, 241, 0.2)',
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(18, 24, 38, 0.9) 0%, rgba(10, 13, 20, 0.95) 100%)',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <span className="badge badge-indigo">
            <Sparkles size={12} /> MY 60-MIN AI PROJECT
          </span>
        </div>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px', lineHeight: 1.25 }}>
          {projectTitle}
        </h3>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
          <Clock size={14} /> {difficulty || 'Intermediate'} • ~60 min build
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '0.92rem'
        }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            I'm building this with NxtWave mentors.
          </p>
          <p style={{ fontWeight: 700, color: 'var(--accent-primary)', marginTop: '4px' }}>
            What AI project will YOU build?
          </p>
        </div>

        {/* QR Code Canvas Display */}
        <div style={{
          display: 'inline-block',
          background: '#ffffff',
          padding: '10px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
          marginBottom: '12px'
        }}>
          {qrDataUrl ? (
            <img 
              src={qrDataUrl} 
              alt={`QR code for ${referralCode}`} 
              style={{ width: '130px', height: '130px', display: 'block' }}
            />
          ) : (
            <div style={{ width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              Generating QR...
            </div>
          )}
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Scan to discover your matched project
        </div>

        <div style={{
          display: 'inline-block',
          padding: '4px 14px',
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: '#a5b4fc',
          marginBottom: '10px'
        }}>
          Invite Code: {referralCode}
        </div>

        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          #BuildWithNxtWave • nxtwave.tech
        </div>
      </div>

      {/* Share Actions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        <button
          type="button"
          className="btn"
          onClick={handleWhatsAppShare}
          style={{
            background: '#25D366',
            color: '#ffffff',
            padding: '10px 14px',
            fontSize: '0.88rem'
          }}
        >
          <MessageCircle size={16} /> WhatsApp
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleDownloadCard}
          disabled={downloading}
          style={{ padding: '10px 14px', fontSize: '0.88rem' }}
        >
          <Download size={16} /> {downloading ? 'Rendering...' : 'Download Card'}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCopyLink}
          style={{ padding: '10px 14px', fontSize: '0.88rem' }}
        >
          {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleWebShare}
          style={{ padding: '10px 14px', fontSize: '0.88rem' }}
        >
          <Share2 size={16} /> Share
        </button>
      </div>
    </div>
  );
}
