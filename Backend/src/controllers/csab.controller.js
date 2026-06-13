import csv from "csv-parser";
import { Readable } from "stream";

import Csab from "../models/CsabAllotment.model.js";

export const uploadCsabData = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({
        message: "CSV file is required",
      });

    const results = [];

    // Create a readable stream from buffer
    const bufferStream = Readable.from([req.file.buffer]);
    bufferStream
      .pipe(csv())
      .on("data", (data) => {
        //Map CSV columns → DB fields EXACTLY
        results.push({
          jeeApplicationNumber: data["JEE(Main) App No"],
          name: data["Name"],
          fatherName: data["Father Name"],
          motherName: data["Mother Name"],

          category: data["Category"],
          pwd: data["PwD"],
          gender: data["Gender"],
          dob: data["dob"],
          stateOfEligibility: data["State of Eligibility"],

          nationality: data["Nationality"],

          instituteCode: data["InstCd"],
          instituteName: data["InstNm"],
          branchCode: data["Brcd"],
          program: data["Program"],

          allottedCategory: data["allottedcat"],
          rank: Number(data["rank"] || 0),

          quota: data["Quota"],
          seatPool: data["Seat Pool"],

          status: data["Status"],

          josaaSeatAcceptanceFee: Number(
            data["JoSAA Seat Acceptance Fee"] || 0,
          ),
          partialAdmissionFee: Number(data["Partial Admission Fee"] || 0),
          participationFee: Number(data["Participation Fee"] || 0),
          specialRoundFee: Number(data["Special Round Acceptance Fee"] || 0),

          mobileNo: data["MobileNo"],
          emailId: data["EmailId"],
          address: data["address"],
        });
      })
      .on("end", async () => {
        try {
          // Optional: remove old data
          await Csab.deleteMany();

          // Insert new batch
          await Csab.insertMany(results);

          res.json({
            message: "CSAB data uploaded successfully",
            totalRecords: results.length,
            fileName: req.file.originalname,
            uploadDate: new Date(),
          });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      })
      .on("error", (err) => {
        res.status(500).json({ message: "Error parsing CSV: " + err.message });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRegistrationStatus = async (req, res) => {
  try {
    const count = await Csab.countDocuments();

    res.json({
      enabled: count > 0,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getCsabMetrics = async (req, res) => {
  try {
    const totalAllotted = await Csab.countDocuments();

    const programs = await Csab.distinct("program");
    const states = await Csab.distinct("stateOfEligibility");
    const categories = await Csab.distinct("category");

    const pwdCandidates = await Csab.countDocuments({
      pwd: { $in: ["YES", "Yes", "Y", "PwD"] },
    });

    res.json({
      totalAllotted,
      programs: programs.length,
      states: states.length,
      categories: categories.length,
      pwdCandidates,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getDistributionStats = async (req, res) => {
  try {
    const { program, category, gender, state, round } = req.query;

    // Build filter object
    const filter = {};
    if (program) filter.program = program;
    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (state) filter.stateOfEligibility = state;
    if (round) filter.round = round;

    const genderStats = await Csab.aggregate([
      ...(Object.keys(filter).length > 0 ? [{ $match: filter }] : []),
      { $group: { _id: "$gender", count: { $sum: 1 } } },
    ]);

    const categoryStats = await Csab.aggregate([
      ...(Object.keys(filter).length > 0 ? [{ $match: filter }] : []),
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const stateStats = await Csab.aggregate([
      ...(Object.keys(filter).length > 0 ? [{ $match: filter }] : []),
      { $group: { _id: "$stateOfEligibility", count: { $sum: 1 } } },
    ]);

    const programStats = await Csab.aggregate([
      ...(Object.keys(filter).length > 0 ? [{ $match: filter }] : []),
      { $group: { _id: "$program", count: { $sum: 1 } } },
    ]);

    const quotaStats = await Csab.aggregate([
      ...(Object.keys(filter).length > 0 ? [{ $match: filter }] : []),
      { $group: { _id: "$quota", count: { $sum: 1 } } },
    ]);

    const seatPoolStats = await Csab.aggregate([
      ...(Object.keys(filter).length > 0 ? [{ $match: filter }] : []),
      { $group: { _id: "$seatPool", count: { $sum: 1 } } },
    ]);

    // ⭐ Opening vs Closing Ranks
    const openingClosingRanks = await Csab.aggregate([
      ...(Object.keys(filter).length > 0 ? [{ $match: filter }] : []),
      {
        $group: {
          _id: "$program",
          openingRank: { $min: "$rank" },
          closingRank: { $max: "$rank" },
          totalAllotted: { $sum: 1 },
        },
      },
      { $sort: { openingRank: 1 } },
    ]);

    // Seat configuration from environment variables
    const seatConfig = {
      "Computer Science and Engineering": parseInt(
        process.env.CSAB_CSE_SEATS || "0",
      ),
      "Data Science and Artificial Intelligence": parseInt(
        process.env.CSAB_DSAI_SEATS || "0",
      ),
      "Electronics and Communication Engineering": parseInt(
        process.env.CSAB_ECE_SEATS || "0",
      ),
    };

    // Add total seats to program stats
    const programStatsWithSeats = programStats.map((prog) => ({
      _id: prog._id,
      count: prog.count,
      totalSeats: seatConfig[prog._id] || 0,
    }));

    // Add total seats to opening/closing ranks
    const ranksWithSeats = openingClosingRanks.map((prog) => ({
      _id: prog._id,
      openingRank: prog.openingRank,
      closingRank: prog.closingRank,
      totalAllotted: prog.totalAllotted,
      totalSeats: seatConfig[prog._id] || 0,
    }));

    res.json({
      genderStats,
      categoryStats,
      stateStats,
      programStats: programStatsWithSeats,
      quotaStats,
      seatPoolStats,
      openingClosingRanks: ranksWithSeats,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getCsabRecords = async (req, res) => {
  try {
    const {
      program,
      category,
      gender,
      state,
      round,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (program) filter.program = program;
    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (state) filter.stateOfEligibility = state;
    if (round) filter.round = round;

    const skip = (page - 1) * limit;

    const records = await Csab.find(filter)
      .sort({ rank: 1 }) // best ranks first
      .skip(skip)
      .limit(Number(limit));

    const total = await Csab.countDocuments(filter);

    res.json({
      totalRecords: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      records,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

import { Parser } from "json2csv";

export const exportCsabCsv = async (req, res) => {
  try {
    const { program, category, gender, state } = req.query;

    const filter = {};

    if (program) filter.program = program;
    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (state) filter.stateOfEligibility = state;

    const data = await Csab.find(filter).lean();

    if (!data.length)
      return res.status(404).json({
        message: "No data found",
      });

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("csab_report.csv");

    return res.send(csv);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
