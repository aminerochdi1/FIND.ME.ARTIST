import React, { useEffect, useRef, useState } from 'react';
import AvatarImage from './AvatarImage';
import AvatarEditor from 'react-avatar-editor';
import Image from 'next/image';

const AvatarUpload = (props: { src?: string, onImage: any, onError?: any, onSelect?: any, image?: any, placeholder?: string }) => {

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);

    const onError = props.onError;

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        onError(undefined)
        const file = e.target.files?.[0];
        if (file == undefined) return onError("file_not_found")
        if (file?.size / 1024 > 15360) {
            return onError("max_size_file")
        }
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setEditMode(true);
                setSelectedFile(reader.result as string);

            };
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null);
        }
    }

    const hasImage = () => {
        return selectedFile || props.src != undefined
    }


    const [scale, setScale] = React.useState(1.0);
    const [position, setPosition] = React.useState({ x: 0.5, y: 0.5 });

    const WIDTH = 300;

    const editor = useRef<any>(null);

    return (
        <div style={{ width: WIDTH + "px", minHeight: WIDTH + "px", overflow: "hidden" }} className="bg-white mx-auto position-relative text-muted bg-light d-flex flex-column align-items-center justify-content-center">
            {
                (selectedFile == undefined || (selectedFile != undefined && !editMode)) ?
                    (
                        <>
                            {(hasImage()) && <Image width={300} height={300} src={selectedFile != null ? selectedFile : props.src != undefined ? props.src : "<selectedFile=undefined>"} alt="File selected" />}
                            <div className={"position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center " + (hasImage() && "bg-black opacity-75")}>
                                <i className="fa-solid fa-image text-dark fs-1"></i>
                                <span className="mt-4 text-dark small fw-semibold">{props.placeholder}</span>
                            </div>
                            <input accept=".png,.jpeg,.jpg" onChange={handleFileChange} style={{ opacity: 0 }} className="position-absolute h-100 w-100 border border-danger" size={2048} type="file" name="Ajouter une photo de profil" id="" />
                        </>
                    ) : (
                        <>
                            <div className="w-100">
                                <AvatarEditor
                                    ref={editor}
                                    style={{ height: "auto" }}
                                    image={selectedFile}
                                    width={WIDTH - 100}
                                    height={WIDTH - 100}
                                    border={50}
                                    borderRadius={WIDTH}
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
                                        className="form-range"
                                        type="range"
                                        value={scale}
                                        min={1}
                                        max={6}
                                        step={0.05}
                                        onChange={({ target: { value } }) => setScale(+value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <button onClick={(e) => {
                                    setEditMode(false)

                                    if (editor != null) {
                                        // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
                                        // drawn on another canvas, or added to the DOM.
                                        const canvas = editor.current.getImage()
                                        const dataUrl = canvas.toDataURL();
                                        setSelectedFile(dataUrl)

                                        // Convertir le canvas en un fichier blob
                                        canvas.toBlob(async (blob: any) => {
                                            props.onImage(blob);
                                        });
                                    }
                                }} className="btn btn-primary w-100">Confirmer</button>
                            </div>
                        </>
                    )
            }
        </div>
    );
};

export default AvatarUpload;