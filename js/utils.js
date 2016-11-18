var loadSectorsFile = function() {
  var deferred = $.Deferred();
  d3.csv("resources/data/sectors.csv", function(error, data) {
    deferred.resolve(data);
  });
  return deferred;
};

var loadPriceFile = function(symbol) {
  var deferred = $.Deferred();
  d3.csv("resources/data/prices/" + symbol + ".csv", function(error, data) {
    deferred.resolve(data);
  });
  return deferred;
};

var loadFundamentalsFile = function(symbol) {
  var deferred = $.Deferred();
  d3.csv("resources/data/fundamentals/" + symbol + ".csv", function(error, data) {
    deferred.resolve(data);
  });
  return deferred;
};

// A very, very elementary version
var prettifyHtmlString = function(htmlString) {
  return htmlString.replace("&amp;", "&");
};
