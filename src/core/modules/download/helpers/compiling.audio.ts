import NodeID3 from 'node-id3'

interface TagsTypes {
    title: string;
    artist: string;
    album: string;
    APIC: string;
    TRCK: string;
}

const options = {
    include: ['TALB', 'TIT2'],
    exclude: ['APIC']
}

//Compiling video and picture, and edit audio tags
export const compilingAudioFile = (videoDetails: any, audioFilePath: string, pictureFilePath: string): Promise<TagsTypes> => {
    return new Promise((res, rej) => {
        const arrTitle: string[] = videoDetails.title.split('-')

        const tags: TagsTypes = {
            title: arrTitle[1] ? arrTitle[1] : arrTitle[0],
            artist: arrTitle[1] ? arrTitle[0] : "Unknown artist",
            album: "Unknown album",
            APIC: pictureFilePath,
            TRCK: "27"
        }

        NodeID3.update(tags, audioFilePath, options)

        res(tags)
    })
}