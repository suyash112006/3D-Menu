import { api } from './api';

export const uploadFileDirectly = async (file, itemType = 'image', itemName = '', onProgress = null) => {
  if (!file) return null;
  
  // 1. Get secure signature from backend
  const params = new URLSearchParams();
  params.append('type', itemType); // 'image' or 'model'
  if (itemName) {
    params.append('name', itemName);
  }
  
  const { signature, timestamp, cloudName, apiKey, folder, publicId } = await api.get(`/admin/upload-signature?${params.toString()}`);
  
  const resourceType = itemType === 'model' ? 'raw' : 'image';
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks (safe under the 10MB limit)
  
  // Small file upload
  if (file.size <= 10 * 1024 * 1024) { // Less than 10MB
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    if (folder) formData.append('folder', folder);
    if (publicId) formData.append('public_id', publicId);
    
    const response = await fetch(url, { method: 'POST', body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Cloudinary upload failed');
    
    if (onProgress) onProgress(100);
    return { secure_url: data.secure_url, public_id: data.public_id };
  }
  
  // 2. Large file chunked upload
  let currentByte = 0;
  let finalResponse = null;
  const uploadId = Math.random().toString(36).substring(2, 15);
  
  while (currentByte < file.size) {
    const nextByte = Math.min(currentByte + CHUNK_SIZE, file.size);
    const chunk = file.slice(currentByte, nextByte);
    
    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    if (folder) formData.append('folder', folder);
    if (publicId) formData.append('public_id', publicId);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Unique-Upload-Id': uploadId,
        'Content-Range': `bytes ${currentByte}-${nextByte - 1}/${file.size}`,
      },
      body: formData
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Cloudinary chunk upload failed');
    
    if (onProgress) {
      const progress = Math.round((nextByte / file.size) * 100);
      onProgress(progress);
    }
    
    finalResponse = data;
    currentByte = nextByte;
  }
  
  return {
    secure_url: finalResponse.secure_url,
    public_id: finalResponse.public_id
  };
};
