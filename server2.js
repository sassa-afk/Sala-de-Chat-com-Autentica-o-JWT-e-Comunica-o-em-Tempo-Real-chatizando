require('dotenv').config();
const pool = require('./db');
const jwt = require('jsonwebtoken');
const path = require('path');
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const app = express(); 

app.use(express.json({ limit: '5mb' }), cors());

const server = http.createServer(app);

const io = new Server(server);

app.use("/public" , express.static(path.join(__dirname,"public")));

app.set('views',path.join(__dirname,'public'));

app.engine('html',require('ejs').renderFile); // usual ??
app.set('view engine','html');// usual ??



 // =================================================================
 
const tokensSalasUser = []; // <--- ary {token , sala , user }



 app.post( "/gerarSala",  ( req , res ) =>{
 
 	const temposala =  req.body.temposala  ;
 	const nomeSala = req.body.nomeSala ; 
 	const userSala = req.body.userSala ; 
 	
 	if( !temposala || !nomeSala|| !userSala ){
 		console.log("sem parametro ");
 		return res.status(400).json({mensagem : "sem parametro"});
 	}else{
 		try{
 			const payload = {
 				nomeSala : nomeSala 	
 			} ;	

 			const token = jwt.sign( payload , process.env.SECRET,{expiresIn: temposala });

 			tokensSalasUser.push( {token : token , sala : nomeSala , user : userSala });


 			console.log('\n> token : '+ token 
 			+'\n> usuario : '+ userSala 
 			+'\n> sala : ' +nomeSala
 			+'\n> duração : ' + temposala );

 			console.log(tokensSalasUser);
 			
 			const msgEmailHTML =  '<h1> ola, </h1> <p> Foi gerado o token '+ token+' para seu usuário de acesso '+userSala+' vinculado a sala '+nomeSala+' </p>' ; 
 			const msgEmailText =  'ola , email do node js teste seu token é '+ token  ; 
 			envioEmail(userSala,token,nomeSala , msgEmailHTML , msgEmailText ) ; 
 			

 
 			return res.status(200).json({
 				"token" : token  		 
 			});
 			
 		}catch(error){
 			console.log('erro ao gerar token '+error)
 			return res.status(500).json({mensagem : error});
 		}
 		
 	}
 	
 
 });

app.post("/vincularAcesso", (req, res) => {
    const token = req.body.token;
    const usuario = req.body.usuario;
    const sala = req.body.sala ; 

    const payload = {
    	token : token ,
    	nomeSala : sala 
    } ;

    if (!usuario) {
        return res.status(400).json({ mensagem: "Parâmetros inválidos" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
 		
 		if(decoded.nomeSala !== sala ){
 			return res.status(400).json({mensagem : "usuario não identificado"});
 		}

 		const usuarioJaVinculado = tokensSalasUser.some(entry => entry.token === token && entry.user === usuario);
        if (usuarioJaVinculado) {
            return res.status(400).json({ mensagem: "Usuário já vinculado a este token e sala" });
        }



 		tokensSalasUser.push( {token : token , sala : sala , user : usuario });

	 	const msgEmailHTML =  '<h1> ola, </h1> <p> Você foi vinculado a um usuário do chatzando . Sua sala é a '+sala+' de token '+ token+' para seu acesso '+usuario+' </p>' ; 
	 	const msgEmailText =  'ola, Você foi vinculado a um usuário do chatzando . Sua sala é a '+sala+' de token '+ token+' para seu acesso '+usuario ; 

				 // html : '<h1> ola, </h1> <p> Foi gerado o token '+ codToken+' para seu usuário '+emailTo+' vinculado a sala '+nomeSala+' </p>', 
		 // text : 'ola , email do node js teste seu token é '+ codToken      
		envioEmail(usuario ,token , sala , msgEmailHTML, msgEmailText ) ; 

 

        return res.status(200).json({
            mensagem: "Usuário vinculado ao token",
       
        });

    } catch (error) {
        console.log('Erro ao manipular o token: ' + error);
        return res.status(500).json({ mensagem: error.message });
    }
});



// --------------------------


app.get("/listaUserInicial/:token", (req, res) => {
    const token = req.params.token;

    const listaUser = tokensSalasUser.filter(entry => entry.token === token );
    const users = listaUser.map(entry => entry.user); 


    return res.json({ usuarios: users});
});


app.get("/chatzando", (req , res)  => {

	 res.sendFile(path.join(__dirname,"public","index.html"));
	 
	 
}); 

app.get('/AuthChat' , (req , res )  => {	
	res.sendFile(path.join(__dirname, "public", "chat.html"));
});



app.get('/AuthChatCriado' , verifyJWTuser  , (req , res )  => {	
	res.sendFile(path.join(__dirname, "public", "chat.html"));
});


 // =================================================================

function verifyJWTuser (req , res , next ){

	const token = req.headers['x-access-token'];
	const  {nomeSala } = req.query ; 
	
	// console.log('\n\n tentativa de login \ntoken :'+token+'\n sala : '+nomeSala+'\nusuário : '+usarSala+'\n\n');
	if(!token ){
		console.log('parametros invalidos token');
		return res.status(400).json({ error: 'parametros ausente, token ' });

	
	}
	if( !nomeSala){
		console.log('>> parametros invalidos sala ');
		return res.status(400).json({ error: ' parametros ausente sala ' });

	
	}
	 
		
	else{
	
		jwt.verify(token, process.env.SECRET, (err, decoded) => {
		
			if(err){
		                console.log('Verificado auth token sem sucesso, não autenticado');
		                 return res.status(401).json({ error: 'Token inválido ou expirado' });

			}else {
			
			// =========== logs de aut node js 
			
			if(decoded.nomeSala !== nomeSala ){
			
			console.log('aut nome sala false ');
			
			}else {
			console.log('aut nome sala true ');
			
			
			} 
			

			
			// ====================
			
			 if (  decoded.nomeSala !== nomeSala  ) {
				console.log('Parâmetros não correspondem ao token');
				return res.status(401).json({ error: error });
			    }
				 
				console.log('\n\n >> Validado acesso : \nusuario  \ntoken : '+token+' \nsala : '+nomeSala+'\n');
			 	req.userID = decoded.id;  
			 	req.nomeSala = decoded.nomeSala ;
				next(); 
			}
			
		});
	
	}
	 

}
function verifyJWTexpirado (token, callback) {
    if (!token) {
        console.log('Erros: parâmetro inválido >>> Token: ' + token);
        return callback(new Error('Parâmetro ausente'));
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            console.log('Erro na verificação do JWT: ' + err);
            return callback(new Error('Token inválido ou expirado'));
        }

         callback(null, decoded);
    });
}

 

 // =================================================================

  
function envioEmail (emailTo , codToken , nomeSala  , msgEmailHTML , msgEmailText){

	 const nodeemail = require ('nodemailer') ;
 
	 const transport = nodeemail.createTransport({
		host : process.env.HOST_EMAIL ,// 'smtp.gmail.com'
		port : 465 ,
		secure : true ,
		auth: {
			user : process.env.MAIL_USER , // process.env.MAIL_USER   
			pass:  process.env.MAIL_PASSWORD , // ''
		}
	 });

	 
	 transport.sendMail({ 
		 from : `teste email ${process.env.HOST_EMAIL}` ,  
		 to: emailTo ,
		 subject : 'enviando email teste node',		 
		 html : msgEmailHTML, 
		 text : msgEmailText

		 // html : '<h1> ola, </h1> <p> Foi gerado o token '+ codToken+' para seu usuário '+emailTo+' vinculado a sala '+nomeSala+' </p>', 
		 // text : 'ola , email do node js teste seu token é '+ codToken      
	 })
	 .then ((response) => console.log('> Solicitado enviado email '+emailTo+' vinculado ao token '+codToken))
 	.catch((erro) => console.log('erro ao enviar email >  ',erro));
}
 
 // =================================================================


 
server.listen(process.env.PORT, process.env.DNS, () => {
    console.log(`Servidor ativo em http://${process.env.DNS}:${process.env.PORT}`);
}).on('error', (error) => {
    console.error('Erro ao iniciar o servidor:', error);
});
 



io.on('connection', (socket) => {

 
    socket.on('indicaSala',(data , callback  ) => {
	socket.join(data.token);
	console.log(`Usuário ${data.user} entrou na sala ${data.token} >>> ${socket.id} `);
	let apontamentoQuemAcesso = {
		 user :'Mensagem do servidor msg' ,  // <<<<<<
		 message: `Usuário ${data.user} entrou ou reconectou a sala ${data.room}`
	};
	io.to(data.token).emit('message', apontamentoQuemAcesso); 
    
    });
    

    socket.on('sendMessage',(data,callback) =>{

    	verifyJWTexpirado (data.token , (err) => {
     		if( err){
				io.to(data.token).emit('message', { user: "Mensagem do servidor" , message: " Sala indisponivel, tempo de sala expirado. Crie uma nova sala" });
    		}else {
				console.log(`msg html: ${JSON.stringify(data, null, 4)}`);
				io.to(data.token).emit('message', { user: data.user , message: data.message });

				callback(`callback ok sala ${data.token}`);
    		}
    	}); 
     });

    socket.on('sendListUserSala',(data,callback) =>{
    	
    	try{
    		console.log("+ "+data.token) ; 

    		const token = data.token ; 
    		const listaUser = tokensSalasUser.filter(entry => entry.token === data.token);

			const users = listaUser.map(entry => entry.user); 

			console.log(" >> ++  :: " + users); 
			io.to(token).emit('message', {'list' : users});


    		callback('retorno sendListUserSala > \n'+users);
    	}catch(err){
    	
			console.log("erro sendUserSala >>  "+err);

    	}


    });
    socket.on('disconnect', (data) => {
        console.log(` disconnected   ${socket.id}`);
    });


});

