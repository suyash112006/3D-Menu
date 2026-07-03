import { api } from './api';

export const uploadFileDirectly = async (file, itemType = 'image', itemName = '') => {
  if (!file) return null;
  
  // 1. Get secure signature from backend
  const params = new URLSearchParams();
  params.append('type', itemType); // 'image' or 'model'
  if (itemName) {
    params.append('name', itemName);
  }
  
  const { signature, timestamp, cloudName, apiKey } = await api.get(`/admin/upload-signature?${params.toString()}`);
  
  // 2. Prepare payload for Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  
  // 3. Post to Cloudinary (bypassing our own Vercel API limits)
  const resourceType = itemType === 'model' ? 'raw' : 'image';
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Cloudinary upload failed');
  
  return {
    secure_url: data.secure_url,
    public_id: data.public_id
  };
};
