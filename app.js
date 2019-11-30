const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const ImageModel = require('./images');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

function fileFilter(req, file, cb) {
    const math = ["image/png", "image/jpeg", "image/jpg"];
    const idx = math.indexOf(file.mimetype);
    return cb(null, !!~idx);
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

mongoose.connect(`mongodb://hoangit123:hoangit123@ds137498.mlab.com:37498/hoang`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) throw err;
    console.log('Database connected');
});

const app = express();

app.use(express.static(path.join(__dirname, '/')));

app.get('/', (req, res) => {
    res.json({ message: 'Hello World' })
});

app.post('/images', upload.single('singleimage'), async (req, res) => {
    try {
        const image = await ImageModel.create({ path: req.file.path });
        res.json(image);
    } catch (error) {
        res.status(404).json(error);
    }
})
app.get('/images', async (req, res) => {
    try {
        const images = await ImageModel.find({});
        res.json(images);
    } catch (error) {
        res.status(404).json(error);
    }
})
app.delete('/images/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const image = await ImageModel.findByIdAndDelete(id);
        res.status(204).json({ message: 'delete successful' })
    } catch (error) {
        res.status(404).json(error);
    }
})

app.listen(3000);