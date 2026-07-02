import React from 'react';
import { X } from 'lucide-react';
import ModelViewer from './ModelViewer';

const ModelModal = ({ isOpen, onClose, modelUrl, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay model-modal-overlay" onClick={onClose}>
      <div className="modal-content model-modal glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex-between">
          <h2>{itemName} (3D View)</h2>
          <button onClick={onClose} className="close-btn" style={{ padding: '8px' }}>
            <X size={24} />
          </button>
        </div>
        
        <div className="model-modal-body">
          {modelUrl ? (
            <ModelViewer modelUrl={modelUrl} />
          ) : (
            <p className="error-text">3D Model not available.</p>
          )}
        </div>
        
        <div className="model-modal-footer">
          <p className="hint">Drag to rotate the model</p>
        </div>
      </div>
    </div>
  );
};

export default ModelModal;
