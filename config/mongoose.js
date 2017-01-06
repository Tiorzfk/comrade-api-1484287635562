var mongoose = require('mongoose');

module.exports = function() {
	//var db = mongoose.connect("mongodb://comradeapp:J4znR06PrOVIEGq1VM5idwiDJeCw7PlulLIjfFztNfp41KF5Ii9jOXDPozxMD4MKRRvCWlerpRNUo3M1SqXLjA==@comradeapp.documents.azure.com:10250/comradedb?ssl=true");
	var db = mongoose.connect('mongodb://admin:admin@ds145365.mlab.com:45365/sentiment_support');

	require('../app/models/posting');
	require('../app/models/twitter');
	require('../app/models/event');
	return db;
};
