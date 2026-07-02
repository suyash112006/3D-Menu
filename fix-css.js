const fs = require('fs');
let css = fs.readFileSync('client/src/index.css', 'utf8');

// Find the start of the mobile block (line 219 starts with /* ===)
const lines = css.split('\n');
const startIndex = lines.findIndex(line => line.includes('MOBILE RESPONSIVE (≤768px)')) - 1;
let endIndex = -1;

let braceCount = 0;
let started = false;
for (let i = startIndex; i < lines.length; i++) {
  if (lines[i].includes('{')) braceCount += (lines[i].match(/\{/g) || []).length;
  if (lines[i].includes('}')) {
    braceCount -= (lines[i].match(/\}/g) || []).length;
    started = true;
  }
  if (started && braceCount === 0) {
    endIndex = i;
    break;
  }
}

if (startIndex !== -2 && endIndex !== -1) {
  let finalIndex = endIndex;
  if (lines[finalIndex + 2] && lines[finalIndex + 2].includes('@media (max-width: 400px)')) {
    finalIndex += 4;
  }
  
  const mobileBlock = lines.slice(startIndex, finalIndex + 1);
  lines.splice(startIndex, finalIndex - startIndex + 1);
  
  const customMobileCSS = `

/* --- MOBILE SPECIFIC FIXES --- */
@media (max-width: 768px) {
  .desktop-only-btn { display: none !important; }

  .menu-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 0.75rem !important;
  }

  .menu-card {
    display: flex !important;
    flex-direction: row !important;
    padding: 0.75rem !important;
    align-items: center !important;
    gap: 0.75rem !important;
    overflow: hidden !important;
  }

  .menu-img-container {
    height: 80px !important;
    width: 80px !important;
    flex-shrink: 0 !important;
    position: relative !important;
    background: transparent !important;
  }

  .menu-img {
    width: 80px !important;
    height: 80px !important;
    border-radius: 12px !important;
    object-fit: cover !important;
  }

  .model-badge {
    top: 4px !important;
    right: 4px !important;
    padding: 0.15rem 0.3rem !important;
    font-size: 0.65rem !important;
  }

  .menu-info {
    display: grid !important;
    grid-template-columns: 1fr auto !important;
    grid-template-areas:
      "title actions"
      "price actions"
      "status actions" !important;
    gap: 0.3rem !important;
    width: 100% !important;
    align-items: center !important;
    padding: 0 !important;
  }

  .menu-info .flex-between { display: contents !important; }
  .menu-info .category-label { display: none !important; }
  .menu-actions { display: contents !important; border: none !important; margin: 0 !important; padding: 0 !important; }

  .menu-info h3 { 
    grid-area: title !important; 
    font-size: 0.95rem !important; 
    margin: 0 !important; 
  }
  
  .menu-info .price { 
    grid-area: price !important; 
    font-size: 0.9rem !important; 
    margin: 0 !important; 
    font-weight: 600 !important; 
    color: var(--color-gold) !important; 
  }
  
  .menu-actions .toggle-btn { 
    grid-area: status !important; 
    padding: 2px 6px !important; 
    font-size: 0.7rem !important; 
    margin: 0 !important; 
    width: fit-content !important; 
  }
  
  .menu-actions .icon-actions { 
    grid-area: actions !important; 
    display: flex !important; 
    flex-direction: column !important; 
    gap: 0.5rem !important; 
  }
  
  .icon-actions .icon-btn {
    width: 28px !important;
    height: 28px !important;
  }
}
`;
  
  lines.push(mobileBlock.join('\n'));
  lines.push(customMobileCSS);
  
  fs.writeFileSync('client/src/index.css', lines.join('\n'));
  console.log('Successfully moved and updated mobile CSS');
} else {
  console.log('Failed to find mobile block', startIndex, endIndex);
}
