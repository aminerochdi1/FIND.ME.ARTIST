import Image from 'next/image';
import React, { useState } from 'react';

const Cropper = (props: { image: any }) => {

    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (event: any) => {
        setIsDragging(true);
        const { clientX, clientY } = event;
        const { left, top } = event.target.getBoundingClientRect();
        setOffset({ x: clientX, y: clientY });
    };

    const handleMouseMove = (event: any) => {
        if (isDragging) {
            const { clientX, clientY } = event;
            const x = clientX - offset.x;
            setPosition({ x, y: clientY - offset.y });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const [size, setSize] = useState<number>(128);

    return (
        <div style={{ zIndex: 99991, backgroundColor: "rgba(0, 0, 0, .4)", backdropFilter: "blur(4px)" }} className="fixed-top top-0 bottom-0 start-0 end-0 d-flex flex-column">
            <div
                onMouseMove={handleMouseMove} 
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp} className="w-auto mx-auto my-auto border border-2 border-white position-relative">
                <Image width={300} height={300} className="no-user-select" src={props.image} alt="File crop" />
                <div className="position-absolute top-0 start-0 bottom-0 end-0">
                    <div
                        style={{ zIndex: 99995, cursor: "move", top: position.y + "px", left: position.x + "px", width: size + "px", height: size + "px" }} className="position-absolute border border-2 border-primary">

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cropper;