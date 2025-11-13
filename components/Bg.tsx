"use client";

import Image from "next/image";
import { useState, useRef } from "react"; // Импортируем hooks

// 1. Импортируем все изображения
import bgImage from "../public/bg.png";
import bgCharacter from "../public/bg_character.png";
// Импортируем все 8 элементов (можно сделать это в цикле, но для ясности так)
import el1 from "../public/bg_el1.png";
import el2 from "../public/bg_el2.png";
import el3 from "../public/bg_el3.png";
import el4 from "../public/bg_el4.png";
import el5 from "../public/bg_el5.png";
import el6 from "../public/bg_el6.png";
import el7 from "../public/bg_el7.png";
import el8 from "../public/bg_el8.png";

// 2. Создаем массив для удобного map
const elements = [el1, el2, el3, el4, el5, el6, el7, el8];

export default function Bg() {
    return (
        <div className="Bg">
            <div className="bg__container">
                {/* 
                  priority - загрузить в первую очередь (т.к. видно сразу)
                  fill - растянуть на весь родительский .bg__container
                  placeholder="blur" - показать размытую версию во время загрузки
                  style - нужен, чтобы дублировать ваш object-fit из CSS
                */}
                <Image
                    className="background__character"
                    src={bgCharacter}
                    alt=""
                    priority
                    // fill
                    placeholder="blur"
                    style={{ objectFit: "contain" }} // object-fit из вашего CSS (.background__character не имел, но .background__element имел)
                    // Убедитесь, что ваш CSS для .background__character корректно работает с fill
                />
                <Image
                    className="background__image"
                    src={bgImage}
                    alt=""
                    priority
                    fill
                    placeholder="blur"
                    style={{ objectFit: "cover" }} // object-fit из вашего CSS
                />

                {/* орбита с элементами */}
                <div className="elements-orbit">
                    {elements.map((elSrc, i) => (
                        <Image
                            key={i}
                            className={`background__element el${i + 1}`}
                            src={elSrc}
                            alt=""
                            // fill // 'fill' заменяет width/height для position: absolute
                            placeholder="blur"
                            style={{ objectFit: "contain" }} // object-fit из вашего CSS
                            // 'priority' здесь можно не ставить, т.к. они менее важны
                        />
                    ))}
                </div>

                <div className="vignette" />
                <div className="bottom-fade" />
            </div>
        </div>
    );
}