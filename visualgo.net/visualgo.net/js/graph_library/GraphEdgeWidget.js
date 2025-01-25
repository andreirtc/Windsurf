// Defines ONE edge object
// Direction of edge is a -> b
// Set styles in properties.js and the CSS files!!!

/*
 * Constants for "type":
 * EDGE_TYPE_UDE = UnDirected Edge
 * EDGE_TYPE_DE = Directed Edge
 * EDGE_TYPE_BDE = BiDirectional Edge
 */

// GraphEdgeWidget object
// TODO: Better implementation of edge weight

var GraphEdgeWidget = function(graphVertexA, graphVertexB, edgeIdNumber, type, weight, isMediumScale, markerPosition = MARKER_POSITION_END, strokeWidth = 3) {
    resetSVGMarkers();
    if (weight == null || isNaN(weight)) weight = 1;

    var self = this;
    var defaultAnimationDuration = 250; // millisecond
    var line, clickableArea;
    var weightText, weightTextPath, weightTextSpan
    var vertexAId = graphVertexA.getId();
    var vertexBId = graphVertexB.getId();
    var isMediumScale = isMediumScale;
    var edgeProperties = isMediumScale ? graphEdgePropertiesMedium : graphEdgeProperties;
    var markerPosition = markerPosition; // valid arguments are marker-mid, marker-end, marker-start, currently unchangeable once set
    var strokeWidth = strokeWidth;
    var edgeGenerator = d3.svg.line()
        .x(function(d) {
            return d.x;
        })
        .y(function(d) {
            return d.y;
        })
        .interpolate("linear");

    var lineCommand = edgeGenerator(calculatePath());
    var initCommand = edgeGenerator([calculatePath()[0], calculatePath()[0], calculatePath()[0]]);

    var attributeList = {
        "path": {
            "id": null,
            "class": null,
            "d": null,
            "stroke": null,
            "stroke-width": null,
        },
        "weight": {
            "id": null,
            "startOffset": null,
            "dy": null,
            "fill": null,
            "font-family": null,
            "font-weight": null,
            "font-size": null,
            "text-anchor": null,
            "text": null
        }
    };

    var mainSvg = mainSvg;

    updatePath();
    init();
    this.redraw = function(duration) {
        draw(duration);
    };

    this.animateHighlighted = function(duration) {
        if (duration == null || isNaN(duration)) duration = defaultAnimationDuration;
        if (duration <= 0) duration = 1;

        edgeSvg.append("path")
            .attr("id", "tempEdge" + line.attr("id"))
            .attr("stroke", edgeProperties["animateHighlightedPath"]["stroke"])
            .attr("stroke-width", edgeProperties["animateHighlightedPath"]["stroke-width"])
            .transition()
            .duration(duration)
            .each("start", function() {
                edgeSvg.select("#tempEdge" + line.attr("id"))
                    .attr("d", initCommand);
            })
            .attr("d", lineCommand)
            .each("end", function() {
                line.attr("stroke", edgeProperties["path"]["highlighted"]["stroke"])
                    .attr("stroke-width", edgeProperties["path"]["stroke-width"]);
                edgeSvg.select("#tempEdge" + line.attr("id"))
                    .remove();
                draw(0);
            })
    }

    this.showEdge = function() {
        attributeList["path"]["d"] = lineCommand;
        attributeList["path"]["stroke-width"] = edgeProperties["path"]["stroke-width"];
    }

    this.hideEdge = function() {
        attributeList["path"]["d"] = initCommand;
    }

    this.showWeight = function() {
        attributeList["weight"]["font-size"] = edgeProperties["weight"]["font-size"];
    }

    this.hideWeight = function() {
        attributeList["weight"]["font-size"] = 0;
    }

    this.stateEdge = function(stateName) {
        var key;
        for (key in edgeProperties["path"][stateName])
            attributeList["path"][key] = edgeProperties["path"][stateName][key];
        for (key in edgeProperties["weight"][stateName])
            attributeList["weight"][key] = edgeProperties["weight"][stateName][key];
    }

    // Removes the edge (no animation)
    // If you want animation, hide & redraw the edge first, then call this function
    this.removeEdge = function() {
        graphVertexA.removeEdge(self);
        graphVertexB.removeEdge(self);
        line.remove();
        weightText.remove();
    }

    this.refreshPath = function() {
        var tempInit = initCommand;
        updatePath();
        if (attributeList["path"]["d"] == tempInit)
            attributeList["path"]["d"] = initCommand;
        else
            attributeList["path"]["d"] = lineCommand;
    }

    this.changeVertexA = function(newGraphVertexA) {
        var edgeDrawn = false;
        if (attributeList["path"]["d"] == lineCommand) edgeDrawn = true;

        graphVertexA.removeEdge(self);
        graphVertexA = newGraphVertexA;
        updatePath();

        lineCommand = edgeGenerator(calculatePath());
        initCommand = edgeGenerator([calculatePath()[0]]);
        attributeList["path"]["d"] = initCommand;
        graphVertexA.addEdge(self);

        if (edgeDrawn) attributeList["path"]["d"] = lineCommand;
    }

    this.changeVertexB = function(newGraphVertexB) {
        var edgeDrawn = false;
        if (attributeList["path"]["d"] == lineCommand) edgeDrawn = true;

        graphVertexB.removeEdge(self);
        graphVertexB = newGraphVertexB;
        updatePath();

        lineCommand = edgeGenerator(calculatePath());
        initCommand = edgeGenerator([calculatePath()[0]]);
        attributeList["path"]["d"] = initCommand;
        graphVertexB.addEdge(self);

        if (edgeDrawn) attributeList["path"]["d"] = lineCommand;
    }

    this.changeType = function(newType) {
        type = newType;
        updatePath();
        switch (type) {
            case EDGE_TYPE_UDE:
                attributeList["path"]["class"] = "ude";
                break;
            case EDGE_TYPE_DE:
                attributeList["path"]["class"] = "de";
                break;
            case EDGE_TYPE_BDE:
                attributeList["path"]["class"] = "bde";
                break;
            default:
                break;
        }
    }

    this.changeWeight = function(newWeight) {
        weight = newWeight;
        attributeList["weight"]["text"] = weight;
    }

    this.changeStrokeWidth = function(newStrokeWidth) {
        strokeWidth = newStrokeWidth;
        attributeList["path"]["stroke-width"] = newStrokeWidth;
    }

    this.getVertex = function() {
        return [graphVertexA, graphVertexB];
    }

    this.getAttributes = function() {
        return deepCopy(attributeList["path"]);
    }

    this.getType = function() {
        return type;
    }

    this.toggleLOD = function() {
        //console.log("vertex lod changed");
        isMediumScale = !isMediumScale;
        //console.log(isMediumScale);
        edgeProperties = isMediumScale ? graphEdgePropertiesMedium : graphEdgeProperties;
        // this.removeVertex();
        // init();
        if (attributeList["weight"]["font-size"] != 0) { // if unweighted, leave the font-size to 0
            attributeList["weight"]["font-size"] = edgeProperties["weight"]["font-size"];
        }
        weightText.attr("id", attributeList["weight"]["id"]);
        weightText.attr("fill", attributeList["weight"]["fill"])
            .attr("font-family", attributeList["weight"]["font-family"])
            .attr("font-size", attributeList["weight"]["font-size"])
            .attr("font-weight", attributeList["weight"]["font-weight"])
            .attr("text-anchor", attributeList["weight"]["text-anchor"]);
        updatePath();
        this.showEdge();
        this.redraw(defaultAnimationDuration);
    }

    // Helper Functions
    function resetSVGMarkers() {
        if (markerSvg.select("#arrow").empty()) {
            markerSvg.append("marker")
                .attr("id", "arrow")
                .attr("viewBox", "0 -5 10 10")
                .attr('refX', ARROW_REFX)
                .attr("markerWidth", ARROW_MARKER_WIDTH)
                .attr("markerHeight", ARROW_MARKER_HEIGHT)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5 L10,0 L0,5")
                .attr('fill', ARROW_FILL);
        }
        if (markerSvg.select("#backwardArrow").empty()) {
            markerSvg.append("marker")
                .attr("id", "backwardArrow")
                .attr("viewBox", "-10 -5 10 10")
                .attr('refX', -1 * ARROW_REFX)
                .attr("markerWidth", ARROW_MARKER_WIDTH)
                .attr("markerHeight", ARROW_MARKER_HEIGHT)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5 L-10,0 L0,5")
                .attr('fill', ARROW_FILL);
        }
    }

    function init() {
        attributeList["path"]["id"] = "e" + edgeIdNumber;
        attributeList["path"]["d"] = initCommand;
        attributeList["path"]["stroke"] = edgeProperties["path"]["default"]["stroke"];
        attributeList["path"]["stroke-width"] = strokeWidth;

        switch (type) {
            case EDGE_TYPE_UDE:
                attributeList["path"]["class"] = "ude";
                break;
            case EDGE_TYPE_DE:
                attributeList["path"]["class"] = "de";
                break;
            case EDGE_TYPE_BDE:
                attributeList["path"]["class"] = "bde";
                break;
            default:
                break;
        }

        attributeList["weight"]["id"] = "ew" + edgeIdNumber;
        attributeList["weight"]["startOffset"] = edgeProperties["weight"]["default"]["startOffset"];
        attributeList["weight"]["dy"] = edgeProperties["weight"]["default"]["dy"];
        attributeList["weight"]["fill"] = edgeProperties["weight"]["default"]["fill"];
        attributeList["weight"]["font-family"] = edgeProperties["weight"]["default"]["font-family"];
        attributeList["weight"]["font-size"] = 0;
        attributeList["weight"]["font-weight"] = edgeProperties["weight"]["default"]["font-weight"];
        attributeList["weight"]["text-anchor"] = edgeProperties["weight"]["default"]["text-anchor"];
        attributeList["weight"]["text"] = weight;

        line = edgeSvg.append("path");

        line.attr("id", attributeList["path"]["id"])
            .attr("class", attributeList["path"]["class"]);

        try {
            if (attributeList["path"]["d"] != "MNaN,NaNLNaN,NaN")
                line.attr("d", attributeList["path"]["d"])
                .attr("stroke", attributeList["path"]["stroke"])
                .attr("stroke-width", attributeList["path"]["stroke-width"]);
        } catch (err) {}
        weightText = edgeWeightSvg.append("text");
        weightText.attr("id", attributeList["weight"]["id"]);
        //   .attr('x', function(d) {
        //     var type;
        //     if (vertexAId < vertexBId)
        //       type = 1;
        //     else
        //       type = 2;
        //     curve = 0;
        //     var x = weightXY(graphVertexA.getCx(), graphVertexA.getCy(), graphVertexB.getCx(), graphVertexB.getCy(), type, curve).x;
        //     return x;
        //   })
        //   .attr('y', function(d) {
        //     var type;
        //     if (vertexAId < vertexBId)
        //       type = 1;
        //     else
        //       type = 2;
        //     curve = 0;
        //     var y = weightXY(graphVertexA.getCx(), graphVertexA.getCy(), graphVertexB.getCx(), graphVertexB.getCy(), type, curve).y;
        //     return y;
        //   })
        //   .text(function(d) {return weight});

        weightText.attr("fill", attributeList["weight"]["fill"])
            .attr("font-family", attributeList["weight"]["font-family"])
            .attr("font-size", attributeList["weight"]["font-size"])
            .attr("font-weight", attributeList["weight"]["font-weight"])
            .attr("text-anchor", attributeList["weight"]["text-anchor"]);

        weightTextPath = weightText.append("textPath")
            .attr("xlink:href", function() {
                return "#" + attributeList["path"]["id"];
            })
            .attr("startOffset", attributeList["weight"]["startOffset"]);

        weightTextSpan = weightTextPath.append("tspan")
            .attr("dy", attributeList["weight"]["dy"])
            .text(function() {
                return attributeList["weight"]["text"];
            });
    }

    function cxA() {
        if (graphVertexA)
            return parseFloat(graphVertexA.getAttributes()["outerVertex"]["cx"]);
    }

    function cyA() {
        if (graphVertexA)
            return parseFloat(graphVertexA.getAttributes()["outerVertex"]["cy"]);
    }

    function rA() {
        if (graphVertexA)
            return parseFloat(graphVertexA.getAttributes()["outerVertex"]["r"]);
    }

    function cxB() {
        if (graphVertexA)
            return parseFloat(graphVertexB.getAttributes()["outerVertex"]["cx"]);
    }

    function cyB() {
        if (graphVertexA)
            return parseFloat(graphVertexB.getAttributes()["outerVertex"]["cy"]);
    }

    function rB() {
        if (graphVertexA)
            return parseFloat(graphVertexB.getAttributes()["outerVertex"]["r"]);
    }

    function calculatePath() {
        var x1, x2, y1, y2;
        var dx = cxB() - cxA();
        var dy = cyB() - cyA();
        var offsetX = dy / Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)));
        var offsetY = -dx / Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)));
        if (type == EDGE_TYPE_BDE) {
            // console.log("here if");
            if (isMediumScale) {
                x1 = cxA() + offsetX * rA() / 2;
                y1 = cyA() + offsetY * rA() / 2;
                x2 = cxB() + offsetX * rA() / 2;
                y2 = cyB() + offsetY * rB() / 2;
            } else {
                x1 = cxA() + offsetX * rA() / 4;
                y1 = cyA() + offsetY * rA() / 4;
                x2 = cxB() + offsetX * rA() / 4;
                y2 = cyB() + offsetY * rB() / 4;
            }
        } else {
            // console.log("here else");
            x1 = cxA();
            y1 = cyA();
            x2 = cxB();
            y2 = cyB();
        }
        var pts = getVertexLineIntersectionPoint(x1, y1, x2, y2, rA(), x1, y1);
        var pts2 = getVertexLineIntersectionPoint(x1, y1, x2, y2, rB(), x2, y2);
        var min = 5000;
        var save1 = 0,
            save2 = 0;
        for (var i = 1; i <= 3; i += 2)
            for (var j = 1; j <= 3; j += 2) {
                var d = Math.sqrt((pts[i - 1] - pts2[j - 1]) * (pts[i - 1] - pts2[j - 1]) + (pts[i] - pts2[j]) * (pts[i] - pts2[j]));
                if (d < min) {
                    min = d;
                    save1 = i;
                    save2 = j;
                }
            }

        var beginPoint = {
            "x": pts[save1 - 1],
            "y": pts[save1]
        };
        var endPoint = {
            "x": pts2[save2 - 1],
            "y": pts2[save2]
        };
        var midX = (endPoint["x"] + beginPoint["x"]) / 2;
        var midY = (endPoint["y"] + beginPoint["y"]) / 2;
        var midPoint = {
            "x": midX,
            "y": midY
        };

        return [beginPoint, midPoint, endPoint];
    }

    function getVertexLineIntersectionPoint(x1, y1, x2, y2, r, cx, cy) {
        var baX = x2 - x1; //pointB.x - pointA.x; horizontal distance
        var baY = y2 - y1; //pointB.y - pointA.y; vertical distance
        var caX = cx - x1; //center.x - pointA.x; horizontal distance from centre
        var caY = cy - y1; //center.y - pointA.y; vertical distance from centre

        var a = baX * baX + baY * baY;
        var bBy2 = baX * caX + baY * caY;
        var c = caX * caX + caY * caY - r * r;

        var pBy2 = bBy2 / a;
        var q = c / a;

        var disc = pBy2 * pBy2 - q;
        var tmpSqrt = Math.sqrt(disc);
        var abScalingFactor1 = -pBy2 + tmpSqrt;
        var abScalingFactor2 = -pBy2 - tmpSqrt;

        var r_x1 = x1 - baX * abScalingFactor1;
        var r_y1 = y1 - baY * abScalingFactor1
        var r_x2 = x1 - baX * abScalingFactor2;
        var r_y2 = y1 - baY * abScalingFactor2

        var res = new Array();
        res[0] = r_x1;
        res[1] = r_y1;
        res[2] = r_x2;
        res[3] = r_y2;
        return res;
    }

    function draw(dur) {
        if (dur == null || isNaN(dur)) dur = defaultAnimationDuration;
        if (dur <= 0) dur = 1;

        line.attr("class", attributeList["path"]["class"]);
        line.transition()
            .duration(dur)
            .attr("d", attributeList["path"]["d"])
            .attr("stroke", attributeList["path"]["stroke"])
            .attr("stroke-width", attributeList["path"]["stroke-width"])
            .style("marker-start", function() {
                return null;
                // if (attributeList["path"]["d"] == initCommand)
                //   return null;
                // if (attributeList["path"]["class"] == "bde")
                //   return "url(#backwardArrow)";
                // return null;
            })
            .style(markerPosition, function() {
                if (attributeList["path"]["d"] == initCommand)
                    return null;
                if (attributeList["path"]["class"] == "de" || attributeList["path"]["class"] == "bde")
                    return "url(#arrow)";
                return null;
            });
        var weightColor = attributeList["weight"]["fill"];
        if (weight < 0) {
            weightColor = "#ff0000";
        }
        weightText.transition()
            .duration(dur)
            .attr("fill", weightColor)
            .attr("font-family", attributeList["weight"]["font-family"])
            .attr("font-size", attributeList["weight"]["font-size"])
            .attr("font-weight", attributeList["weight"]["font-weight"])
            .attr("text-anchor", attributeList["weight"]["text-anchor"])
            //.attr("text-anchor", "end")
            //.attr("transform-origin", "center")
            // TODO: Fix the rotation angle to make text upright again
            .attr("transform", function(d) {
                function toDecimal(percent) {
                    return parseFloat(percent) / 100;
                }
                var weightDy = attributeList["weight"]["dy"]
                var weightfontsize = attributeList["weight"]["font-size"]
                var actualdyoffset = weightDy - weightfontsize / 2
                var offsetstart = toDecimal(attributeList["weight"]["startOffset"])

                var dx = cxB() - cxA();
                var dy = cyB() - cyA();
                var length = Math.sqrt(dx * dx + dy * dy)
                var actuallength = length - rA() - rB()
                var actualoffsetlength = actuallength * offsetstart + rA()


                var normdx = dx / length
                var normdy = dy / length
                var actualposX = normdx * actualoffsetlength + cxA()
                var actualposY = normdy * actualoffsetlength + cyA()

                // console.log(dx)
                // console.log(dy)
                var perpenX = actualdyoffset * -normdy
                var perpenY = actualdyoffset * normdx

                var xRot = actualposX + perpenX;
                var yRot = actualposY + perpenY;

                // console.log(xRot)
                // console.log(yRot)
                var angle = -Math.atan2(dy, dx) * 180 / Math.PI;
                // console.log(angle)
                // console.log("rotating text");
                // console.log("xRot: ", xRot);
                // console.log("yRot: ", yRot);
                // console.log("angle:", angle);
                // console.log(attributeList["weight"]["id"]);
                // console.log(d3.select("#" + attributeList["weight"]["id"]).attr("font-family"));
                return `rotate(${angle}, ${xRot}, ${yRot})`
            })
        // .attr("text-decoration", "underline");

        weightTextSpan.transition()
            .duration(dur)
            .text(function() {
                return attributeList["weight"]["text"];
            });
    }

    function updatePath() {
        // calculatePath() now returns 3 points, every update should include 3 points
        lineCommand = edgeGenerator(calculatePath());
        initCommand = edgeGenerator([calculatePath()[0], calculatePath()[0], calculatePath()[0]]);
    }
}