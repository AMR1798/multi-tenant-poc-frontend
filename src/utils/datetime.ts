function formatDateString(dateString?: string): string {
    if (!dateString) {
        return '';
    }
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const date = new Date(dateString);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    const formattedDate = `${month} ${day} ${hours}:${minutes.toString().padStart(2, '0')}${ampm}`;

    return formattedDate;
}

export { formatDateString }