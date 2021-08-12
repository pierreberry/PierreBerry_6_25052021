const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator')
const emailValidator = require('email-validator')


const password = new passwordValidator()
const User = require('../models/User');


exports.signup = (req, res, next) => {
    if (!emailValidator.validate(req.body.email)) {
        return res.status(401).json({ error: `Mauvais format d'email !` })
    }
    password
        .is().min(8)
        .is().max(100)
        .has().uppercase(1)
        .has().digits(2)
        .has().symbols(1)
    if (!password.validate(req.body.password)) {
        return res.status(401).json({ error: 'Mauvais format de mot de passe !' })
    }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' })
                    }
                    res.status(201).json({
                        message: 'Connecté en tant que ' + user.email + ' !',
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SIGNING_TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};