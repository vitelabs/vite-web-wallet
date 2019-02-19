const pool = 'Uint8ArdomValuesObj012345679BCDEFGHIJKLMNPQRSTWXYZ_cfghkpqvwxyz-';
export function random (size=8) {
    let id = '';
    let bytes = crypto.getRandomValues(new Uint8Array(size));
    while (0 < size--) {
        id += pool[bytes[size] & (pool.length-1)];
    }
    return id;
}