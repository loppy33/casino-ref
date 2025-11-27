"use client";

import Image from "next/image";

// 1. Импортируем все изображения
import bgImage from "../public/bg.png";
import bgCharacter from "../public/bg_character.png";

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

                <div className="vignette" />
                <div className="bottom-fade" />
            </div>
        </div>
    );
}