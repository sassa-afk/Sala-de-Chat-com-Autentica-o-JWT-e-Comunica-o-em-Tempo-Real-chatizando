- 👋 Olá , eu sou o Samuel Souto dos Santos / @sassa-afk 👀 ..
- Tenho interesse na área de desenvolvimento de software 🌱 
- Atualmente estudo e criando projetos universitários em linguagens de programação introduzida em meu curso S.I, no qual me encontro no quinto período. 
- 📫 Você consegue chegar até mim através do email samuelsouto21@gmail.com . 

### ****  ChatZando - Sistema de Chat em Tempo Real com Autenticação JWT ******

ChatZando  - Sistema de Chat em Tempo Real com Autenticação JWT

Este projeto é um sistema de chat em tempo real, desenvolvido com Node.js, Express, Socket.IO e JWT para autenticação de usuários e salas de chat. Ele permite que usuários criem salas temporárias e troquem mensagens em tempo real, com tokens de acesso gerados para cada sala. Além disso, o sistema envia e-mails de confirmação quando salas e acessos são gerados, as mensagens geradas no chats não são armazenadas e os chats tem tempo de expiração e apos o tempo configurado o mesmo fica indisponível .

**Tecnologias Utilizadas**

- **Node.js** :  Plataforma de execução do JavaScript no servidor.
- **Express.js** : Framework para construção de APIs e servidores HTTP.
- **Socket.io** : Protocolo para comunicação em tempo real, permitindo a criação de salas de chat.
- **JWT (jsonwebtoken)** : Biblioteca para geração e verificação de tokens de autenticação.
- **Nodemailer** : Ferramenta para envio de e-mails, usada para enviar tokens de acesso às salas.
- **dotenv** : Para configuração de variáveis de ambiente de forma segura.
- **CORS** : Middleware para habilitar cross-origin resource sharing.
- **EJS** : Motor de templates para renderização de páginas HTML.
- **CSS/Media Queries** : Usado para estilizar as pagina index e chat , ajustando sua resposni  

**Funcionalidades**
 
- Criação de salas de chat com tempo de expiração definido.
- Autenticação de acesso às salas usando JWT.
- Comunicação em tempo real entre os usuários conectados nas mesmas salas.
- Envio de e-mails de confirmação ao usuário com o token e detalhes da sala.
- Validação de tokens expirados e controle de usuários já vinculados a uma sala.
- Servidor para hospedar páginas HTML que facilitam a interação com o chat.
- O servidor Express é configurado para servir arquivos estáticos (como HTML, CSS e JS) do diretório public e renderizar páginas HTML usando EJS. As páginas de chat são acessadas via rotas como /AuthChat e /AuthChatCriado.


***Rotas da API***

1. POST /gerarSala

>Cria uma nova sala de chat e gera um token JWT com tempo de expiração. O token é enviado por e-mail para o usuário.
Parâmetros:
temposala: Tempo de expiração do token.
nomeSala: Nome da sala de chat.
userSala: Nome do usuário que criou a sala.

2. POST /vincularAcesso

>Vincula um usuário a uma sala existente, validando o token JWT.
Parâmetros:
token: Token JWT gerado anteriormente.
usuario: Nome do usuário que deseja entrar na sala.
sala: Nome da sala de chat.

3. GET /listaUserInicial/:token

>Retorna uma lista de usuários conectados a uma sala específica.
Parâmetro:
token: Token JWT da sala.

4. GET /chatzando e /AuthChat
 
>Servem as páginas HTML para o chat, com base no token e nas permissões do usuário.
 
***Configurações do servidor node js*** 

npm init -y
npm install express
npm install cor
npm instal pool
npm instal pg
npm install ws 
npm install socket.io@4 // <--- preferencia 
npm install jsonwebtoken
npm install path
npm install dotenv
npm install http
 
 ***Estrutura do projeto***
 
 ![image](https://github.com/user-attachments/assets/7c0cceeb-8fb7-4efa-9467-66d40e9ef8d0)

***Diagrama de caso de uso***

![image](https://github.com/user-attachments/assets/561009e4-be15-4582-ba10-657d1547b70a)

***Paginas desenvolvidas até agora***
>Visão em tela desktop :

index.html

![image](https://github.com/user-attachments/assets/9cb75faa-0379-4ebe-bb64-d8f9f1eb723b)
![image](https://github.com/user-attachments/assets/3083cf2e-dcbb-4dea-a5ff-bd9f3c7b8c65)
![image](https://github.com/user-attachments/assets/4780a21e-7be5-4800-94b6-471f506fd392)
![image](https://github.com/user-attachments/assets/904d84f9-a448-44f4-826d-33fe978d7d64)

chat.html

![image](https://github.com/user-attachments/assets/538c3c54-2c2c-4b0f-a928-94e7e1f0d757)

===================================
>Visão tela mobile  :

index.html

![image](https://github.com/user-attachments/assets/4eb52817-ef01-4847-b36d-503abc55c1b4)
![image](https://github.com/user-attachments/assets/3aa49549-4f5d-45a5-af30-eb0eb71ea895)
![image](https://github.com/user-attachments/assets/8d19856d-54e8-4493-b24a-823191530f43)

<br><br>
***chat.html***

![image](https://github.com/user-attachments/assets/e418f3af-480b-4ebb-9d70-3d27fd2b318f)
 ![image](https://github.com/user-attachments/assets/2b0cae5b-b057-43cd-9af1-5d520dc127a0)
![image](https://github.com/user-attachments/assets/0fb3c1ad-2b5d-4a38-a58c-09ecee431005)
![image](https://github.com/user-attachments/assets/27653076-ed65-4adc-b4c3-43b2609151fb)


***Contribuições***
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests para melhorias ou correções.






