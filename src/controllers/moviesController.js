const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const { title } = require('process');


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll({
            order:['name']
        })
            .then(allGenres => {
                res.render('moviesAdd',{allGenres:allGenres})
            })
        
    },
    create: function (req,res) {
    
        db.Movie.create({
            title:req.body.title.trim(),
            rating:req.body.rating, 
            awards:req.body.rating,
            release_date:req.body.release_date,
            length:req.body.length,
            genre_id:req.body.genre_id
        })
        .then(movie => {
            return res.redirect('/movies')
        })
        .catch(error => console.log(error))
    },
    edit: function(req,res) {
        let genres = db.Genre.findAll({
            order: [
                ['name']
            ]
        })
        let movie = db.Movie.findByPk(req.params.id)
        Promise.all([genres, movie])
            .then(([genres, movie]) => {
                res.render('moviesEdit', {
                    allGenres:genres,
                    Movie: movie,
                })
            })
            .catch(error => console.log(error))
    },
    
    update: function (req,res) {

        let genres = db.Genre.findAll({order: [['name']]})
        let movie = db.Movie.findByPk(req.params.id)

        Promise.all([genres, movie])

        .then(([genres, movie]) => {
                db.Movie.update({
                        ...req.body,
                        title: req.body.title.trim()
                    }, {
                        where: {
                            id: req.params.id
                        }
                    })
                    .then(response => {
                        console.log(response)
                        return res.redirect('/movies')
                    })
                    .catch(error => console.log(error))
            })
        
        .catch(error => console.log(error))
    },
    delete: function (req,res) {
        db.Movie.findByPk(req.params.id)
            .then(movie => res.render('moviesDelete', {
                Movie: movie
            }))
            .catch(error => console.log(error))
    },
    destroy: function (req,res) {
        db.Movie.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(result => {
            console.log(result)
            return res.redirect('/movies')
        })
        .catch(error => console.log(error))
}
    
}

module.exports = moviesController;