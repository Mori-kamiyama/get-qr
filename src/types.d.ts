export interface QrData {
    id: string;
    date: string;      // 例: "2024-07-19T10:34:57.000Z"
    place: string;
    person: string;
    mail: string;      // 例: "https://mail.google.com/..."
    "QR-data": string; // 例: "abcdefghijk0123456"
    subject: string;
}