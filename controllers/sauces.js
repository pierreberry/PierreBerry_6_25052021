const Sauces = require('../models/Sauces');
const fs = require('fs');

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauces({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauces.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }))
}

exports.modifySauce = (req, res) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like === 1) {
                sauce.likes++
                sauce.usersLiked.push(req.body.userId)
                Sauces.updateOne({ _id: req.params.id }, { likes: sauce.likes, usersLiked: sauce.usersLiked })
                    .then(() => res.status(200).json({ message: 'Like pris en compte' }))
                    .catch(error => res.status(400).json({ error }));
            }
            if (req.body.like === -1) {
                sauce.dislikes++
                sauce.usersDisliked.push(req.body.userId)
                Sauces.updateOne({ _id: req.params.id }, { dislikes: sauce.dislikes, usersDisliked: sauce.usersDisliked })
                    .then(() => res.status(200).json({ message: 'Dislike pris en compte' }))
                    .catch(error => res.status(400).json({ error }));
            }
            if (req.body.like === 0) {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    sauce.likes--
                    const index = sauce.usersLiked.indexOf(req.body.userId);
                    if (index !== -1) {
                        sauce.usersLiked.splice(index, 1);
                    }
                    Sauces.updateOne({ _id: req.params.id }, { likes: sauce.likes, usersLiked: sauce.usersLiked })
                        .then(() => res.status(200).json({ message: 'Like retiré' }))
                        .catch(error => res.status(400).json({ error }));
                }
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    sauce.dislikes--
                    const index = sauce.usersDisliked.indexOf(req.body.userId);
                    if (index !== -1) {
                        sauce.usersDisliked.splice(index, 1);
                    }
                    Sauces.updateOne({ _id: req.params.id }, { dislikes: sauce.dislikes, usersDisliked: sauce.usersDisliked })
                        .then(() => res.status(200).json({ message: 'Dislike retiré' }))
                        .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch(error => res.status(500).json({ error }))
};

exports.getOneSauce = (req, res) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }))
};

exports.getAllSauce = (req, res) => {
    Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
};

