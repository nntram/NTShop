export const ToDateTimeString = (unixTimestamp) => {   
    const data = new Date(unixTimestamp)
    return (
        data.toLocaleDateString() + " " + data.toLocaleTimeString()

    );
}

export const ToDateString = (unixTimestamp) => {
    const data = new Date(unixTimestamp)
    return (
        data.toLocaleDateString()

    );
}