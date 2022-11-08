/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-08 08:51:55
 * @LastEditTime: 2022-11-08 10:36:24
 */
const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const { PINATA_API_KEY, PINATA_API_SECRET } = process.env

const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET)

async function storeImages(imagesFilePath) {
    const fullImagesFilePath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesFilePath)
    const dogImages = files.filter((i) => i !== ".DS_Store")
    console.log("dogImages: ", dogImages)
    const responses = []
    for (let i = 0; i < dogImages.length; i++) {
        console.log(`uploading ${dogImages[i]}`)
        const readableStreamForFile = fs.createReadStream(`${fullImagesFilePath}/${dogImages[i]}`)
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile, {
                pinataMetadata: {
                    name: dogImages[i],
                },
            })
            responses.push(response)
        } catch (error) {
            console.log("error: ", error)
        }
    }
    console.log(`images uploaded`)
    return { responses, dogImages }
}

async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata, {
            pinataMetadata: {
                name: metadata.name,
            },
        })
        return response
    } catch (error) {
        console.log("error: ", error)
    }
}

module.exports = {
    storeImages,
    storeTokenUriMetadata,
}
