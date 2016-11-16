////////////////////////////////////////////////////////////// 
//////////////////////// Set-Up ////////////////////////////// 
////////////////////////////////////////////////////////////// 

var margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
        
var color = d3.scaleOrdinal()
    .range(["#EDC951","#CC333F","#00A0B0"]);
    
////////////////////////////////////////////////////////////// 
/////////////////// Data + Draw function ///////////////////// 
////////////////////////////////////////////////////////////// 

var axes = [
  "returnOnAssets", 
  "returnOnEquity", 
  "freeCashFlowToAssets", 
  "freeCashFlowToEquity", 
  "returnOnAssets",
  "returnOnEquity",
  "payoutRatio"
];

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

var drawChart = function(symbol, period) {
  $.when(loadPriceFile(symbol), loadFundamentalsFile(symbol)).done(function(price, fundamentals) {
    var priceMatch = _.filter(price, function(p) {
      return p.atDate === period;
    });
    var fundamentalsMatch = _.filter(fundamentals, function(f) {
      return f.reportingDate === period;
    });
    var data = _.map(axes, function(x) {
      return { axis: x, value: +fundamentalsMatch[0][x] };
    });
    var options = {
      w: width,
      h: height,
      margin: margin,
      maxValue: 1,
      levels: 5,
      color: color,
      backgroundSign: +priceMatch[0].monthReturnSign
    };
    RadarChart(".radarChart", [data], options);
  });
};
