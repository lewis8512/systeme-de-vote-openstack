export function detectMimeType(byteArray: number[]): string {
    if (!byteArray || byteArray.length < 4) return 'application/octet-stream';

    if (byteArray[0] === 0xFF && byteArray[1] === 0xD8 && byteArray[2] === 0xFF) {
        return 'image/jpeg';
    }

    if (byteArray[0] === 0x89 && byteArray[1] === 0x50 && byteArray[2] === 0x4E && byteArray[3] === 0x47) {
        return 'image/png';
    }

    return 'application/octet-stream';
}

export function convertByteObjectToBlobUrl(imageObj: object): string {
    const byteArray = Object.values(imageObj).map(Number);
    const uint8Array = new Uint8Array(byteArray);
    const mimeType = detectMimeType(byteArray);
    const blob = new Blob([uint8Array], { type: mimeType });
    return URL.createObjectURL(blob);
}
