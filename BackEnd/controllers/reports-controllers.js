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

    console.log(reports.length);
    if(reports.length === 0){
        return res.json({ reports: [] })
    }

    res.json({
        reports: (await reports).filter(report => report !== null).map(report => report.toObject({ getters: true }))
      })
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

const ignoreSet = async (req, res, next) => {
    console.log("PATCH Request to the homepage -> Reports_routes")
    r_id = req.params.rid; //Obtain the report Id

    //Obtain the report
    let report;
    try {
        report = await Report.findById(r_id);
    }

    catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find report.',
            500
        );
        return next(error);
    }

    console.log(report)

    //Patch the ignore status to true
    report.isIgnored = true;

    try{
        await report.save();
    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong, could not save report.',
            500
        );
        return next(error);
    }

    console.log(report)

    res.status(200).json({report: report.toObject({ getters: true })})
}

//Write a function to delete a report
const deleteReport = async (req, res, next) => {
    console.log("DELETE Request to the homepage -> Reports_routes")
    r_id = req.params.rid; //Obtain the report Id

    //Obtain the report
    let report;
    try {
        report = await Report.findById(r_id);
    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find report.',
            500
        );
        return next(error);
    }

    console.log(report)

    //Delete the report
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        const result = await report.remove({session: sess});
        if(!result){
            const error = new HttpError(
                'Something went wrong, could not delete report.',
                500
            );
            return next(error);
        }
        await sess.commitTransaction();
    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete report.',
            500
        );
        return next(error);
    }

    res.status(200).json({message: 'Deleted report.'})
}

exports.getReport = getReport;
exports.createReport = createReport;
exports.ignoreSet = ignoreSet;
exports.deleteReport = deleteReport;