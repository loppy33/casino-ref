"use client";

import React, { useId, useState, useMemo } from "react";

interface UniversalRatingProps {
  value: number;
  max?: number;
  scale?: number;
  precision?: "exact" | "half" | "integer";
  readOnly?: boolean;
  onChange?: (val: number) => void;
  size?: number;
  gap?: number;
  activeColor?: string;
  inactiveColor?: string;
  iconPath?: string;
  // НОВЫЙ ПРОП: Уникальный ID для стабильности (обязательно передавай его в списках!)
  id?: string | number; 
}

const STAR_PATH = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

export default function Stars({
  value,
  max = 5,
  scale = 100,
  precision = "exact",
  readOnly = true,
  onChange,
  size = 20, // чуть уменьшил дефолт под твой дизайн
  gap = 2,
  activeColor = "#0075ff",
  inactiveColor = "#e5e7eb",
  iconPath = STAR_PATH,
  id, // Принимаем ID извне
}: UniversalRatingProps) {
  // 1. Генерируем базовый ID.
  // Если передали id пропом -> используем его (СТАБИЛЬНО).
  // Если нет -> используем useId, но чистим от двоеточий для валидности SVG (РЕЗЕРВ).
  const reactId = useId();
  const stableId = useMemo(() => {
    if (id) return `rating-${id}`;
    return `rating-${reactId.replace(/:/g, "")}`;
  }, [id, reactId]);

  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const normalizedValue = (value / scale) * max;
  const displayValue = hoverValue ?? normalizedValue;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (readOnly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(1, Math.max(0, x / rect.width));
    let newValue = index + percent;

    if (precision === "half") newValue = index + (percent > 0.5 ? 1 : 0.5);
    if (precision === "integer") newValue = index + 1;

    setHoverValue(newValue);
  };

  const handleClick = () => {
    if (!readOnly && onChange && hoverValue !== null) {
      onChange((hoverValue / max) * scale);
    }
  };

  return (
    <div
      className="universal-rating"
      style={{ display: "flex", gap: `${gap}px`, cursor: readOnly ? "default" : "pointer" }}
      onMouseLeave={() => setHoverValue(null)}
      // Aria-атрибуты для доступности (убираем Hydration warning на тексте)
      aria-label={`${displayValue} из ${max}`} 
    >
      {Array.from({ length: max }).map((_, index) => {
        let fillPercentage = Math.max(0, Math.min(1, displayValue - index)) * 100;

        if (precision === "half") {
          fillPercentage = fillPercentage >= 50 ? (fillPercentage === 100 ? 100 : 50) : 0;
        } else if (precision === "integer") {
          fillPercentage = fillPercentage === 100 ? 100 : 0;
        }

        // Уникальный ID для КОНКРЕТНОЙ звезды
        const gradientId = `${stableId}-s${index}`;

        return (
          <div
            key={index}
            style={{ width: size, height: size, position: "relative" }} // убрали лишние flex стили
            onMouseMove={(e) => handleMouseMove(e, index)}
            onClick={handleClick}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              // Важно: display block убирает нижний отступ у SVG
              style={{ display: "block" }} 
            >
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset={`${fillPercentage}%`} stopColor={activeColor} />
                  <stop offset={`${fillPercentage}%`} stopColor={inactiveColor} />
                </linearGradient>
              </defs>
              <path
                d={iconPath}
                fill={`url(#${gradientId})`}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}