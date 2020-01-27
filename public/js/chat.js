const socket = io();

// elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

const { username } = Qs.parse(location.search, { ignoreQueryPrefix: true });
const room = 'Global Chat'; // TODO: change this to a variable

// automatically scroll down on new message if at bottom of screen
const autoscroll = () => {
    const $newMessage = $messages.lastElementChild;
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
    const visibleHeight = $messages.offsetHeight;
    const containerHeight = $messages.scrollHeight;
    const scrollOffset = $messages.scrollTop + visibleHeight;

    // find the height before the new message was added
    if (containerHeight - newMessageHeight <= scrollOffset) {
        // push to bottom
        $messages.scrollTop = $messages.scrollHeight;
    }
};

// compile templates
const messageTemplateRaw = '<div class="message"><p><span class="message__name">{{username}}</span><span class="message__meta">{{createdAt}}</span></p></p><p>{{message}}</p></div>';
const messageTemplate = Handlebars.compile(messageTemplateRaw);

const sidebarTemplateRaw = '<h2 class="room-title">{{room}}</h2><h3 class="list-title">Users</h3><ul class="users">{{#each users}}<li>{{username}}</li>{{/each}}</ul>';
const sidebarTemplate = Handlebars.compile(sidebarTemplateRaw);

socket.on('message', (message) => {
    const data = {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    };
    const result = messageTemplate(data);
    $messages.insertAdjacentHTML('beforeend', result);
    autoscroll();
})

socket.on('roomData', ({ room, users }) => {
    const data = {
        room,
        users
    };
    const result = sidebarTemplate(data);
    document.querySelector('#sidebar').innerHTML = result;
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = '';
        $messageFormInput.focus();

        // enable the form
        if (error) {
            return console.log('error')
        }
    });
})

// join a room
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
    }
});