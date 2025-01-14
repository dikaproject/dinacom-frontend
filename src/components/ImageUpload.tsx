import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  label: string;
  currentImage?: string | null;
  onChange: (file: File | null) => void;
  accept?: string;
  isDocument?: boolean;
}

const ImageUpload = ({ label, currentImage, onChange, accept = "image/*,application/pdf", isDocument = false }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('');

  // Add useEffect to handle initial file type
  useEffect(() => {
    if (currentImage) {
      const isPDF = currentImage.toLowerCase().endsWith('.pdf');
      setFileType(isPDF ? 'application/pdf' : 'image/*');
      if (isPDF) {
        setPreview('pdf-preview');
      }
    }
  }, [currentImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB');
        return;
      }

      onChange(file);
      setFileType(file.type);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setPreview('pdf-preview');
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    setFileType('');
  };

 // Rest of code remains same until the shouldShowPDFPreview logic
 const shouldShowPDFPreview = fileType === 'application/pdf' || 
 (currentImage && currentImage.toLowerCase().endsWith('.pdf'));

const imageUrl = preview && preview !== 'pdf-preview' ? preview : 
 (currentImage ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${isDocument ? 'documents' : 'profiles'}/${currentImage}` : null);

 return (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors">
      {imageUrl && !shouldShowPDFPreview && (
        <div className="relative w-full h-48 mb-4">
          <Image
            src={imageUrl}
            alt="Preview"
            fill
            className="object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <FiX />
          </button>
        </div>
      )}
      
      {shouldShowPDFPreview && (
        <div className="flex items-center justify-between w-full p-2 bg-gray-50 rounded mb-2">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 18h12V6h-4V2H4v16zm8-11h3.586L12 3.414V7z"/>
            </svg>
            <span className="text-sm text-gray-600">
              {currentImage || 'PDF Document'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 text-red-500 hover:text-red-600"
          >
            <FiX />
          </button>
        </div>
      )}

        <label className="w-full cursor-pointer">
          <div className="flex flex-col items-center p-4">
            <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Click to upload</span>
            <span className="text-xs text-gray-400 mt-1">
              {isDocument ? 'PDF, PNG, JPG up to 5MB' : 'PNG, JPG up to 5MB'}
            </span>
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;