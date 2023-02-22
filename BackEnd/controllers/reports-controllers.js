const { uuid } = require('uuidv4');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Report = require('../models/report_model');
const User = require('../models/user_model');
const Post = require('../models/post_model');
const Place = require('../models/place_model');

const getReport = async (req, res, next) => {
    u_id = req.params.uid;
    p_id = req.params.pid; //Obtain the place Id

    //Obtain the place
    let place;
    try {
        place = await Place.findById(p_id);
    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a place.',
            500
        );
        return next(error);
    }

    let reports = [];

    //Using a for loop to obtain the reports
    for(let i = 0; i < place.reports.length; i++){
        let report;
        try {
            report = await Report.findById(place.reports[i]);
        }
        catch (err) {
            const error = new HttpError(
                'Something went wrong, could not find a report.',
                500
            );
            return next(error);
        }
        reports.push(report);
    }

    console.log(reports);

    if (!reports) {
        // console.log("No place found")
        const error = new HttpError('Could not find any report.', 404);
        return next(error);
    }

    res.json({ reports: (await reports).map(report => report.toObject({ getters: true })) })
    // console.log("GET Request to the homepage -> Places_routes");
}

const createReport = async (req, res, next) => {
    u_id = req.params.uid;
    p_id = req.params.pid; //Obtain the place Id

    const {concern , post_id} = req.body; //Anyways we can obtain the user to be reported from the post_id

    //Obtain the user to be reported from the post_id
    let post;
    try {
        post = await Post.findById(post_id);
    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find post.',
            500
        );
        return next(error);
    }

    console.log(post.postedBy)

    const createdReport = new Report({
        reportedBy: u_id,
        reportedPost: post_id,
        concern: concern,
        reportedUser: post.postedBy,
    });

    //Save the report to the place
    let place;
    try {
        place = await Place.findById(p_id);
    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find place.',
            500
        );
        return next(error);
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdReport.save({ session: sess });
        place.reports.push(createdReport);
        await place.save({ session: sess });
        await sess.commitTransaction();
    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong, could not save report.',
            500
        );
        return next(error);
    }

    res.status(201).json(createdReport)
}

exports.getReport = getReport;
exports.createReport = createReport;