import { useState, useRef } from 'react';
import { Submission } from '../../types';
import { submissions as submissionsApi } from '../../lib/api';
import { Upload, File, X, Check } from 'lucide-react';
import { validateFilename } from '../../lib/utils';

interface SubmissionFormProps {
  challengeId: number;
  currentSubmission: Submission | null;
  onSubmissionComplete: () => void;
}

export default function SubmissionForm({
  challengeId,
  currentSubmission,
  onSubmissionComplete,
}: SubmissionFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');
    setSuccess('');

    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      setSelectedFile(null);
      return;
    }

    if (!validateFilename(file.name)) {
      setError('Filename must not contain spaces. Please rename your file.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      if (currentSubmission) {
        await submissionsApi.update(challengeId, selectedFile);
        setSuccess('Submission updated successfully!');
      } else {
        await submissionsApi.create(challengeId, selectedFile);
        setSuccess('Submission uploaded successfully!');
      }

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onSubmissionComplete();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Your Submission</h3>

      {/* Current submission info */}
      {currentSubmission && (
        <div className="bg-primary/10 border border-primary/20 rounded-md p-4">
          <div className="flex items-center gap-2 text-sm">
            <File className="h-4 w-4 text-primary" />
            <span className="font-medium">{currentSubmission.filename}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Submitted on: {new Date(currentSubmission.submitted_at).toLocaleString()}
          </p>
        </div>
      )}

      {/* File input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          {currentSubmission ? 'Replace Submission' : 'Upload Submission'}
        </label>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="submission-file"
          />
          <label
            htmlFor="submission-file"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span className="text-sm">{selectedFile ? selectedFile.name : 'Choose PDF file'}</span>
          </label>

          {selectedFile && (
            <button
              onClick={clearSelection}
              className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          PDF only, max 50MB, filename must not contain spaces
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm p-3 rounded-md border border-green-200 dark:border-green-800 flex items-center gap-2">
          <Check className="h-4 w-4" />
          {success}
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {uploading ? (
          <>
            <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            <span>{currentSubmission ? 'Replace Submission' : 'Upload Submission'}</span>
          </>
        )}
      </button>
    </div>
  );
}
