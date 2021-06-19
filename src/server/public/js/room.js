/* jshint esversion: 9 */
const socket = io();
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer();
const peers = {};
const peerEl = document.getElementById("peer-list");
const peerList = [];
let me;
const ROOM_ID = window.location.pathname.replace("/room/", "");
document.getElementById("room-id").innerHTML = ROOM_ID;

socket.connect();

function createDivWithVideo(name, self = false) {
    const div = document.createElement('div');
    div.classList.add("card", "mx-3", "my-2");
    div.style.width = "20rem";
    div.innerHTML = `
    <div class="card-header">
        ${name} ${self ? "(You)" : ""}
    </div>

    <div class="card-body" style="padding: 1rem 0rem 0rem 0rem;">
        <video class="card-img-top" style="border-radius:calc(.25rem - 1px)"></video>
    </div>
    `;
    if (!self) {
        div.innerHTML += `
        <div class="mute-btn card-footer text-muted">
            <i class="fas fa-volume-up"></i> <span>Mute</span>
        </div>`;
    }
    return div;
}

async function getMedia(video, audio) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video,
            audio
        });
        const div = createDivWithVideo(my_name, true);
        div.getElementsByTagName('video')[0].muted = true; // mute self
        addVideoStream(div, stream);

        myPeer.on('call', call => {
            call.answer(stream);

            call.on('stream', userVideoStream => {
                console.log("u", userVideoStream);
                console.log("c", call);
                console.log(myPeer)
                const keys = [...myPeer._connections.keys()];
                const connections = keys.map(c => {
                    const name = myPeer._connections.get(c)[0].metadata.name;
                    return { id: c, name };
                });
                connections.forEach(connection => {
                    if (peerList.find(p => p.id === connection.id)) return;
                    peerList.push(connection);
                    const div = createDivWithVideo(connection.name);
                    addVideoStream(div, userVideoStream);
                });
                //renderPeerList();

            });
        });
        socket.on('user-connected', data => {
            console.log("Connected", data);
            setTimeout(connectToNewUser, 1000, data, stream);
        });
    } catch (err) {
        if(video && audio) {
            return getMedia(false, true);
        } else {
            return Swal.fire("Error", "Something went wrong, couldn't get your media devices.", "error")
        }
    }
}

socket.on('user-disconnected', data => {
    console.log('disconnected', data);
    const index = peerList.indexOf(data.name);
    if (index !== -1) {
        peerList.splice(index, 1); //remove userId from array
    }
    //renderPeerList();
    if (peers[data.id]) peers[data.id].close();
});

myPeer.on('open', async id => {
    me = id;
    //renderPeerList();
    await getMedia(true, true)
    console.log({ id, name: my_name });
    socket.emit('join-room', ROOM_ID, { id, name: my_name });
});

function connectToNewUser(data, stream) {
    console.log("CONETON", data, stream)
    const call = myPeer.call(data.id, stream, { metadata: { name: my_name } });
    const div = createDivWithVideo(data.name, false);
    call.on('stream', userVideoStream => {
        addVideoStream(div, userVideoStream);
    });
    call.on('close', () => {
        div.remove();
    });

    peers[data.id] = call;
    peerList.push(data);
    //renderPeerList();
}

function addVideoStream(div, stream) {
    const video = div.getElementsByTagName('video')[0];
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    const mute = [...div.getElementsByClassName('mute-btn')];
    if (mute.length != 0) {
        mute[0].addEventListener('click', (e) => {
            const isMuted = video.muted;
            const currentIcon = isMuted ? "fa-volume-mute" : "fa-volume-up";
            const nextIcon = !isMuted ? "fa-volume-mute" : "fa-volume-up";
            const iconEl = mute[0].getElementsByTagName("i")[0];
            iconEl.classList.remove(currentIcon);
            iconEl.classList.add(nextIcon);
            const nextText = !isMuted ? "Unmute" : "Mute";
            video.muted = !isMuted;
            const textEl = mute[0].getElementsByTagName("span")[0];
            textEl.innerHTML = nextText;
        });
    }

    videoGrid.append(div);
}

function renderPeerList() {
    peerEl.innerHTML = `<p>${my_name} (you)</p>`;
    console.log(peerList);
    peerList.forEach((peer) => {
        peerEl.innerHTML += `<p>${peer.name}</p>`;
    });
}