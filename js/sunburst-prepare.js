var periods = [
  "201301",
  "201302",
  "201303",
  "201304",
  "201305",
  "201306",
  "201307",
  "201308",
  "201309",
  "201310",
  "201311",
  "201312",
  "201401",
  "201402",
  "201403",
  "201404",
  "201405",
  "201406",
  "201407",
  "201408",
  "201409",
  "201410",
  "201411",
  "201412",
  "201501",
  "201502",
  "201503",
  "201504",
  "201505",
  "201506",
  "201507",
  "201508",
  "201509",
  "201510",
  "201511",
  "201512",
  "201601",
  "201602",
  "201603",
  "201604",
  "201605",
  "201606",
  "201607",
  "201608",
  "201609"
]

var buildHierarchy = function() {
  var deferred = $.Deferred();
  $.when(loadSectorsFile()).done(function(data) {
    var hierarchy = { "stocks": {} };
    _.map(data, function(row) {
      if (!(row.country in hierarchy.stocks)) {
        hierarchy.stocks[row.country] = {};
      }
      if (!(row.sector in hierarchy.stocks[row.country])) {
        hierarchy.stocks[row.country][row.sector] = {};
      }
      if (!(row.name in hierarchy.stocks[row.country][row.sector])) {
        hierarchy.stocks[row.country][row.sector][row.name] = {};
      }
      hierarchy.stocks[row.country][row.sector][row.name] = row.symbol;
    });
    deferred.resolve(hierarchy);
  });
  return deferred;
};

var buildHierarchyWithPrices = function() {
  var hierarchyWithPrices = undefined;
  var def = $.Deferred();
  $.when(buildHierarchy()).then(function(hierarchy) {
    var innerDefs = [];
    _.forEach(hierarchy.stocks, function(countryValue, country) {
      _.forEach(hierarchy.stocks[country], function(sectorValue, sector) {
        _.forEach(hierarchy.stocks[country][sector], function(symbol, name) {
          var innerDef = $.Deferred();
          innerDefs.push(innerDef);
          $.when(loadPriceFile(symbol)).done(function(data) {
            var filteredData = _.filter(data, function(row) {
              return _.includes(periods, row.atDate);
            });
            var priceData = _.map(filteredData, function(row) {
              // Sunburst script does NOT accept decimals
              return Math.floor(+row.close);
            });
            hierarchy.stocks[country][sector][name] = priceData;
            hierarchyWithPrices = hierarchy;
            innerDef.resolve();
          });
        });
      });
    });
    return $.when.apply($, innerDefs);
  }).done(function() {
    def.resolve(hierarchyWithPrices);
  });
  return def;
}
