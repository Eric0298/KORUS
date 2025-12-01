const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      console.error("FALTA la variable de entorno MONGO_URI");
      process.exit(1);
    }

    const conexion = await mongoose.connect(uri);

    const { host, name } = conexion.connection;
    console.log(`MongoDB conectado en host: ${host}, base de datos: ${name}`);
  } catch (error) {
    console.error(" Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
