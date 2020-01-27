// wrapper function to include current time
const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    };
};

module.exports = {
    generateMessage
};