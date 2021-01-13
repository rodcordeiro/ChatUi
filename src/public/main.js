const socket=io(process.env.SOCKET_URL)
        
const admin = {
    id: 1,
    name: "Darth Vader",
    image: "https://rodcordeiro.github.io/shares/img/vader.png"
};

function scroller(){
    let messages = document.querySelector(".messages")
    let scrollerValue = messages.scrollTop;

    scrollerValue += messages.scrollWidth;
    messages.scrollTop = scrollerValue;            
}
function renderMessage(message){
    let messages = document.querySelector(".messages");

    let msgContainer = document.createElement('div');
    msgContainer.setAttribute('class','message');
    
    if (user.userId == message.author.userId){
        msgContainer.classList.add('owner')
    }
    
    msgContainer.setAttribute('key',message.id);

    
    let usrImg = document.createElement('img');
    usrImg.setAttribute("class","uImg");
    usrImg.setAttribute("src",message.author.image);
    usrImg.setAttribute("alt","User Image")

    msgContainer.appendChild(usrImg);

    let textContainer = document.createElement('div');
    textContainer.setAttribute('class','textContainer');

    let author = document.createElement('p');
    author.setAttribute('class','author');

    let authorText = document.createTextNode(message.author.name);
    author.appendChild(authorText);

    let text = document.createElement('p');
    text.setAttribute('class','text')

    let textText = document.createTextNode(message.text);
    text.appendChild(textText);

    let time = document.createElement('p');
    time.setAttribute("class","time");

    let timeText = document.createTextNode(timeHandler(message.time))
    time.appendChild(timeText)

    textContainer.appendChild(author)
    textContainer.appendChild(text)
    textContainer.appendChild(time)

    msgContainer.appendChild(textContainer);

    messages.appendChild(msgContainer);
 
    scroller();  
}

function timeHandler(date){
    let data = new Date(date);
    return `${data.getHours()}:${data.getMinutes()}`;
}

function getTime(){
    return new Date();
}
function submitHandler(data){
    let author = user;
    let text = document.getElementById("msgInput").value;
    if (text == "") return;
    let time = getTime()
    
    let message = {
        id:1,
        author,
        text,
        time
    }

    document.getElementById("msgInput").value = "";
    let emojis = document.getElementById('emojis').classList
    if(!emojis.contains('hidden')){
        handleEmojisField()
    }
    renderMessage(message)
    socket.emit("sendMessage",message)

}

function createUser(user){
    let users = document.querySelector("aside.users");

    let userContainer = document.createElement('div')
    userContainer.setAttribute('class','user')
    userContainer.setAttribute('key',user.userId)

    let userImg = document.createElement('img')
    userImg.setAttribute('class', 'avatar')
    userImg.setAttribute('alt','User Picture')
    userImg.setAttribute('src',user.image)

    let userName = document.createElement('span')
    
    let userNameText = document.createTextNode(user.name)

    userName.appendChild(userNameText)

    userContainer.appendChild(userImg)
    userContainer.appendChild(userName)
    
    users.appendChild(userContainer)

}
function removeUser(id){
    let userContainer = document.querySelector('.users');
    let users = document.querySelectorAll(".user");
    users.forEach(u=>{
        if(u.getAttribute("key") == id){
            userContainer.removeChild(u)
        }
    })
    
}
//SEND WITH ENTER KEY PRESS
document.addEventListener("keypress",(e)=>{
    if(e.keyCode == 13) { 
        submitHandler()
    }
})

function handleEmojisField(){
    let emojis = document.getElementById('emojis')
    emojis.classList.toggle('hidden')
}

function handleEmojiSelection(item){
    let text = document.getElementById("msgInput").value;
    text += item
    document.getElementById("msgInput").value = text;


}

class Emoji {
    constructor(){
        this.emojis = ["😂","😅","😔","😛","😁","😎","😡","😱","😑","😴","🤤","😪","😭","🤦","🤷‍♂️","‍🙏","💀","👍","👌","🤘","❤️","💔"]
    }
    build(){
        this.emojis.forEach((item, i) => {
            let emojis = document.getElementById('emojis')
            let emoji = this.renderEmoji(item)
            emojis.appendChild(emoji)            
          });
    }
    renderEmoji(emoji){
        let emojiContainer = document.createElement('span')
        emojiContainer.setAttribute('onClick',`handleEmojiSelection("${emoji}")`)
        
        let emojiText = document.createTextNode(emoji)
        emojiContainer.appendChild(emojiText)
        
        return emojiContainer
    }
}

const emoji = new Emoji()

async function getImage(){
    let imgUrl = '';
    const options = {
        method: 'GET',
        url: 'https://api.unsplash.com/photos/random',
        headers: {Authorization: 'Client-ID Yt1wveu-M0PHerdD4xtN5e8mNAU6C3t_RKhNCxiWFIE'}
    };
    
    await axios.request(options).then(function (response) {
        imgUrl = response.data.urls.regular        
    }).catch(function (error) {
        imgUrl = "https://www.placecage.com/gif/600/600"
        console.error(error);
        
    });
    return imgUrl;
}

class User {
    constructor(){
        this.userId = 0;
        this.socketId = '0';
        this.name = 'Unnamable';
        this.image = 'https://www.placecage.com/c/600/601';
        this.status = 'Undefined';
    }
    async create(userId,socketId,name,image,status){
        
        this.userId = userId
        this.image = image ? image : await getImage()
        this.name = name
        this.status = status
        this.socketId = socketId
        
        let ProfileInfo = document.querySelector('.UserInformation')

        let pic = document.createElement('img');
        pic.setAttribute('src', this.image)
        pic.setAttribute('alt', 'Profile image')
        ProfileInfo.appendChild(pic)

        let profileText = document.createElement('div');
        profileText.setAttribute('class','ptext')

        let profileUsername = document.createElement('h3')
        let profileUsernameText = document.createTextNode(this.name)
        profileUsername.appendChild(profileUsernameText)

        let profileStatus = document.createElement('p')
        let profileStatusText = document.createTextNode(this.status)
        profileStatus.appendChild(profileStatusText)

        profileText.appendChild(profileUsername)
        profileText.appendChild(profileStatus)

        ProfileInfo.appendChild(profileText)

        await localStorage.setItem('user',JSON.stringify(this))

        createUser(this)
        
        socket.emit('registerUser',{
            userId:this.userId,
            socketId:this.socketId,
            name:this.name,
            image:this.image,
            status:this.status
        });
    }
}


function isValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }


//SOCKETS HANDLERS

socket.on('previowsMessages',function(messages){
    for(message of messages){
      renderMessage(message)
    }
})
socket.on('previowsUsers',function(users){
    for(u of users){
        let usersExisting = document.querySelectorAll(".user");
        let exists = false;
        usersExisting.forEach(u=>{
            if(u.getAttribute("key") == user.userId){
                exists = true
            }
            
        })  
        
        
        exists ? '' : createUser(user)    
    }
})
socket.on('receivedMessage',function(message){
    renderMessage(message);
})

socket.on('newUser',function(user){
    let usersExisting = document.querySelectorAll(".user");
    let exists = false;
    usersExisting.forEach(u=>{
        if(u.getAttribute("key") == user.userId){
            exists = true
        }
        
    })  
    
    
    exists ? '' : createUser(user)
})