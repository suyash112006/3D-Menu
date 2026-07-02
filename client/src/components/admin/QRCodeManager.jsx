import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { api } from '../../services/api';
import Toast from '../ui/Toast';
import { Download, Printer, Copy, Share2, RefreshCw, ChevronLeft, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QRCodeManager = () => {
  const [profile, setProfile] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [qrPng, setQrPng] = useState('');
  const [qrSvg, setQrSvg] = useState('');
  const [message, setMessage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const qrRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileAndGenerateQR();
  }, []);

  const fetchProfileAndGenerateQR = async () => {
    setIsGenerating(true);
    try {
      const data = await api.get('/admin/restaurant');
      setProfile(data);
      
      if (data.slug) {
        const menuUrl = `${window.location.origin}/menu/${data.slug}`;
        setQrUrl(menuUrl);
        await generateQRCodes(menuUrl);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile for QR Code' });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateQRCodes = async (url) => {
    try {
      const options = {
        errorCorrectionLevel: 'H',
        margin: 2,
        color: {
          dark: '#0a0a0aff',
          light: '#ffffffff'
        }
      };

      const pngUrl = await QRCode.toDataURL(url, { ...options, width: 400 });
      setQrPng(pngUrl);

      const svgString = await QRCode.toString(url, { ...options, type: 'svg' });
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      setQrSvg(svgUrl);
      
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to generate QR code' });
    }
  };

  const handleDownload = (type) => {
    if (type === 'png' && qrPng) {
      const a = document.createElement('a');
      a.href = qrPng;
      a.download = `${profile?.slug}-menu-qr.png`;
      a.click();
    } else if (type === 'svg' && qrSvg) {
      const a = document.createElement('a');
      a.href = qrSvg;
      a.download = `${profile?.slug}-menu-qr.svg`;
      a.click();
    }
  };

  const handlePrint = () => {
    if (qrPng) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Menu QR Code</title>
            <style>
              body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: system-ui, sans-serif; }
              img { max-width: 80vw; max-height: 80vh; }
              h1 { margin-bottom: 20px; color: #111; }
            </style>
          </head>
          <body>
            <h1>Scan for our Menu</h1>
            <img src="${qrPng}" onload="window.print();window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleCopyUrl = () => {
    if (qrUrl) {
      navigator.clipboard.writeText(qrUrl)
        .then(() => setMessage({ type: 'success', text: 'URL copied to clipboard!' }))
        .catch(() => setMessage({ type: 'error', text: 'Failed to copy URL' }));
    }
  };

  const handleShare = async () => {
    if (navigator.share && qrUrl) {
      try {
        await navigator.share({
          title: `${profile?.name} Menu`,
          text: `Check out our digital 3D menu!`,
          url: qrUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing', error);
        }
      }
    } else {
      handleCopyUrl();
    }
  };

  if (isGenerating) {
    return <div className="dash-page"><div className="qr-loading">Generating QR Code...</div></div>;
  }

  if (!profile?.slug) {
    return (
      <div className="dash-page">
        <div className="qr-loading">Please complete your restaurant profile to generate a QR Code.</div>
      </div>
    );
  }

  return (
    <div className="dash-page">
      {/* ── Top Bar ── */}
      <div className="dash-topbar" style={{ paddingBottom: '1.5rem' }}>
        <div className="dash-brand">
          <button onClick={() => navigate(-1)} className="admin-icon-btn" style={{ marginRight: '0.5rem' }}>
            <ChevronLeft size={24} />
          </button>
          <div className="dash-restaurant-name">QR Code</div>
        </div>
      </div>

      {message && <Toast message={message.text} type={message.type} />}

      <div style={{ padding: '0 1.25rem' }}>
        
        {/* ── QR Display ── */}
        <div className="admin-qr-card" ref={qrRef}>
          <div className="admin-qr-box">
            {qrPng ? (
              <img src={qrPng} alt="Menu QR Code" className="admin-qr-img" />
            ) : (
              <div className="qr-placeholder">QR Code not available</div>
            )}
          </div>
          <p className="admin-qr-hint">Scan to view the menu</p>
          
          <button onClick={() => generateQRCodes(qrUrl)} className="admin-qr-refresh">
            <RefreshCw size={14} /> Regenerate
          </button>
        </div>

        {/* ── URL Box ── */}
        <div className="admin-qr-url-box">
          <div className="url-icon"><LinkIcon size={16} /></div>
          <div className="url-text">{qrUrl}</div>
          <button onClick={handleCopyUrl} className="url-copy-btn">
            <Copy size={16} />
          </button>
        </div>

        {/* ── Action Buttons ── */}
        <div className="dash-section-header" style={{ padding: '1rem 0 0.5rem' }}>
          <span className="dash-section-title">Actions</span>
        </div>
        
        <div className="admin-qr-actions-grid">
          <button onClick={() => handleDownload('png')} className="qr-action-btn primary">
            <Download size={18} /> Download PNG
          </button>
          <button onClick={() => handleDownload('svg')} className="qr-action-btn secondary">
            <Download size={18} /> SVG
          </button>
          <button onClick={handleShare} className="qr-action-btn secondary">
            <Share2 size={18} /> Share
          </button>
          <button onClick={handlePrint} className="qr-action-btn secondary" style={{ gridColumn: 'span 2' }}>
            <Printer size={18} /> Print Poster
          </button>
        </div>

      </div>
    </div>
  );
};

export default QRCodeManager;
