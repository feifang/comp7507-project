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

// Removing payoutRatio - values too extreme

var axes = [
  "returnOnAssets", 
  "returnOnEquity", 
  "freeCashFlowToAssets", 
  "freeCashFlowToEquity", 
  "operatingProfitMargin",
  "netProfitMargin"
];

var drawChart = function(symbols, periods) {
  var iteratees = [];
  _.forEach(symbols, function(s) {
    _.forEach(periods, function(p) {
      iteratees.push({
        symbol: s,
        period: p
      });
    });
  });
  var allRequests = [];
  var allResponses = [];
  _.forEach(iteratees, function(request) {
    var def = $.Deferred();
    allRequests.push(def);
    $.when(loadPriceFile(request.symbol), loadFundamentalsFile(request.symbol)).done(function(price, fundamentals) {
      var options = {
        w: width,
        h: height,
        margin: margin,
        labelFactor: 1.2,
        maxValue: 0.3,
        levels: 6,
        color: color,
        backgroundSign: 0
      };
      var priceMatch = _.filter(price, function(p) {
        return p.atDate === request.period;
      });
      var fundamentalsMatch = _.filter(fundamentals, function(f) {
        return f.reportingDate === request.period;
      });
      var data = _.map(axes, function(x) {
        return { axis: x, value: Math.min(+fundamentalsMatch[0][x], options.maxValue) };
      });
      options.backgroundSign = +priceMatch[0].monthReturnSign;
      var response = {
        data: data,
        options: options
      };
      allResponses.push(response);
      def.resolve();
    });
  });
  $.when.apply($, allRequests).done(function() {
    var allData = _.map(allResponses, function(r) {
      return r.data;
    });
    var allOptions = _.map(allResponses, function(r) {
      return r.options;
    });
    var opts = allOptions[0];
    if (allData.length > 1) {
      // Multiple records, use neutral as background color
      opts.backgroundSign = 0;
    }
    console.log(allData);
    console.log(opts);
    RadarChart(".radarChart", allData, opts);
  });
};
