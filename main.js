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
    
    if (user.id == message.author.id){
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
    let time = getTime()
    
    let message = {
        id:1,
        author,
        text,
        time
    }

    document.getElementById("msgInput").value = "";
    renderMessage(message)
    
}

function handleUser(user){
    let users = document.querySelector("aside.users");

    let userContainer = document.createElement('div')
    userContainer.setAttribute('class','user')
    userContainer.setAttribute('key',user.id)

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

handleUser(user)

let messages = [
    {
        id:1,
        author:{
            id: 1,
            name: "RodCordeiro",
            image: "./avatar.png"
        },
        text: "Teste",
        time: "Sun Nov 01 2020 12:12:15 GMT-0300"
    },{
        id:2,
        author:{
            id: 2,
            name: "RodCordeiro",
            image: "https://rodcordeiro.github.io/shares/img/me.png"
        },
        text: "Outro teste",
        time: "Sun Nov 01 2020 13:18:15 GMT-0300"
    },{
        id:4,
        author:{
            id: 2,
            name: "RodCordeiro",
            image: "https://rodcordeiro.github.io/shares/img/me.png"
        },
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum amet repudiandae, repellendus voluptas nemo a non repellat reiciendis ea quis aspernatur sed nobis explicabo, doloremque exercitationem voluptatem nulla qui accusantium!",
        time: "Sun Nov 01 2020 17:18:15 GMT-0300"
    },{
        id:5,
        author:{
            id: 3,
            name: "RodRobo",
            image: "https://rodcordeiro.github.io/shares/img/avatar.png"
        },
        text: "O chat já está funcional e passível de interação, agora é necessário implementar os emojis e o controle de usuário para incluir o socket.",
        time: "Sun Nov 01 2020 17:18:15 GMT-0300"
    }
]

messages.map(message=>renderMessage(message))
document.addEventListener("keypress",(e)=>{
    if(e.keyCode == 13) { 
        submitHandler()

    }
})