"use client";

export default function Bg() {
    return (
        <div className="Bg">
            <div className="bg__container">
                <img className="background__character" src="/bg_character.png" alt="" />
                <img className="background__image" src="/bg.png" alt="" />

                {/* орбита с элементами */}
                <div className="elements-orbit">
                    {[...Array(8)].map((_, i) => (
                        <img
                            key={i}
                            className={`background__element el${i + 1}`}
                            src={`/bg_el${i + 1}.png`}
                            alt=""
                        />
                    ))}
                </div>

                <div className="vignette" />
                <div className="bottom-fade" />
            </div>
        </div>
    );
}
