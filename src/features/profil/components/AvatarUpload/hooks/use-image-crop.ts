import { useState, useRef, useEffect, useCallback } from "react";
import type { DragPosition } from "../types";

interface UseImageCropOptions {
  isOpen: boolean;
  imageSrc: string | null;
  canvasSize?: number;
}

export function useImageCrop({
  isOpen,
  imageSrc,
  canvasSize = 300,
}: UseImageCropOptions) {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [offset, setOffset] = useState<DragPosition>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<DragPosition>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  const resetCrop = useCallback(() => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  }, []);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageElementRef.current;
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    ctx.save();
    ctx.translate(canvasSize / 2 + offset.x, canvasSize / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawWidth = canvasSize;
    let drawHeight = canvasSize;

    if (imgAspect > 1) {
      drawWidth = canvasSize * imgAspect;
      drawHeight = canvasSize;
    } else {
      drawWidth = canvasSize;
      drawHeight = canvasSize / imgAspect;
    }

    ctx.drawImage(
      img,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );
    ctx.restore();
  }, [canvasSize, offset.x, offset.y, rotation, zoom]);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      imageElementRef.current = img;
      renderCanvas();
    };
  }, [imageSrc, renderCanvas]);

  useEffect(() => {
    if (isOpen) {
      renderCanvas();
    }
  }, [isOpen, renderCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const rotate90 = () => {
    setRotation((r) => (r + 90) % 360);
  };

  return {
    canvasRef,
    imageElementRef,
    zoom,
    setZoom,
    rotation,
    rotate90,
    offset,
    resetCrop,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
