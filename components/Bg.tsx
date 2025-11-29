"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";

import bgImage from "../public/bg.webp";
import bgCharacter from "../public/bg_character.webp";

export default function Bg() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: { clientX: number; clientY: number }) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            mouseX.set(clientX - centerX);
            mouseY.set(clientY - centerY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [mouseX, mouseY]);

    const speed = 3;
    const xBg = useTransform(mouseX, (v) => v / (60 * speed));
    const yBg = useTransform(mouseY, (v) => v / (60 * speed));
    const xChar = useTransform(mouseX, (v) => v / (35 * speed));
    const yChar = useTransform(mouseY, (v) => v / (35 * speed));

    return (
        <div className="Bg">
            <div className="bg__container">
                {/* Персонаж */}
                <div className="background__character">
                    <motion.div
                        style={{
                            x: xChar,
                            y: yChar,
                            width: "100%",
                            height: "100%",
                            position: "relative",
                        }}
                    >
                        <Image
                            src={bgCharacter}
                            alt=""
                            width={345} // фиксированная ширина
                            height={517} // фиксированная высота
                            priority
                            placeholder="blur"
                            quality={75}
                            sizes="(max-width: 480px) 250px,
                            (max-width: 768px) 345px,
                            (max-width: 1024px) 450px,
                            517px"
                            style={{ objectFit: "contain" }}
                        />
                    </motion.div>
                </div>

                {/* Фон */}
                <motion.div
                    className="background__image_wrapper"
                    style={{
                        position: "absolute",
                        inset: -10,
                        zIndex: -9,
                        x: xBg,
                        y: yBg,
                        scale: 1.1,
                    }}
                >
                    <Image
                        src={bgImage}
                        alt=""
                        priority
                        fill
                        placeholder="blur"
                        quality={75}
                        sizes="(max-width: 480px) 480px,
                        (max-width: 768px) 768px,
                        (max-width: 1024px) 1024px,
                        1398px"
                        style={{ objectFit: "cover" }}
                    />
                </motion.div>

                <div className="vignette" />
                <div className="bottom-fade" />
            </div>
        </div>
    );
}
