/* jshint esversion: 9 */
const socket = io();
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer();

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};
const peerEl = document.getElementById("peer-list");
const peerList = [];
let me;
const ROOM_ID = window.location.pathname.replace("/room/", "");
document.getElementById("room-id").innerHTML=ROOM_ID;

socket.connect({ transports: ['websocket'] })


async function getMedia(video, audio) {
    const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio
    });
    addVideoStream(myVideo, stream);

    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            peerList.push(...myPeer._connections.keys());
            renderPeerList();
            addVideoStream(video, userVideoStream);
        });
    });
    socket.on('user-connected', userId => {
        console.log("Connected");
        setTimeout(connectToNewUser, 1000, userId, stream);
    });
}

socket.on('user-disconnected', userId => {
    console.log('disconnected', userId);
    const index = peerList.indexOf(userId);
    if (index !== -1) {
        peerList.splice(index, 1); //remove userId from array
    }
    renderPeerList();
    if (peers[userId]) peers[userId].close();
})

myPeer.on('open', async id => {
    me = id;
    renderPeerList();
    await getMedia(true, true).catch(console.error);
    socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video');

    call.on('stream', userVideoStream => {

        addVideoStream(video, userVideoStream);

    });
    call.on('close', () => {
        video.remove();
    });

    peers[userId] = call;
    peerList.push(userId);
    renderPeerList();
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}

function renderPeerList() {
    peerEl.innerHTML = `<p>${me} (you)</p>`;
    peerList.forEach((peer) => {
        peerEl.innerHTML += `<p>${peer}</p>`;
    });
}