import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
const { Medias } = require("../../models")
const fs = require("fs");
const destination = 'public/uploads/';

const MAX_SIZE = 15360;

export async function uploadMedia(profile_id, req, res) {
    const uuid = uuidv4();
    const filename = `${uuid}.jpeg`;

    const upload = multer({
        storage: multer.diskStorage({
            destination,
            filename: function (req, file, cb) {
                req.filename = filename;
                cb(null, filename);
            }
        })
    });

    return await new Promise((resolve, reject) => {
        upload.single("image")(req, res, async (err) => {
            if (err) {
                reject({ message: "media_upload_failed" });
                return;
            }
            if (req.file == undefined) {
                reject({ message: "missing_parameters" });
                return
            }

            if (req.file.size / 1024 > MAX_SIZE) {
                return reject({ message: "max_size_of_image" })
            }

            const metadata = await checkImage(req.file);
            if (!metadata) {
                console.warn(req.socket.remoteAddress, "send a invalid file")
                return reject({ message: "image_file_invalid" })
            }

            try {
                const filePath = req.file.path;
                const splited = req.file.path.split(".");
                const tempFilePath = splited[0] + "-temp." + splited[1];

                const fileSharp = sharp(filePath)
                    .resize(500, 500)

                if (metadata.orientation != undefined) {
                    const rotation = rotationTable.find(item => item.id === metadata.orientation)?.rotation;
                    fileSharp.rotate(rotation)
                }
                fileSharp.jpeg({ quality: 50 })

                fileSharp.toFile(tempFilePath, (err, info) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    fs.rename(tempFilePath, filePath, (renameErr) => {
                        if (renameErr) {
                            console.error(renameErr);
                        }
                    });
                });

                const media = await Medias.create({
                    profile_id,
                    path: filename
                });

                resolve({ id: media.id });
            } catch (error) {
                console.error(error)
                fs.unlink(destination + filename, (err) => { console.error(err) })
                reject({ message: 'internal_server_error' });
            }
        });
    });
}

const rotationTable = [
    { id: 1, rotation: 0 },
    { id: 2, rotation: 0 },
    { id: 3, rotation: 180 },
    { id: 4, rotation: 0 },
    { id: 5, rotation: 90 },
    { id: 6, rotation: 90 },
    { id: 7, rotation: 270 },
    { id: 8, rotation: 270 },
];


function checkImage(file) {
    const sharp = require('sharp');
    return new Promise((resolve, reject) => {
        sharp(file.path)
            .metadata()
            .then(metadata => {
                if (!metadata.format || !["png", "jpeg", "jpg"].includes(metadata.format)) {
                    resolve(false);
                } else {
                    resolve(metadata);
                }
            })
            .catch(err => {
                resolve(false);
            });
    });
}

export async function uploadMedias(profile_id, req, res) {
    const upload = multer({
        storage: multer.diskStorage({
            destination,
            filename: function (req, file, cb) {
                const uuid = uuidv4();
                const filename = `${uuid}.jpg`;
                req.filename = filename;
                cb(null, filename);
            }
        })
    });

    return await new Promise((resolve, reject) => {
        upload.array("images")(req, res, async (err) => {
            if (err) {
                console.error(err)
                reject({ message: "media_upload_failed" });
                return;
            }
            if (req.files == undefined || req.files.length === 0) {
                reject({ message: "missing_parameters" });
                return
            }

            let filesMetadata = [];
            for (const file of req.files) {
                if (file.size / 1024 > MAX_SIZE) {
                    return reject({ message: "max_size_of_image" })
                }

                const metadata = await checkImage(file);
                if (!metadata) {
                    console.warn(req.socket.remoteAddress, "send a invalid file")
                    return reject({ message: "image_file_invalid" })
                }
                filesMetadata = [...filesMetadata, metadata];
            }

            try {
                var i = 0;
                for (const file of req.files) {
                    const metadata = filesMetadata[i];
                    const filePath = file.path;
                    const splited = file.path.split(".");
                    const tempFilePath = splited[0] + "-temp." + splited[1];

                    const fileSharp = sharp(filePath)
                    //.resize(500, 500)

                    if (metadata.orientation != undefined) {
                        const rotation = rotationTable.find(item => item.id === metadata.orientation)?.rotation;
                        fileSharp.rotate(rotation)
                    }
                    fileSharp.jpeg({ quality: 80 })

                    fileSharp.toFile(tempFilePath, (err, info) => {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        fs.rename(tempFilePath, filePath, (renameErr) => {
                            if (renameErr) {
                                console.error(renameErr);
                            }
                        });
                    });
                    i++;
                }
                const medias = [];

                for (const file of req.files) {
                    const media = await Medias.create({
                        profile_id,
                        path: file.filename
                    });
                    medias.push(media);
                }
                resolve(medias);
            } catch (error) {
                console.error(error)
                for (const file of req.files) {
                    fs.unlink(destination + file.filename, (err) => { console.error(err) })
                }
                reject({ message: 'internal_server_error' });
            }
        });
    });
}

export async function getMedia(media_id) {
    const media = await Medias.findOne({ where: { id: media_id } });

    if (media != null) {
        return media;
    }
    return null;
}

export async function deleteMedia(media_id) {
    const media = await getMedia(media_id)

    if (media != null) {
        try {
            fs.unlink(destination + media.path, (err) => { console.error(err) });
            media.destroy();
        } catch (error) {
            console.error(error)
        }
    }
}