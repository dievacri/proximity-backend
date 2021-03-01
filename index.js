const mongoose = require('mongoose');
const mongodbMemoryServer = require('mongodb-memory-server');
const { MongoMemoryServer } = mongodbMemoryServer;
const app = require("./server");

const mongoServer = new MongoMemoryServer();
mongoose.Promise = Promise;

mongoServer.getUri().then((mongoUri) => {
    const mongooseOpts = {
        autoReconnect: true,
        useNewUrlParser: true
    };

    mongoose.connect(mongoUri, mongooseOpts);

    mongoose.connection.on('error', (e) => {
        if (e.message.code === 'ETIMEDOUT') {
            console.log(e);
            mongoose.connect(mongoUri, mongooseOpts);
        }
        console.log(e);
    });

    mongoose.connection.once('open', () => {
        console.log(`MongoDB successfully connected to ${mongoUri}`);
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`app is live at port ${PORT}`);
});
