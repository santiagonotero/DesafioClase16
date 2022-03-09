const knex = require('knex');
const fs = require('fs/promises');
const path = require('path');

class Mensajes{

    constructor(){
        this.db = knex(
            this.dbConfig = {
            client: 'sqlite3',
            connection: {
                filename: './ecommerce/msg_db.sqlite'
            },
            useNullAsDefault : true
        });
    }

     async init(){
        try{
           //await this.db.schema.dropTable('Mensajes')
            const exists = await this.db.schema.hasTable('Mensajes')
                if(!exists){
                    console.log("La tabla Mensajes no existe")
                    await this.db.schema.createTable('Mensajes', function (t){
                        t.increments('id')
                        t.string('author')
                        t.string('text')
                        t.string('date')
                        t.string('time')
                    })

                    const msgFile = await fs.readFile('./Mensajes/msgPool.json', 'utf8')
                const totalMensajes = JSON.parse(msgFile)

                for (const mensaje of totalMensajes){
                    await this.db(`Mensajes`).insert( {author: mensaje.author, text: mensaje.text, date: mensaje.date, time: mensaje.time} )
                }
                    console.log("Tabla Mensajes creada")  
                }   
                else{
                    console.log('Ya existe una tabla de Mensajes')
                }  
        }
        catch(err){
            console.log(err)
        }
    }
    async readData(){
        try{ 
            const listaMensajes = await this.db('Mensajes')
                return listaMensajes
        }
        catch(err){
            console.log(err)
        }
    }

    async appendMessage(msg){
        const result = await this.db('Mensajes')
            .insert({author: msg.author, text: msg.text, date: msg.date, time: msg.time})
        const msgFile = await fs.readFile('./Mensajes/msgPool.json', 'utf8')
        const parsedMsgFile = JSON.parse(msgFile)
        parsedMsgFile.push(msg)
        await fs.writeFile('./Mensajes/msgPool.json', JSON.stringify(parsedMsgFile), 'utf8')
    }

}

module.exports = new Mensajes();