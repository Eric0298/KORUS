function filtrarCampos(body, permitidos = []){
        const filtrado = {};
        for(const campo of permitidos){
            if(Object.prototype.hasOwnProperty.call(body, campo)){
                filtrado[campo]= body[campo];
            }
        }
        return filtrado;
    }
module.exports = filtrarCampos;