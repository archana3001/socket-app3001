const port="https://socket-app30.herokuapp.com";
const io=require("socket.io")(port,{
    cors:{
        origin: "http://localhost:3000",
    },
});

let users=[];

const addUser = (userId, socketId) =>{
!users.some((user)=>user.userId==userId) && users.push({userId, socketId});
}


const removeUser=(socketId)=>{
    users=users.filter((user)=> user.socketId !== socketId);
}

const getUser= (userId)=>{
    return users.find(user=>user.userId === userId);
}

io.on("connection", (socket)=>{

    //console.log("user connected");
    // take user socket id from client
    socket.on("addUser", userId=>{
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    // send message and get message
    socket.on("sendMessage", ({senderId, receiverId, text})=>{
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId, text,
        });

    });

    socket.on("disconnected", ()=>{
        //console.log("a user Disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});
