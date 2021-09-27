const http=require('http')
const server=http.createServer((req,res)=>{
    console.log("Nueva coneccion")
    res.end("Hola Nane")
})

const PORT = process.env.PORT || 8080
server.listen(PORT,()=> console.log("Escochando"))
