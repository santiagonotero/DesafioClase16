const knex = require('knex');
const fs = require('fs/promises');
const path = require('path');

class Productos{

    constructor(){
        this.db = knex(
            this.dbConfig = {
            client: 'mysql',
            connection: {
                host : 'localhost',
                port : 3306,
                user : 'root',
                password : '',
                database : 'prod_db'
            }
        });
    }

    async init(){
        try{
            const exists = await this.db.schema.hasTable("Productos")
                if(!exists){
                    console.log("La tabla Productos no existe")
                    await this.db.schema.createTable("Productos", (t)=>{
                        t.increments("id");
                        t.string("title");
                        t.integer("price");
                        t.string("thumbnail");
                    })

                        const prdFile = await fs.readFile('./Productos/Productos.json', 'utf8')
                        const totalProductos = JSON.parse(prdFile)
                        for (const producto of totalProductos){
                            await this.db('Productos').insert( { title: producto.title , price: producto.price, thumbnail: producto.thumbnail})
                        }
                    console.log("Tabla Productos creada")
                }
                else {
                    console.log("Ya existe una tabla Productos")
                }  
        }
        catch(err){
            console.log(err)
        }
    }
    async readData(){
        try{ 
            const listaProductos = await this.db('Productos')
                return listaProductos
        }
        catch(err){
            console.log(err)
        }
    }

    async appendProduct(prd){
        try{

            await this.db('Productos')
                .insert({title: prd.title, price: prd.price, thumbnail: prd.thumbnail})
            const prdFile = await fs.readFile('./Productos/Productos.json', 'utf8')
            const parsedPrdFile = JSON.parse(prdFile)
            parsedPrdFile.push(prd)
            await fs.writeFile('./Productos/Productos.json', JSON.stringify(parsedPrdFile), 'utf8')
        }
        catch(err){
            console.log(err)
        }

    }

}

module.exports = new Productos();