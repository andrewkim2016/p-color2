import React, { useCallback, useState } from 'react';
import { Camera, Image as ImageIcon, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

export default function ImageUploader({ onImageSelect, selectedImage, onClear }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!selectedImage ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative group cursor-pointer transition-all duration-500 rounded-3xl border-2 border-dashed ${
              isDragging ? 'border-gold bg-gold/5' : 'border-ink/10 hover:border-gold/50 bg-white/50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={onFileChange}
              accept="image/*"
              id="file-upload"
            />
            <div className="py-20 flex flex-col items-center justify-center text-center px-6">
              <div className="w-20 h-20 bg-paper rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Camera className="w-8 h-8 text-gold" />
              </div>
              <h3 className="serif text-2xl font-medium mb-2">분석할 사진을 업로드하세요</h3>
              <p className="text-ink/60 font-light max-w-sm">
                얼굴이 잘 보이는 밝은 곳에서 찍은 사진이 좋습니다.<br/>
                조명이나 화장에 따라 결과가 달라질 수 있습니다.
              </p>
              
              <div className="mt-8 flex items-center gap-3 text-sm font-medium text-gold">
                <Upload className="w-4 h-4" />
                <span>파일 탐색기 열기</span>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
               <div className="px-4 py-1.5 bg-paper rounded-full text-[10px] uppercase tracking-widest text-ink/40 font-semibold border border-ink/5">
                 DRAG & DROP TO UPLOAD
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="relative rounded-3xl overflow-hidden luxury-card group aspect-[4/5] md:aspect-video"
          >
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <button
              id="clear-image-btn"
              onClick={onClear}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-ink hover:bg-white hover:text-red-500 transition-all duration-300 shadow-lg z-20"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="absolute bottom-6 left-6 text-white translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <p className="serif text-xl font-medium">선택된 이미지</p>
              <p className="text-white/70 text-sm font-light">이 사진으로 분석을 진행합니다.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
