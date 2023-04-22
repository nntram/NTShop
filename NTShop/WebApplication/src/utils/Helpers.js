export const ToDateTimeString = (unixTimestamp) => {
    const datetime = new Date(unixTimestamp);
    const day = datetime.getUTCDate();
    const month = datetime.getUTCMonth() + 1;
    const year = datetime.getUTCFullYear();

    const hour = datetime.getUTCHours();
    const minute = datetime.getUTCMinutes();
    const second = datetime.getUTCSeconds();
    return (
        day + '/' + month + '/' + year + ' ' + hour + ':' + minute  + ':' + second

    );
}