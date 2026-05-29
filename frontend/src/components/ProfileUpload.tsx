import React, { useState } from 'react';
import { Camera, Loader2, User as UserIcon, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface ProfileUploadProps {
  onUploadSuccess: (url: string, publicId?: string) => void;
  onDelete: () => void;
  currentImage?: string;
  publicId?: string;
}

export default function ProfileUpload({ onUploadSuccess, onDelete, currentImage, publicId }: ProfileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { token } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.post('/api/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      const { secure_url, public_id } = response.data;
      onUploadSuccess(secure_url, public_id);
      toast.success('Profile picture updated!');
    } catch (err) {
      console.error('Avatar Upload Error:', err);
      toast.error('Failed to upload profile picture.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!publicId) {
      onDelete();
      return;
    }

    const toastId = toast.loading('Removing picture...');
    try {
      await axios.post('/api/upload/delete', { public_id: publicId }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      onDelete();
      toast.success('Profile picture removed', { id: toastId });
    } catch (err) {
      console.error('Delete Error:', err);
      toast.error('Failed to remove picture', { id: toastId });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-2xl transition-transform group-hover:scale-[1.02] duration-500">
          {currentImage ? (
            <img src={currentImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <UserIcon size={48} />
            </div>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            </div>
          )}
        </div>

        <label className="absolute bottom-1 right-1 bg-brand-primary text-white p-2.5 rounded-2xl shadow-xl cursor-pointer hover:bg-emerald-600 transition-all hover:scale-110 active:scale-95 border-2 border-white dark:border-slate-900">
          <Camera size={20} />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
        
        {currentImage && (
          <button 
            onClick={handleDelete}
            className="absolute -top-1 -right-1 bg-red-500 text-white p-2 rounded-2xl shadow-xl hover:bg-red-600 transition-all hover:scale-110 active:scale-95 border-2 border-white dark:border-slate-900 z-10"
            title="Remove picture"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Tap camera to change</p>
    </div>
  );
}
