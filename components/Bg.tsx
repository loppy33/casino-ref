"use client";

import { useEffect } from "react"; // 1. Добавляем useEffect
import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";

import bgImage from "../public/bg.png";
import bgCharacter from "../public/bg_character.png";

export default function Bg() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // 2. Используем useEffect, чтобы слушать движение мыши по ВСЕМУ ОКНУ
    useEffect(() => {
        const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            mouseX.set(clientX - centerX);
            mouseY.set(clientY - centerY);
        };

        // Подписываемся на событие окна
        window.addEventListener("mousemove", handleMouseMove);

        // Чистим за собой при уходе со страницы
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [mouseX, mouseY]);

    // Настройки скорости (чем больше цифра, тем медленнее)
    const speed = 3;

    const xBg = useTransform(mouseX, (value) => value / (60 * speed));
    const yBg = useTransform(mouseY, (value) => value / (60 * speed));

    const xChar = useTransform(mouseX, (value) => value / (35 * speed));
    const yChar = useTransform(mouseY, (value) => value / (35 * speed));

    return (
        // Убрали onMouseMove отсюда, теперь слушаем window
        <div className="Bg">
            <div className="bg__container">

                {/* СЛОЙ ПЕРСОНАЖА 
                   Внешний div: берет стили из CSS (.background__character) -> центрирует блок
                   Внутренний motion.div: двигает картинку внутри этого блока
                */}
                <div className="background__character">
                    <motion.div
                        style={{
                            x: xChar,
                            y: yChar,
                            width: '100%',
                            height: '100%',
                            position: 'relative'
                        }}
                    >
                        <Image
                            src={bgCharacter}
                            alt=""
                            priority
                            fill
                            placeholder="blur"
                            style={{ objectFit: "contain" }}
                        />
                    </motion.div>
                </div>

                {/* СЛОЙ ФОНА */}
                <motion.div
                    className="background__image_wrapper"
                    style={{
                        position: 'absolute',
                        inset: -10, // Чуть расширим границы (-10px), чтобы не было белых полос
                        zIndex: -9,
                        x: xBg,
                        y: yBg,
                        scale: 1.1 // Увеличим масштаб для запаса хода
                    }}
                >
                    <Image
                        className="background__image"
                        src={bgImage}
                        alt=""
                        priority
                        fill
                        placeholder="blur"
                        style={{ objectFit: "cover" }}
                    />
                </motion.div>

                <div className="vignette" />
                <div className="bottom-fade" />
            </div>
        </div>
    );
}