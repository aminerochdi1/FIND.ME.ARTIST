import React, { useState } from 'react';
import AvatarImage from './AvatarImage';

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

    return (
        <>
        </>
    );
};

export default ImageUploader;