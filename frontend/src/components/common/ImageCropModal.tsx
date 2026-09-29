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
  const [imgError, setImgError] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const CROP_SIZE = 260;

  // Muat image: coba tanpa crossOrigin dulu (untuk data:/blob:), fallback jika gagal
  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);

    let active = true;
    const img = new Image();

    // Untuk data: URL atau blob: URL lokal, crossOrigin justru bisa memicu security error pada beberapa engine browser mobile
    if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => {
      if (!active) return;
      imageElementRef.current = img;
      setImgLoaded(true);
    };

    img.onerror = () => {
      if (!active) return;
      // Jika sebelumnya pakai crossOrigin dan gagal, coba lagi tanpa crossOrigin
      if (img.crossOrigin) {
        const retryImg = new Image();
        retryImg.onload = () => {
          if (!active) return;
          imageElementRef.current = retryImg;
          setImgLoaded(true);
        };
        retryImg.onerror = () => {
          if (!active) return;
          setImgError(true);
        };
        retryImg.src = imageSrc;
      } else {
        setImgError(true);
      }
    };

    img.src = imageSrc;

    return () => {
      active = false;
    };
  }, [imageSrc]);

  // Gambar ke canvas preview setiap kali zoom / offset / imgLoaded berubah
  useEffect(() => {
    if (!imgLoaded || !imageElementRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageElementRef.current;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    if (!naturalW || !naturalH) return;

    // Bersihkan canvas
    ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);

    // Hitung base scale agar foto mengcover lingkaran
    const baseScale = Math.max(CROP_SIZE / naturalW, CROP_SIZE / naturalH);
    const scale = baseScale * zoom;

    const renderedW = naturalW * scale;
    const renderedH = naturalH * scale;

    const imgCenterX = CROP_SIZE / 2 + offset.x;
    const imgCenterY = CROP_SIZE / 2 + offset.y;

    const imgLeft = imgCenterX - renderedW / 2;
    const imgTop = imgCenterY - renderedH / 2;

    ctx.save();
    // Bentuk clip bundar
    ctx.beginPath();
    ctx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, Math.PI * 2);
    ctx.clip();

    // Gambar background & foto
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, CROP_SIZE, CROP_SIZE);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, imgLeft, imgTop, renderedW, renderedH);

    ctx.restore();
  }, [imgLoaded, zoom, offset]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}
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
    if (!imageElementRef.current) return;
    const img = imageElementRef.current;

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    if (!naturalW || !naturalH) return;

    const baseScale = Math.max(CROP_SIZE / naturalW, CROP_SIZE / naturalH);
    const scale = baseScale * zoom;

    const renderedW = naturalW * scale;
    const renderedH = naturalH * scale;

    const imgCenterX = CROP_SIZE / 2 + offset.x;
    const imgCenterY = CROP_SIZE / 2 + offset.y;

    const imgLeft = imgCenterX - renderedW / 2;
    const imgTop = imgCenterY - renderedH / 2;

    const srcX = Math.max(0, (0 - imgLeft) / scale);
    const srcY = Math.max(0, (0 - imgTop) / scale);
    const srcW = Math.min(naturalW - srcX, CROP_SIZE / scale);
    const srcH = Math.min(naturalH - srcY, CROP_SIZE / scale);

    const TARGET_SIZE = 500;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = TARGET_SIZE;
    exportCanvas.height = TARGET_SIZE;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, TARGET_SIZE, TARGET_SIZE);

    exportCanvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
        } else {
          // Fallback to jpeg jika webp tidak didukung toBlob di browser lama
          exportCanvas.toBlob(
            (fallbackBlob) => {
              if (fallbackBlob) onCropComplete(fallbackBlob);
            },
            "image/jpeg",
            0.9
          );
        }
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
            className="relative overflow-hidden rounded-full cursor-grab active:cursor-grabbing border-4 border-primary/20 shadow-inner flex items-center justify-center bg-slate-900"
            style={{ width: `${CROP_SIZE}px`, height: `${CROP_SIZE}px`, touchAction: "none" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <canvas
              ref={canvasRef}
              width={CROP_SIZE}
              height={CROP_SIZE}
              className="w-full h-full block rounded-full"
            />

            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {imgError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="text-red-400 text-sm font-medium">Gagal memuat gambar</span>
                <span className="text-gray-400 text-xs mt-1">Coba pilih file lain</span>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 rounded-full border border-white/40 z-10" />
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
            disabled={!imgLoaded}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-opacity-90 transition shadow-sm disabled:opacity-50"
          >
            Terapkan & Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
