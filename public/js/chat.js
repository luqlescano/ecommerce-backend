const socket = io();

let user;
let chatBox = document.querySelector("#chatBox");
let messagesLogs = document.querySelector("#messagesLogs");

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
  

Swal.fire({
    title: "¡Bienvenid@!",
    text: "Ingresá tu correo electrónico",
    input: 'text',
    inputAttributes: {
        type: 'email'
    },
    confirmButtonText: "Ingresar",
    confirmButtonColor: "#007bff",
    preConfirm: function (email) {
        if (!validateEmail(email)) {
            swal.showValidationMessage("El correo electrónico no es válido");
            return false;
        }
    },
    inputValidator: (value) => {
        return !value && "¡Tenes que ingresar un correo electrónico!";
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    console.log(`Tu usuario es ${user}`);

    socket.emit("userConnect", user);
});

chatBox.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        if (chatBox.value.trim().length > 0) {
            console.log(`Mensaje: ${chatBox.value}`);

            socket.emit("message", {
                user,
                message: chatBox.value
            });

            chatBox.value = "";
        }
    }
});

socket.on("messagesLogs", data => {
    let messages = "";

    data.forEach(chat => {
        messages += `${chat.user}: ${chat.message} </br>`;
    });

    messagesLogs.innerHTML = messages;
});

socket.on("newUser", data => {
    Swal.fire({
        text: `${data} se ha unido al chat`,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#007bff",
        toast: true,
        position: "top-right"
    })
})