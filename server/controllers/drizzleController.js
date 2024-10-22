const userLayout = '../views/layouts/user';
require('../models/database');
const casedata = require("../models/Cases");
const filedata = require("../models/Files");

exports.homepage = async(req, res) => {
    try {
        res.render('index', { title: 'Drizzle'} );
    } catch (error) {
        res.status(500).send({message: error.message || "Error"})
    }
}

exports.dashboard = async(req,res) =>  { 
    try {
        const limitnumber = 10;
        const cases = await casedata.find({}).limit(limitnumber);
        res.render('dashboard', { title: 'Drizzle', layout: userLayout, cases } );
    } catch (error) {
        res.status(500).send({message: error.message || "Error"})
        console.log('err', + error)
    }
}


exports.exploreCaseById = async(req, res) => {
    try {
        let caseId = req.params.id;
        const limitNumber = 32;
        const categoryById = await Recipe.find({'case': caseId}).limit(limitNumber);
        res.render('case', { title: 'Drizzle', categoryById, layout: userLayout });
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured" })
    }
}