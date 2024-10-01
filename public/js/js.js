 // gerar e acessar chat 

 function openModal(){
    document.querySelector('.modal').style.display = 'flex' ; 
    const divText =  document.querySelector('.texto');
    divText.innerHTML = ` 
            <div class="conteudoExplicativo">
                <center>
                    <h4>Bem-vindo ao Chatizando!</h4>
                </center>
                <h2>O que é:</h2>
                <p>
                    Este é um projeto de chat em tempo real, que proporciona uma comunicação eficaz e instantânea entre usuários, com foco na facilidade de uso e segurança. Ele permite a criação de salas privadas de chat, onde os participantes podem interagir de forma rápida e segura em determinados tempos estipulados na criação, utilizando autenticação por token e proteção contra acessos não autorizados.
                </p> 
                <br>
                <p>
                    O projeto utiliza integração de tecnologias como <strong>Socket.io</strong> para comunicação em tempo real ,  <strong>Nodemailer</strong> para interação de emails e <strong>JWT</strong> para autenticação, oferendo uma experiência fluida e confiável, essencial para ambientes colaborativos e de interação em grupo, como empresas, eventos ou grupos de estudo. A funcionalidade de envio de e-mails para novos usuários adicionados às salas garante que todos tenham acesso de forma segura e imediata.
                </p> 
                <br>
                <p>
                    Esse sistema não só facilita a comunicação, mas também pode ser expandido para diversos tipos de plataformas que necessitam de interação em tempo real, agregando valor tanto no ambiente corporativo quanto no pessoal.
                </p> 
                <br>
                <h2>Como usar:</h2>
                <p>Para criar uma nova sala ou acessar uma sala existente, siga os passos abaixo:</p>
                <h3>Criar uma Nova Sala</h3>
                <p>Para criar uma nova sala de chat, siga estes passos:</p>
                <ol>
                    <li><strong> Nome da Sala:</strong> Insira o nome desejado para a sua sala no campo <em>Insira o nome da sala:</em>.</li>
                    <li><strong> E-mail do Administrador:</strong> Digite o e-mail do usuário que administrará a sala no campo <em>Insira o e-mail do usuário:</em>.</li>
                    <li><strong> Duração do Chat:</strong> Escolha quanto tempo a sala deve permanecer ativa selecionando uma das opções disponíveis no menu suspenso.</li>
                    <li><strong> Criar Sala:</strong> Clique no botão <em>Criar sala</em> para criar a sala com as configurações fornecidas.</li>
                </ol>
                <h3>Acessar uma Sala Criada</h3>
                <p>Para acessar uma sala de chat existente, siga estes passos:</p>
                <ol>
                    <li><strong>E-mail : </strong> Insira o seu e-mail registrado no campo <em>Insira seu e-mail registrado para acessar:</em>.</li>
                    <li><strong>Nome da Sala : </strong> Digite o nome da sala que você deseja acessar no campo <em>Insira o nome da sala:</em>.</li>
                    <li><strong>Token de Acesso : </strong> Insira o token de acesso fornecido para a sala no campo <em>Insira o token de acesso da sala:</em>.</li>
                    <li><strong>Acessar : </strong> Clique no botão <em>Acessar</em> para entrar na sala de chat.</li>
                </ol>
                <p>Se tiver alguma dúvida ou precisar de ajuda adicional, não hesite em entrar em contato conosco!</p>
            </div>
        `;
         
 }  

 function closeModal (){
    document.querySelector('.modal').style.display = 'none' ;


 }


 function botaoExpansivo (div , div2 ) {
        let retorno = document.querySelector('.' + div); 
	let retorno2 = document.querySelector('.' + div2);
	
        if (retorno.style.display === 'block') {
            retorno.style.display = 'none';
           
            
        } else {
            retorno.style.display = 'block';
             retorno2.style.display = 'none'
        }
    }




function gararSala(){
	const temposala =  document.getElementById('idTempoChat').value ;
	const NomeSalaNew= document.getElementById('newNomeSala').value;
	const NomeAdmNew = document.getElementById('newNomeAdm').value; 
	 
	
    const parametros = {
        temposala : temposala ,
        nomeSala : NomeSalaNew ,
        userSala : NomeAdmNew
         
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parametros)
    };

    fetch('http://192.168.0.114:3000/gerarSala', options)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .then(data => {
        
            let resposta = JSON.stringify(data.token);
            resposta = resposta.replace(/"/g, '');
	    dadosLogin(resposta ,   NomeAdmNew , NomeSalaNew );
                   
            
        })
        .catch(error => {
            console.log('Erro na requisição:', error);
        });
}

function dadosLogin( nToken , emailReferente , nomeChat ) {

	localStorage.setItem('token',nToken);
	localStorage.setItem('email',emailReferente);
	localStorage.setItem('nomeChat',nomeChat);
 
	window.location.href = 'http://192.168.0.114:3000/AuthChat'; 
}



function autorizaChat() {
    const nomeUserCriado = document.getElementById('nomeUserCriado').value;
    const nomeSalaCriada = document.getElementById('NomeSalaCriada').value;
    const tokenCriado = document.getElementById('TokenCriado').value;
 
    alert(`Usuário: ${nomeUserCriado}\nSala: ${nomeSalaCriada}\nToken: ${tokenCriado}`);
 
    if (!nomeUserCriado || !nomeSalaCriada || !tokenCriado) {
        alert('Por favor, preencha todos os campos antes de continuar.');
        return;
    }

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': tokenCriado
        },
    };

    const url = "http://192.168.0.114:3000/AuthChatCriado?nomeSala="+nomeSalaCriada+"&userSala="+nomeUserCriado ;

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na autenticação: `);
            }
            return response.text(); 
        })
        .then(data => {
		localStorage.setItem('token' , tokenCriado )  ;
		localStorage.setItem('nomeChat', nomeSalaCriada );
		localStorage.setItem('email' , nomeUserCriado );
		window.location.href = 'http://192.168.0.114:3000/AuthChat';
		// document.write(data);  
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            alert('Erro na autenticação. Verifique os dados , se o token foi expirado e tente novamente '+error);
        });
}


// ==================================================
// chat




function getCookie(){
	const token = localStorage.getItem('token').value; 
	const chat = localStorage.getItem('nomeChat').value; 
	const user = localStorage.getItem('email').value; 
}

localStorage.setItem('token' , '' )  ;
localStorage.setItem('nomeChat', '' );
localStorage.setItem('email' , '' );

location.roload();