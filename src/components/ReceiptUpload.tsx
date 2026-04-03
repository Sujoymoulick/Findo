import React, { useState } from 'react';
import { Camera, Upload, CheckCircle, Loader2, Trash2, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { parseOCRReceipt, mapTagsToCategory } from '../lib/receiptUtils';

interface ReceiptUploadProps {
  onUploadSuccess: (data: any) => void;
  onDelete: () => void;
  currentImage?: string;
  publicId?: string;
}

export default function ReceiptUpload({ onUploadSuccess, onDelete, currentImage, publicId }: ReceiptUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const { token } = useAuth();

  React.useEffect(() => {
    if (currentImage) setPreview(currentImage);
  }, [currentImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setIsUploading(true);
    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const response = await axios.post('/api/upload/receipt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      const { secure_url, public_id, ocr_text, tags } = response.data;
      
      // Parse OCR data
      const parsedData = parseOCRReceipt(ocr_text);
      const category = mapTagsToCategory(tags);

      onUploadSuccess({
        receiptImage: secure_url,
        receiptPublicId: public_id,
        ...parsedData,
        category: category,
        aiScanned: true
      });

      setPreview(secure_url);
    } catch (err) {
      console.error('Upload Error:', err);
      toast.error('Failed to upload receipt. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('Front-end delete requested for publicId:', publicId);
    
    if (!publicId) {
      console.warn('No publicId found on front-end for deletion');
      setPreview(null);
      onDelete();
      return;
    }

    const toastId = toast.loading('Deleting image...');
    try {
      const response = await axios.post('/api/upload/delete', { public_id: publicId }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Delete API Response:', response.data);
      setPreview(null);
      onDelete();
      toast.success('Image deleted', { id: toastId });
    } catch (err: any) {
      console.error('Front-end Delete Error Details:', {
        message: err.message,
        response: err.response?.data,
        publicId: publicId
      });
      toast.error(`Delete failed: ${err.response?.data?.details || err.message}`, { id: toastId });
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
      />
      <div className={`p-8 rounded-3xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center gap-4 ${
        preview 
        ? 'border-emerald-500/50 bg-emerald-500/5' 
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 group-hover:border-brand-primary group-hover:bg-brand-primary/5'
      }`}>
        {preview ? (
          <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20">
            <img src={preview} alt="Receipt" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
              <p className="text-white font-black text-sm uppercase tracking-widest">Replace Receipt</p>
            </div>
            {isUploading && (
               <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                  <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
                  <p className="text-xs font-black text-brand-primary animate-pulse tracking-[0.2em]">AI ANALYSIS IN PROGRESS...</p>
               </div>
            )}
            {!isUploading && (
                <div className="absolute top-2 right-2 flex gap-2">
                    <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                        <CheckCircle size={14} />
                    </div>
                    <button 
                      onClick={handleDelete}
                      className="bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors z-30"
                      title="Delete Image"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
          </div>
        ) : (
          <>
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-brand-primary transition-all group-hover:scale-110 group-hover:rotate-6 duration-500 shadow-xl shadow-emerald-500/10">
              <Camera size={38} />
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-slate-900 dark:text-white mb-1">Snap your Receipt</p>
              <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">AI will extract all details</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
