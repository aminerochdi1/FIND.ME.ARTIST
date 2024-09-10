import React, { useEffect } from 'react';
import AvatarEditor from 'react-avatar-editor';

const AvatarImage = (props) => {

    const src = props.src;
    const size = props.size;

    const [scale, setScale] = React.useState(1.0);
    const [position, setPosition] = React.useState({ x: 0.5, y: 0.5 });

    const avatarSize = props.avatarSize;
    const validate = props.validate;

    useEffect(() => {
        if (avatarSize != undefined)
            avatarSize(scale, position)
    }, [scale, position, avatarSize])


    return (
        <div className="w-100 avatar-editor bg-white">
            <AvatarEditor
                image={src}
                width={size}
                height={size}
                border={50}
                borderRadius={size}
                color={[255, 255, 255, 0.6]}
                scale={scale}
                position={position}
                onPositionChange={setPosition}
                onLoadSuccess={(...args) => {}}
                onImageReady={(...args) => {}}
                onImageChange={(...args) => {}}
            />
            <div>
                <input
                    className="form-range my-3"
                    type="range"
                    value={scale}
                    min={1}
                    max={6}
                    step={0.05}
                    onChange={({ target: { value } }) => setScale(+value)}
                    style={{ width: '100%' }}
                />
            </div>
            <button onClick={(e) => validate(position, scale)} className="btn btn-primary w-100">Confirmer</button>
        </div>
    );
};

export default AvatarImage;