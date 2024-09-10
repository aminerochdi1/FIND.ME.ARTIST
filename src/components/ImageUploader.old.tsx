import React, { useState } from 'react';
import AvatarImage from './AvatarImage';
import Image from 'next/image';

const ImageUploader = (props: { src?: string, onImage: any, onError?: any, onSelect?: any, image?: any, placeholder?: string }) => {

    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const onError = props.onError;

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        onError(undefined)
        const file = e.target.files?.[0];
        if (file == undefined) return onError("file_not_found")
        if (file?.size / 1024 > 15360) {
            return onError("max_size_file")
        }
        props.onImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
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


    const [imageCropped, setImageCropped] = useState<string | null>(null);
    const [scale, setScale] = React.useState<any>();
    const [position, setPosition] = React.useState<any>();

    const validate = (position: any, scale: number) => {
        setSelectedFile(null)

        setImageCropped(selectedFile);
        setScale(scale);
        setPosition(position);
    }

    return (
        <>
            <div style={{ zIndex: 999999, backgroundColor: "rgba(0, 0, 0, .4)", backdropFilter: "blur(4px)" }} className="fixed-top top-0 bottom-0 start-0 end-0">
                {

                    (selectedFile) && (
                        <>
                        <button className="position-absolute top-0 end-0 m-2 btn btn-primary" onClick={(e) => { setSelectedFile(null) }}>
                            <i className="fa-solid fa-close"></i>
                        </button>
                        <div className="postion-relative w-100 h-100 p-1 p-xl-5">
                            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                                <div className="col-12 col-md-6 p-5">
                                    <AvatarImage validate={validate} size={300} src={selectedFile} />
                                </div>
                            </div>
                        </div>
                        </>
                    )

                }
                <>
                    {(hasImage()) && <Image width={300} height={300} className="position-absolute h-100 w-100 object-fit-cover" src={selectedFile != null ? selectedFile : props.src != undefined ? props.src : "<selectedFile=undefined>"} alt="Selected File" />}
                    <div className={"position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center " + (hasImage() && "bg-black opacity-75")}>
                        <i className="fa-solid fa-image text-dark fs-1"></i>
                        <span className="mt-4 text-dark small fw-semibold">{props.placeholder}</span>
                    </div>
                    <input accept=".png,.jpeg,.jpg" onChange={handleFileChange} style={{ opacity: 0 }} className="position-absolute h-100 w-100 border border-danger" size={2048} type="file" name="Ajouter une photo de profil" id="" />
                </>
            </div>
        </>
    );
};

export default ImageUploader;