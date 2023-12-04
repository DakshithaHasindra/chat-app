import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase.js';

const provider = new GoogleAuthProvider();
const chatElm = document.querySelector(`#chat`);
const messageInputElm = document.querySelector('#msg-input');
const btnsend = document.querySelector('#btn-send');
const btnSignIn = document.querySelector('#btn-sign-in');
const loginOverlay = document.querySelector('#login-overlay');
const { BASE_URL } = process.env;
console.log(BASE_URL);


const user = {
    email: '',
    name: '',
    picture: ''
};

let ws ;


const profileElm = document.querySelector('#profile');

/* GooGle Authentication */
btnSignIn.addEventListener('click',()=>{
    signInWithPopup(auth, provider)
    .then((res)=>{
        console.log(res.user.email);
    user.name = res.user.displayName;
    user.email = res.user.email;
    user.picture = res.user.photoURL;
    profileElm.style.backgroundImage = `url(${user.picture})`;
    // ws = new WebSocket(`ws://localhost:8080/api/v2/messages`);

    console.log("fuck");
    loginOverlay.classList.add('d-none');

    }).catch(err =>{
        console.log(err);
    })
})

/* On authStatusChange */

onAuthStateChanged(auth, (loggedUser)=>{
    console.log(loggedUser);
    if (loggedUser) {
        user.name = loggedUser.displayName;
        user.email = loggedUser.email;
        user.picture = loggedUser.photoURL;
        profileElm.style.backgroundImage = `url(${user.picture})`;
        loadAllMessages();
        console.log("On Auth Status true");

        if(!ws){
            ws= new WebSocket(`ws://localhost:8080/api/v2/messages`);
            ws.addEventListener('message', (event)=>{
                createMsgElm(JSON.parse(event.data));
            })
            
            ws.addEventListener('error', (err)=>{
                console.log(err);
            });    
        }


        loginOverlay.classList.add('d-none');
    } else {
        loginOverlay.classList.remove('d-none');

        if(ws){
            ws.close();
        }
        ws = null
    }
})






console.log("Ws :",ws);











btnsend.addEventListener('click', () => {
    const msg_text = messageInputElm.value.trim();
    // console.log(msg_text);
    if (!msg_text) {

        // messageInputElm.select();
        messageInputElm.focus();
        return;
    }

    ws.send(JSON.stringify({
        message: msg_text,
        email: user.email
    }))

    messageInputElm.value = '';
    messageInputElm.focus();
return;

    fetch(`http://localhost:8080/api/v1/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: msg_text,
            email: user.email
        })
    }).then(res => {
        console.log(res.status<400);
        if (res.status < 400) {
            console.log(res.json);
            // createMsgElm(res.json)
            const messageElm = document.createElement('div');
            messageElm.innerHTML = `${msg_text}`;
            messageElm.classList.add('message', 'p-1');
            messageElm.classList.add('me');
            chatElm.appendChild(messageElm);
            chatElm.appendChild(document.createElement('br'));
            
        }
        else {
            alert("Failed to send the messsage")
        }
    }).catch(res => {
        alert("Error connectnig to server... " )
    })
});

/* Create message Element */
function createMsgElm(msgObject){
    const messageElm = document.createElement('div');
            messageElm.innerHTML = `${msgObject.message}`;
            messageElm.classList.add('message', 'p-1');
            

            const senderDataElm = document.createElement('div');
            senderDataElm.id = 'sender-data';
            senderDataElm.innerHTML = `<h3>${msgObject.email.substr(0,1).toUpperCase()}</h3>`;
            if(msgObject.email === user.email){
                messageElm.classList.add('me');
                senderDataElm.style.opacity = '0';
            };
            chatElm.appendChild(senderDataElm);
            chatElm.appendChild(messageElm);
            chatElm.appendChild(document.createElement('br'));
            
}

/* Function to load Existing messages */
function loadAllMessages(){
    fetch(`http://localhost:8080/api/v1/messages`)
  .then(res => 
    res.json().then(json => {
        Array.from(chatElm.children).forEach(element => {
            chatElm.removeChild(element);
        })
        json.forEach(element => {
            createMsgElm(element);
        });
        
    }).catch
    ).catch(err =>{
        console.log(err)
    })
}

// setInterval(loadAllMessages,1000);
