const data = new Date() ; 
const horas = String(data.getHours()).padStart(2, '0');
const min = String(data.getMinutes()).padStart(2 , '0');
const seg = String(data.getSeconds()).padStart(2 , '0');
const horario = ` ${horas}:${min}:${seg}`;


// ======================================


 function verAut() {

    const divPagAuth = document.querySelector('.pag_auth');
    const divPagNaoAuth = document.querySelector('.pag_nao_auth');
    
    divPagNaoAuth.style.display = 'block';
    divPagAuth.style.display = 'none';
}


 function aoVerAut() {

    const divPagAuth = document.querySelector('.pag_auth');
    const divPagNaoAuth = document.querySelector('.pag_nao_auth');
    divPagNaoAuth.style.display = 'none';
    divPagAuth.style.display = 'flex';
}

 function inflarAddUser() {

    const div = document.querySelector('.addNovosUser');  
    div.style.display = (div.style.display === 'flex') ? 'none' : 'flex';
}

 function inflarMenuMobile() {

    const div = document.querySelector('.conteiner_lateral');
    div.style.display = (div.style.display === 'block') ? 'none' : 'block';
}

function apontarUsuariosSala(vetorListaUsuarioNome) {
    const apontamentoUser = document.querySelector('.apontamentoUser'); 
    apontamentoUser.innerHTML = '';

    for (let i = 0; i < vetorListaUsuarioNome.length; i++) {
        apontamentoUser.innerHTML += `
            <br>
            <div class='sockt_acesso' id='euUser${i}'>
                <div class='imagem_usuario_conteiner_lateral'>
                     <div class='eu' id='eu${i}'></div> 
                </div>
            </div>
        `;
    }

    for (let i = 0; i < vetorListaUsuarioNome.length; i++) {
        const eu = document.getElementById(`eu${i}`);
        eu.innerHTML = vetorListaUsuarioNome[i];
    }
}



// ======================================
//      APIs CHAMADAS / ENVIOS		

async function listUserPrime(){

	const token = localStorage.getItem('token'); 
	try{

 		const response = await fetch('http://192.168.0.114:3000/listaUserInicial/' + token, {

			method: 'GET'

		});
		if(!response.ok){
			throw new Error('erro na requisição '+response.status);

		}
		const data = await response.json();
		return data.usuarios;

	}catch(error){

		alert ("Erro ao identificar usuários da sala "+error) ; 
	}
	 
}

function addUsuarios(){

	const novoUser = document.getElementById('newUser').value ; 
	
	  if (!novoUser) {
        alert('Por favor, preencha todos os campos ');
        return;
    }

   const parametros = {
        token : localStorage.getItem('token') ,
        usuario : novoUser,
        sala : localStorage.getItem('nomeChat') 
    };

     const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parametros)
    };

      fetch('http://192.168.0.114:3000/vincularAcesso', options)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        }).then(data => {
        
            alert('Usuário adicionado a sala e seu e-mail irá receber dados de seu acesso') ; 

			// <<<<<<<<<<<<<=============

    socket.emit('sendListUserSala', {
        room: localStorage.getItem('nomeChat'),
        token: localStorage.getItem('token')
	    }, function(response) {/*sem callback */});
        			// <<<<<<<<<<<<<=============

            novoUserInput.value = ''; // <------------------

        }).catch(error => {
            console.log('Erro na requisição:', error);
            if(error == 401 ){
            	alert('Sala indisponivel, gere uma nova'); 
            }
            else {
							alert('Usuário já adicionado a sala');
            }
        });

		// novoUser.value = ''; // <------------------
		document.getElementById('newUser').value = '';

}


// ======================================
// SOCKET 



const titulo = document.querySelector('.titulo');
const socket = io('http://192.168.0.114:3000');

const currentRoom = {
				room  : localStorage.getItem('nomeChat'),
				user :  localStorage.getItem('email'),
				token : localStorage.getItem('token')
			}  ;

socket.emit('indicaSala', currentRoom);
 
 socket.on('message', function(data) {
    console.log('Mensagem data recebida :', data);
		const chatContainer = document.querySelector('.conteiner_out_msg');
		if(data.user){
     chatContainer.innerHTML += `
     	<br>
    		<div class="icon-Aponta-chat"></div> ${data.user} <br><br>
     			<div class ="conteinr_msg">${data.message}  
      </div>
    `;

    chatContainer.scrollTop = chatContainer.scrollHeight;
    }
});

 


function enviarMsg() {
		const author = localStorage.getItem('email');
		const mensagemEnviada0 = document.getElementById('chat-area').value;
const mensagemEnviada = ` As ${horario} diz ${mensagemEnviada0}`;

  
    const messageObject = {
        autor: author,
        mensagem: mensagemEnviada,
        token: localStorage.getItem('token'),
        room: currentRoom,
    };

    if (mensagemEnviada.length && author.length) {
        socket.emit('sendMessage', { 
            room: messageObject.room,
            user: messageObject.autor, 
            message: messageObject.mensagem ,
            token : messageObject.token
        }, function(response) {
            console.log('Resposta do servidor:', response);
        });

        document.getElementById('chat-area').value = '';
    }
}


// ======================================
// Eventos list html 

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('token') || !localStorage.getItem('nomeChat') || !localStorage.getItem('email')) {
        alert('Campos obrigatórios estão vazios');
        verAut(); 
    } else {
        alert('Campos preenchidos');
        aoVerAut();
    }

});


document.addEventListener('DOMContentLoaded', () => {

  const titulo = document.querySelector('.titulo'); 
  const titulo_menu = document.querySelector('.titulo-chat'); 

 	titulo.innerHTML = `Chat: ${localStorage.getItem('nomeChat')}`;
 	titulo_menu.innerHTML = `Sala de chat ${localStorage.getItem('nomeChat')}`;

});



document.addEventListener('DOMContentLoaded', async () => {
    const usuarios = await listUserPrime(); 
    apontarUsuariosSala(usuarios);
    socket.on('message', function(data) {
        if (data.list) {
             apontarUsuariosSala(data.list);
        }
    });
});