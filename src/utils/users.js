// array of users in a room
const users = [];

// add user to users
const addUser = (user) => {
    users.push(user);
    return user;
};

// remove user from users
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        // remove that user
        return users.splice(index, 1)[0];
    }
};

// get a user from users
const getUser = (id) => {
    return users.find((user) => user.id === id);
};

// get all users in a room
const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};