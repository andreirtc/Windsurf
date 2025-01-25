/*
 * Initialization of SVG elements for the other widgets to draw on
 * TODO: Think of a better use for this file
 */

var mainSvg = d3.select("#viz")
    .append("svg")
    .attr("viewBox", `0 0 ${MAIN_SVG_WIDTH} ${MAIN_SVG_HEIGHT}`)
    .attr("preserveAspectRatio", "xMidYMin meet")
    .attr("id", "maingraph");

// Currently pseudocodeSvg is not used; pseudocodes are handled by front end
var pseudocodeSvg = d3.select("#pseudocode")
    .append("svg")
    .attr("width", PSEUDOCODE_SVG_WIDTH)
    .attr("height", PSEUDOCODE_SVG_HEIGHT);