const mongoose = require("mongoose");
const validarObjectId = (nombreParametro = "id")=>{
    return(req, res, next)=>{
        const valor = req.params[nombreParametro];
        if(!mongoose.Types.ObjectId.isValid(valor)){
            return res.status(400).json({
                mensaje: `El parametro "${nombreParametro}" no es un ObjectId válido`,
                valor,
            });
        }
        next();
    };
};
module.exports = validarObjectId;