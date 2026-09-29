"use client";

import React, { useState, useRef, useEffect } from "react";

interface ImageCropModalProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropModal({
  imageSrc,
  onCropComplete,
  onCancel,
}: ImageCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const CROP_SIZE = 260;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  const generateCroppedBlob = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    const baseScale = Math.max(CROP_SIZE / naturalW, CROP_SIZE / naturalH);
    const finalScale = baseScale * zoom;

    const renderedW = naturalW * finalScale;
    const renderedH = naturalH * finalScale;

    const imgCenterX = CROP_SIZE / 2 + offset.x;
    const imgCenterY = CROP_SIZE / 2 + offset.y;

    const imgLeft = imgCenterX - renderedW / 2;
    const imgTop = imgCenterY - renderedH / 2;

    const srcX = (0 - imgLeft) / finalScale;
    const srcY = (0 - imgTop) / finalScale;
    const srcW = CROP_SIZE / finalScale;
    const srcH = CROP_SIZE / finalScale;

    const TARGET_SIZE = 500;
    const canvas = document.createElement("canvas");
    canvas.width = TARGET_SIZE;
    canvas.height = TARGET_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, TARGET_SIZE, TARGET_SIZE);

    canvas.toBlob(
      (blob) => {
        if (blob) onCropComplete(blob);
      },
      "image/webp",
      0.9
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">Sesuaikan Posisi Foto</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col items-center select-none">
          <p className="text-xs text-gray-500 mb-4 text-center">
            Geser foto atau atur zoom untuk memposisikan wajah di dalam lingkaran.
          </p>

          <div
            className="relative overflow-hidden bg-gray-950 rounded-full cursor-grab active:cursor-grabbing border-4 border-primary/20 shadow-inner flex items-center justify-center"
            style={{ width: `${CROP_SIZE}px`, height: `${CROP_SIZE}px`, touchAction: "none" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <div className="pointer-events-none absolute inset-0 rounded-full border border-white/40 z-10" />

            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop Target"
              draggable={false}
              onLoad={() => setImgLoaded(true)}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transition: isDragging ? "none" : "transform 0.05s ease-out",
                maxWidth: "none",
                maxHeight: "none",
                pointerEvents: "none",
                opacity: imgLoaded ? 1 : 0,
              }}
              className="object-contain select-none"
            />
          </div>

          <div className="w-full mt-6 space-y-2">
            <div className="flex justify-between text-xs font-medium text-gray-600">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 font-bold">-</span>
              <input
                type="range"
                min="0.8"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-xs text-gray-400 font-bold">+</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-white transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={generateCroppedBlob}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-opacity-90 transition shadow-sm"
          >
            Terapkan & Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
