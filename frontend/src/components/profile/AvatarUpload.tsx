import { useRef, useState } from 'react';
import { User as UserIcon, Upload, X } from 'lucide-react';
import { getAvatarUrl } from '../../lib/utils';

interface AvatarUploadProps {
  currentAvatar: string | null;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
}

export default function AvatarUpload({ currentAvatar, onUpload, onRemove }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarUrl = preview || (currentAvatar ? getAvatarUrl(currentAvatar) : null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Only JPEG, PNG, and GIF images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      await onUpload(file);
      setPreview(null);
    } catch (error) {
      console.error('Upload failed:', error);
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!currentAvatar) {
      return;
    }

    setRemoving(true);
    try {
      await onRemove();
      setPreview(null);
    } catch (error) {
      console.error('Remove failed:', error);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar preview */}
      <div className="relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-32 w-32 rounded-full object-cover border-4 border-border"
          />
        ) : (
          <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center border-4 border-border">
            <UserIcon className="h-16 w-16 text-muted-foreground" />
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFileSelect}
          className="hidden"
          id="avatar-upload"
        />
        <label
          htmlFor="avatar-upload"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 cursor-pointer transition-colors"
        >
          <Upload className="h-4 w-4" />
          {currentAvatar ? 'Change' : 'Upload'}
        </label>

        {currentAvatar && (
          <button
            onClick={handleRemove}
            disabled={removing}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {removing ? (
              <>
                <div className="h-4 w-4 border-2 border-destructive-foreground border-t-transparent rounded-full animate-spin" />
                <span>Removing...</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4" />
                Remove
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">JPEG, PNG, or GIF. Max 5MB.</p>
    </div>
  );
}
