/**
 * use-drag.ts
 *
 * React hook voor drag-interacties via de Pointer Events API.
 *
 * Gebruik:
 *   const { dragging, dragHandlers } = useDrag({ onDragMove, onDragEnd });
 *   <div {...dragHandlers} style={{ touchAction: 'none' }} />
 *
 * BELANGRIJK: Voeg `touch-action: none` toe als CSS-property op het element
 * waaraan de dragHandlers worden meegegeven. Dit voorkomt dat de browser
 * scrollt tijdens een drag-beweging op touch-schermen (iOS Safari, Android).
 * Zonder deze property kan het grid scrollen in plaats van slepen.
 *
 * Voorbeeld in Tailwind: className="touch-none"
 * Voorbeeld inline:      style={{ touchAction: 'none' }}
 */

import { useCallback, useRef, useState } from 'react';

export type DragPosition = { x: number; y: number };

export type UseDragOptions = {
  /** Wordt aangeroepen terwijl de gebruiker sleept. */
  onDragMove?: (position: DragPosition) => void;
  /** Wordt aangeroepen wanneer de drag eindigt (pointerup of pointercancel). */
  onDragEnd?: (position: DragPosition) => void;
  /** Minimale verplaatsing in pixels voordat drag begint (dead-zone). Standaard 4px. */
  threshold?: number;
};

export type DragHandlers = {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerCancel: (e: React.PointerEvent) => void;
};

export type UseDragResult = {
  /** True wanneer een actieve drag-sessie bezig is. */
  dragging: boolean;
  dragHandlers: DragHandlers;
};

export function useDrag(options: UseDragOptions = {}): UseDragResult {
  const { onDragMove, onDragEnd, threshold = 4 } = options;

  const [dragging, setDragging] = useState(false);
  const startPos = useRef<DragPosition | null>(null);
  const dragActive = useRef(false);

  const stopDrag = useCallback(
    (e: React.PointerEvent) => {
      if (!dragActive.current) return;
      dragActive.current = false;
      setDragging(false);
      startPos.current = null;
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      onDragEnd?.({ x: e.clientX, y: e.clientY });
    },
    [onDragEnd],
  );

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    // Capture so pointermove/pointerup reach us even if pointer leaves the element
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startPos.current) return;

      if (!dragActive.current) {
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < threshold) return;
        dragActive.current = true;
        setDragging(true);
      }

      onDragMove?.({ x: e.clientX, y: e.clientY });
    },
    [onDragMove, threshold],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      stopDrag(e);
    },
    [stopDrag],
  );

  const onPointerCancel = useCallback(
    (e: React.PointerEvent) => {
      stopDrag(e);
    },
    [stopDrag],
  );

  return {
    dragging,
    dragHandlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
  };
}
