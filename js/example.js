var deferred1 = $.Deferred();
var deferred2 = $.Deferred();

d3.json("data1.json", function(error, data) {
    deferred1.resolve(data);
});

d3.json("data2.json", function(error, data) {
    deferred2.resolve(data);
});

$.when(deferred1, deferred2).done(function() {
    // Post-processing here
} );

