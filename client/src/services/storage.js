import { api } from './api';

export const uploadFileDirectly = async (file, itemType = 'image', itemName = '', onProgress = null) => {
  if (!file) return null;
  
  // 1. Get secure signature (presigned URL) from backend
  const params = new URLSearchParams();
  params.append('type', itemType); // 'image' or 'model'
  if (itemName) {
    params.append('name', itemName);
  }
  
  // Backend returns: { uploadUrl, publicUrl, key }
  const { uploadUrl, publicUrl, key } = await api.get(`/admin/upload-signature?${params.toString()}`);
  
  // 2. Upload directly to Cloudflare R2 via XMLHttpRequest to track progress
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    
    // Set appropriate content type
    const contentType = itemType === 'model' ? 'model/gltf-binary' : file.type || 'image/jpeg';
    xhr.setRequestHeader('Content-Type', contentType);

    // Track upload progress
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100);
        resolve({
          secure_url: publicUrl,
          public_id: key // We store 'key' in DB (R2 object key)
        });
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during upload'));
    };

    xhr.send(file);
  });
};
