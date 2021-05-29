const mongoose = require('mongoose');

const saucesSchema = mongoose.Schema({
    userId: { type: String },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: String },
    usersDisliked: { type: String }
});


module.exports = mongoose.model('Sauces', saucesSchema);