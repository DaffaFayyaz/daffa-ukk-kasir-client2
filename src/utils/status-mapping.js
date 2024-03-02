export const statusMapping = (status) => {
    switch(status) {
        case 'PAYMENT_PENDING':
            return 'Menunggu Pembayaran';
        case 'PAID':
            return 'Pembayaran Berhasil';
        case 'CANCELED':
            return 'Pesanan Dibatalkan';
        default:
            return 'Menunggu Pembayaran';
    }
};

export const statusPemesananMapping = (status) => {
    switch(status) {
        case 'Menunggu':
            return 'Menunggu';
        case 'Diproses':
            return 'Makanan / Minuman Sedang Diproses!';
        case 'Selesai':
            return 'Pesanan Telah Selesai!';
        default:
            return 'Menunggu';
    }
};