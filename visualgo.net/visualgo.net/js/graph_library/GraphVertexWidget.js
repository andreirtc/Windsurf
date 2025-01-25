// Dgefines ONE vertex object
// Set styles in properties.js and the CSS files!!!

var GraphVertexWidget = function(cx, cy, vertexShape, vertexText, vertexClassNumber, isMediumScale, showVertexNumInMediumScale = true) { // 25 Apr modification, by default I want vertex number to still be shown by default...
    var self = this;
    var defaultAnimationDuration = 250; // millisecond

    var innerVertex;
    var outerVertex;
    var text;
    var extratext;
    var vertexExtraText;
    var id = vertexClassNumber;
    var cx = cx;
    var cy = cy;
    var normalCy = cy;
    var isMediumScale = isMediumScale;
    var showVertexNumInMediumScale = showVertexNumInMediumScale;
    var vertexProperties = isMediumScale ? graphVertexPropertiesMedium : graphVertexProperties;
    var tooltipDiv;
    var hoverTextForeignObject;
    var hoverTextDiv;

    // We're memoizing the functions here because we want to disable them whenever a redraw is called.
    this.mouseoverFunc = null;
    this.mouseleaveFunc = null;
    this.mousemoveFunc = null;
    this.isCurrentlyAnimating = false;

    this.getId = function() {
        return id;
    };
    this.getCx = function() {
        return cx;
    };
    this.getCy = function() {
        return cy;
    };

    var textYaxisOffset = getAppropriateOffsetSize(vertexText) / 3;
    // Needed to make sure that the text can be contained fully in the vertex

    var attributeList = {
        "innerVertex": {
            "class": null,
            "cx": null,
            "cy": null,
            "x": null,
            "y": null,
            "fill": null,
            "r": null,
            "width": null,
            "height": null,
            "stroke": null,
            "stroke-width": null
        },
        "outerVertex": {
            "class": null,
            "cx": null,
            "cy": null,
            "x": null,
            "y": null,
            "fill": null,
            "r": null,
            "width": null,
            "height": null,
            "stroke": null,
            "stroke-width": null
        },
        "text": {
            "class": null,
            "x": null,
            "y": null,
            "fill": null,
            "font-family": null,
            "font-weight": null,
            "font-size": null,
            "text-anchor": null,
            "text": null
        },
        "extratext": {
            "class": null,
            "x": null,
            "y": null,
            "fill": null,
            "font-family": null,
            "font-weight": null,
            "font-size": null,
            "text-anchor": null,
            "text": null
        },
        "hovertextforeignobject": {
            "class": null,
        },
        "hovertextdiv": {
            "class": null,
        }
    }

    // Needed to make sure that the text can be contained fully in the vertex
    function getAppropriateFontSize(text) {
        var textLength = text.toString().length;
        if (textLength >= 6)
            textLength = 6;
        if (textLength === 0)
            textLength = 1;
        return vertexProperties["text"]["font-sizes"][textLength - 1];
    }

    // workaround so that nodes created while in medium-scale mode would have proper offsets to their vertex numbers
    // when swtiching back to normal mode
    function getAppropriateOffsetSize(text) {
        var textLength = text.toString().length;
        if (textLength >= 6)
            textLength = 6;
        if (textLength === 0)
            textLength = 1;
        return graphVertexProperties["text"]["font-sizes"][textLength - 1];
    }

    // JS object with IDs of all edges connected to this vertex as the key and boolean as the value
    // Everytime an edge is added, the value is set to true
    // Everytime an edge is deleted, the value is set to null
    var edgeList = {};

    init();

    // Disables mouseover behavior during animation and re-enables them once completed.
    this.redraw = function(duration) {
        this.isCurrentlyAnimating = true;
        this.disableMouseoverBehavior();
        draw(duration);

        // I hate that I'm relying on a timeout here, but this will suffice... Hopefully.
        // If the drawing fails, this timeout will be a bit wonky, but hopefully won't be too wrong
        // Consider upgrading d3 to get this working :p
        setTimeout(() => {
            this.isCurrentlyAnimating = false;
            this.enableMouseoverBehavior();
        }, duration);
    }

    this.toggleLOD = function() {
        isMediumScale = !isMediumScale;
        vertexProperties = isMediumScale ? graphVertexPropertiesMedium : graphVertexProperties;
        this.showVertex();
        if (isMediumScale) // ensure colours are readable when toggling between scales after animation finishes.
            attributeList["text"]["fill"] = attributeList["outerVertex"]["fill"];
        else {
            if (attributeList["innerVertex"]["fill"] == "#eee")
                attributeList["text"]["fill"] = attributeList["outerVertex"]["fill"];
            else
                attributeList["text"]["fill"] = "#fff";
        }
        this.redraw(defaultAnimationDuration);
    }

    this.toggleVertexNumber = function() {
        showVertexNumInMediumScale = !showVertexNumInMediumScale;
        this.showVertex();
        this.redraw(defaultAnimationDuration);
    }

    // Specifies the duration of the animation in milliseconds
    // If unspecified or illegal value, default duration applies.
    this.showVertex = function() {
        attributeList["outerVertex"]["r"] = vertexProperties["outerVertex"]["r"];
        attributeList["outerVertex"]["width"] = vertexProperties["outerVertex"]["width"];
        attributeList["outerVertex"]["height"] = vertexProperties["outerVertex"]["height"];
        attributeList["outerVertex"]["stroke-width"] = vertexProperties["outerVertex"]["stroke-width"];

        attributeList["innerVertex"]["r"] = vertexProperties["innerVertex"]["r"];
        attributeList["innerVertex"]["width"] = vertexProperties["innerVertex"]["width"];
        attributeList["innerVertex"]["height"] = vertexProperties["innerVertex"]["height"];
        attributeList["innerVertex"]["stroke-width"] = vertexProperties["innerVertex"]["stroke-width"];

        // default first
        attributeList["text"]["font-size"] = getAppropriateFontSize(vertexText);
        attributeList["extratext"]["y"] = cy + textYaxisOffset + 26;
        // cy = normalCy;
        //attributeList["extratext"]["y"] = cy+textYaxisOffset+26;;
        attributeList["text"]["x"] = cx;
        //attributeList["text"]["y"] = cy + textYaxisOffset;

        //console.log(vertexShape + " vs " + VERTEX_SHAPE_CIRCLE);
        if (vertexShape == VERTEX_SHAPE_CIRCLE) { // medium scale modifier is currently only for standard circle
            if (isMediumScale) {
                if (showVertexNumInMediumScale) {
                    attributeList["text"]["font-size"] = 10;
                    attributeList["text"]["y"] = cy - 9; // 14; // 9;
                    //cy = normalCy - 14;
                } else {
                    //if (vertexShape == "rect")
                    //  console.log(vertexShape + " should not be here");
                    attributeList["text"]["font-size"] = 0;
                    attributeList["text"]["y"] = cy;
                    //attributeList["text"]["y"] = cy + textYaxisOffset;
                }
                //attributeList["text"]["x"] = cx;
                attributeList["extratext"]["y"] = cy + textYaxisOffset + 13;
            }
        }

        attributeList["extratext"]["font-size"] = vertexProperties["text"]["extra-text-size"];

        if (vertexShape == "rect_long") {
            attributeList["outerVertex"]["width"] = 200;
            attributeList["innerVertex"]["width"] = 198;
        } else if (vertexShape == "rect") {
            attributeList["outerVertex"]["width"] = 80;
            attributeList["innerVertex"]["width"] = 78;
        } else if (vertexShape == "square") {
            attributeList["outerVertex"]["width"] = 34;
            attributeList["innerVertex"]["width"] = 32;
        }
    }

    this.hideVertex = function() {
        attributeList["outerVertex"]["r"] = 0;
        attributeList["outerVertex"]["width"] = 0;
        attributeList["outerVertex"]["height"] = 0;
        attributeList["outerVertex"]["stroke-width"] = 0;

        attributeList["innerVertex"]["r"] = 0;
        attributeList["innerVertex"]["width"] = 0;
        attributeList["innerVertex"]["height"] = 0;
        attributeList["innerVertex"]["stroke-width"] = 0;

        attributeList["text"]["font-size"] = 0;
        attributeList["extratext"]["font-size"] = 0;
    }

    this.moveVertex = function(cx, cy) {
        attributeList["outerVertex"]["cx"] = cx;
        attributeList["outerVertex"]["cy"] = cy;
        attributeList["outerVertex"]["x"] = cx - vertexProperties["outerVertex"]["width"] / 2;
        attributeList["outerVertex"]["y"] = cy - vertexProperties["outerVertex"]["height"] / 2;

        attributeList["innerVertex"]["cx"] = cx;
        attributeList["innerVertex"]["cy"] = cy;
        attributeList["innerVertex"]["x"] = cx - vertexProperties["innerVertex"]["width"] / 2;
        attributeList["innerVertex"]["y"] = cy - vertexProperties["innerVertex"]["height"] / 2;

        attributeList["text"]["x"] = cx;
        attributeList["text"]["y"] = cy + textYaxisOffset;

        attributeList["extratext"]["x"] = cx;
        var extraOffset = isMediumScale ? 13 : 26;
        attributeList["extratext"]["y"] = cy + textYaxisOffset + extraOffset;

        var key;
        for (key in edgeList)
            edgeList[key].refreshPath();
    }

    this.setVertexLocation = function(newCx, newCy) {
        cx = newCx;
        cy = newCy;
    }

    this.changeText = function(newVertexText) {
        vertexText = newVertexText;
        attributeList["text"]["text"] = newVertexText;
        attributeList["text"]["font-size"] = getAppropriateFontSize(newVertexText);
        if (showVertexNumInMediumScale && isMediumScale) { // && (vertexShape == VERTEX_SHAPE_CIRCLE)) {
            attributeList["text"]["font-size"] = 10;
            attributeList["text"]["y"] = attributeList["text"]["y"] - 14;
        }
    }

    this.changeExtraText = function(newVertexExtraText) {
        vertexExtraText = newVertexExtraText;
        attributeList["extratext"]["text"] = newVertexExtraText;
    }

    this.changeTextFontSize = function(newTextSize) {
        if (newTextSize == null || isNaN(newTextSize)) return;
        attributeList["text"]["font-size"] = newTextSize;
        attributeList["extratext"]["font-size"] = newTextSize;
    }

    this.changeRadius = function(newRadiusInner, newRadiusOuter) {
        if (newRadiusInner == null || isNaN(newRadiusInner)) return;
        attributeList["innerVertex"]["r"] = newRadiusInner;
        if (newRadiusOuter == null || isNaN(newRadiusOuter)) return;
        attributeList["outerVertex"]["r"] = newRadiusOuter;
    }

    this.changeWidth = function(newWidthInner, newWidthOuter) {
        if (newWidthInner == null || isNaN(newWidthInner)) return;
        attributeList["innerVertex"]["width"] = newWidthInner;
        if (newWidthOuter == null || isNaN(newWidthOuter)) return;
        attributeList["outerVertex"]["width"] = newWidthOuter;
    }

    this.changeHeight = function(newHeightInner, newHeightOuter) {
        if (newHeightInner == null || isNaN(newHeightInner)) return;
        attributeList["innerVertex"]["height"] = newHeightInner;
        if (newHeightOuter == null || isNaN(newHeightOuter)) return;
        attributeList["outerVertex"]["height"] = newHeightOuter;
    }

    this.changeShape = function(newShape) {
        if (newShape == "rect_long") {
            attributeList["outerVertex"]["width"] = 200;
            attributeList["innerVertex"]["width"] = 198;
        }
        if (newShape == "rect") {
            attributeList["outerVertex"]["width"] = 80;
            attributeList["innerVertex"]["width"] = 78;
        }
        if (newShape == "square") {
            attributeList["outerVertex"]["width"] = 34;
            attributeList["innerVertex"]["width"] = 32;
        }
    }

    this.changeStrokeWidth = function(newStrokeWidthInner, newStrokeWidthOuter) {
        if (newStrokeWidthInner == null || isNaN(newStrokeWidthInner)) return;
        attributeList["innerVertex"]["stroke-width"] = newStrokeWidthInner;
        if (newStrokeWidthOuter == null || isNaN(newStrokeWidthOuter)) return;
        attributeList["outerVertex"]["stroke-width"] = newStrokeWidthOuter;
    }

    // Removes the vertex (no animation)
    // If you want animation, hide & redraw the vertex first, then call this function
    this.removeVertex = function() {
        outerVertex.remove();
        innerVertex.remove();
        text.remove();
        extratext.remove();
    }

    this.stateVertex = function(stateName) {
        var key;
        for (key in vertexProperties["innerVertex"][stateName])
            attributeList["innerVertex"][key] = vertexProperties["innerVertex"][stateName][key];
        for (key in vertexProperties["outerVertex"][stateName])
            attributeList["outerVertex"][key] = vertexProperties["outerVertex"][stateName][key];
        for (key in vertexProperties["text"][stateName])
            attributeList["text"][key] = vertexProperties["text"][stateName][key];
        // note: I haven't done extratext here, is it necessary?
    }

    this.getAttributes = function() {
        return deepCopy(attributeList);
    }

    this.getClassNumber = function() {
        return vertexClassNumber;
    }

    this.addEdge = function(graphEdge) {
        edgeList[graphEdge.getAttributes()["id"]] = graphEdge;
    }

    this.removeEdge = function(graphEdge) {
        if (edgeList[graphEdge.getAttributes()["id"]] == null || edgeList[graphEdge.getAttributes()["id"]] == undefined)
            return;
        delete edgeList[graphEdge.getAttributes()["id"]];
    }

    this.getEdge = function() {
        var reply = [];
        var key;
        for (key in edgeList)
            reply.push(edgeList[key]);
        return reply;
    }

    this.addHoverText = function(hoverText, mouseoverOriginal, mousemoveOriginal, mouseleaveOriginal) {
        function mouseover(d) {
            if (mouseoverOriginal != null && mouseoverOriginal != undefined) {
                mouseoverOriginal();
            }
            hoverTextForeignObject
                .attr("height", attributeList["hovertextforeignobject"]["height"])
                .attr("width", attributeList["hovertextforeignobject"]["width"]);
            return hoverTextDiv
                .style("visibility", "visible");
        }

        function mousemove(d) {
            if (mousemoveOriginal != null && mousemoveOriginal != undefined) {
                mousemoveOriginal();
            }
            // need to offset w.r.t the viz svg since tooltips are anchored on the viz body, but vertices are anchored on the viz svg
            // so the values returned are off by the difference in sizes between the two parent divs
            // TODO: find a better way to extract the values: the path to the values (mainSvg[0][0]...) were extracted from console logging
            // let xOffset = (window.innerWidth - mainSvg[0][0].width.animVal.value) / 2;
            // let yOffset = (window.innerHeight - mainSvg[0][0].height.animVal.value) / 2;
            const xOffset = 20;
            hoverTextForeignObject
                .attr("x", d3.mouse(this)[0] + xOffset)
                .attr("y", d3.mouse(this)[1]);
            return hoverTextDiv;
            //return tooltipDiv
            //  .style("left", (d3.mouse(this)[0] + xOffset) + "px")
            //  .style("top", (d3.mouse(this)[1] + 20) + "px");
        }

        function mouseleave(d) {
            if (mouseleaveOriginal != null && mouseleaveOriginal != undefined) {
                mouseleaveOriginal();
            }
            // This is needed to prevent the foreign object from blocking other inner vertex components.
            // Blocking inner vertex component would cause the browser to fail to detect the mouseover over the vertex.
            hoverTextForeignObject
                .attr("height", 0)
                .attr("width", 0);
            return hoverTextDiv
                .style("visibility", "hidden");
        }

        if (hoverText == "" || hoverText == null) {
            // remove mouse event listeners
            this.addMouseOverBehaviour();
        } else {
            hoverTextDiv.attr("class", attributeList["hovertextdiv"]["class"])
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("display", "inline-block")
                .style("float", "left")
                .style("padding", "5px")
                .style("position", "relative")
                .style("visibility", "hidden")
                .style("z-index", 999)
                .text(hoverText);

            this.addMouseOverBehaviour(mouseover, mousemove, mouseleave);
        }
    }

    this.enableMouseoverBehavior = function() {
        outerVertex.on("mouseover", this.mouseoverFunc)
            .on("mousemove", this.mousemoveFunc)
            .on("mouseleave", this.mouseleaveFunc);

        innerVertex.on("mouseover", this.mouseoverFunc)
            .on("mousemove", this.mousemoveFunc)
            .on("mouseleave", this.mouseleaveFunc);

        text.on("mouseover", this.mouseoverFunc)
            .on("mousemove", this.mousemoveFunc)
            .on("mouseleave", this.mouseleaveFunc);
    }

    this.disableMouseoverBehavior = function() {
        outerVertex.on("mouseover", null)
            .on("mousemove", null)
            .on("mouseleave", null);

        innerVertex.on("mouseover", null)
            .on("mousemove", null)
            .on("mouseleave", null);

        text.on("mouseover", null)
            .on("mousemove", null)
            .on("mouseleave", null);
    }

    this.addMouseOverBehaviour = function(mouseoverFunc = null, mouseMoveFunc = null, mouseLeaveFunc = null) {
        this.mouseoverFunc = mouseoverFunc;
        this.mousemoveFunc = mouseMoveFunc;
        this.mouseleaveFunc = mouseLeaveFunc;

        if (!this.isCurrentlyAnimating) {
            this.enableMouseoverBehavior();
        }
    }

    // Initialize vertex and draw them, but the object will not be visible due to the radius of the vertex circle set to 0
    function init() {
        var tmp_vertexShape = vertexShape;
        if (vertexShape == "rect_long" || vertexShape == "square") tmp_vertexShape = "rect";
        outerVertex = vertexSvg.append(tmp_vertexShape);
        innerVertex = vertexSvg.append(tmp_vertexShape);
        text = vertexTextSvg.append("text");
        extratext = vertexTextSvg.append("text");
        tooltipDiv = d3.select("body").append("div");
        hoverTextForeignObject = d3.select("#hovertext").append("foreignObject");
        hoverTextDiv = hoverTextForeignObject.append("xhtml:div");

        attributeList["innerVertex"]["class"] = "v" + vertexClassNumber + " inner";
        attributeList["innerVertex"]["cx"] = cx;
        attributeList["innerVertex"]["cy"] = cy;
        attributeList["innerVertex"]["x"] = cx - vertexProperties["innerVertex"]["width"] / 2;
        attributeList["innerVertex"]["y"] = cy - vertexProperties["innerVertex"]["height"] / 2;
        attributeList["innerVertex"]["fill"] = vertexProperties["innerVertex"]["default"]["fill"];
        attributeList["innerVertex"]["r"] = 0;
        attributeList["innerVertex"]["width"] = 0;
        attributeList["innerVertex"]["height"] = 0;
        attributeList["innerVertex"]["stroke"] = vertexProperties["innerVertex"]["default"]["stroke"];
        attributeList["innerVertex"]["stroke-width"] = 0;

        attributeList["outerVertex"]["class"] = "v" + vertexClassNumber + " outer";
        attributeList["outerVertex"]["cx"] = cx;
        attributeList["outerVertex"]["cy"] = cy;
        attributeList["outerVertex"]["x"] = cx - vertexProperties["outerVertex"]["width"] / 2;
        attributeList["outerVertex"]["y"] = cy - vertexProperties["outerVertex"]["height"] / 2;
        attributeList["outerVertex"]["fill"] = vertexProperties["outerVertex"]["default"]["fill"];
        attributeList["outerVertex"]["r"] = 0;
        attributeList["innerVertex"]["width"] = 0;
        attributeList["innerVertex"]["height"] = 0;
        attributeList["outerVertex"]["stroke"] = vertexProperties["outerVertex"]["default"]["stroke"];
        attributeList["outerVertex"]["stroke-width"] = 0;

        attributeList["text"]["class"] = "v" + vertexClassNumber + " maintext";
        attributeList["text"]["x"] = cx;
        attributeList["text"]["y"] = cy + textYaxisOffset;
        attributeList["text"]["fill"] = vertexProperties["text"]["default"]["fill"];
        attributeList["text"]["font-family"] = vertexProperties["text"]["default"]["font-family"];
        attributeList["text"]["font-size"] = 0;
        attributeList["text"]["font-weight"] = vertexProperties["text"]["default"]["font-weight"];
        attributeList["text"]["text-anchor"] = vertexProperties["text"]["default"]["text-anchor"];
        if ((vertexShape == "rect_long") || (vertexShape == "rect") || (vertexShape == "square")) attributeList["text"]["text-anchor"] = "left";
        attributeList["text"]["text"] = vertexText;

        attributeList["extratext"]["class"] = "v" + vertexClassNumber + " extratext";
        attributeList["extratext"]["x"] = cx;
        attributeList["extratext"]["y"] = cy + textYaxisOffset + 26; // 26 is current default offset (below vertex)
        attributeList["extratext"]["fill"] = "red";
        attributeList["extratext"]["font-family"] = vertexProperties["text"]["default"]["font-family"];
        attributeList["extratext"]["font-size"] = 0;
        attributeList["extratext"]["font-weight"] = vertexProperties["text"]["default"]["font-weight"];
        attributeList["extratext"]["text-anchor"] = vertexProperties["text"]["default"]["text-anchor"];
        if ((vertexShape == "rect_long") || (vertexShape == "rect") || (vertexShape == "square")) attributeList["extratext"]["text-anchor"] = "left";
        attributeList["extratext"]["text"] = "";

        attributeList["hovertextforeignobject"]["class"] = "v" + vertexClassNumber + " hovertext foreignobject";
        attributeList["hovertextforeignobject"]["height"] = 100;
        attributeList["hovertextforeignobject"]["width"] = 100;

        attributeList["hovertextdiv"]["class"] = "v" + vertexClassNumber + " hovertext";


        // 25 Jan 2024: added inner and outer classes to the vertices to help make selection of vertices more specific
        // should hopefully not break anything
        innerVertex.attr("class", attributeList["innerVertex"]["class"]).classed("inner", true);
        outerVertex.attr("class", attributeList["outerVertex"]["class"]).classed("outer", true);
        text.attr("class", attributeList["text"]["class"]);
        extratext.attr("class", attributeList["extratext"]["class"]);

        innerVertex.attr("cx", attributeList["innerVertex"]["cx"])
            .attr("cy", attributeList["innerVertex"]["cy"])
            .attr("x", attributeList["innerVertex"]["x"])
            .attr("y", attributeList["innerVertex"]["y"])
            .attr("fill", attributeList["innerVertex"]["fill"])
            .attr("r", attributeList["innerVertex"]["r"])
            .attr("width", attributeList["innerVertex"]["width"])
            .attr("height", attributeList["innerVertex"]["height"])
            .attr("stroke", attributeList["innerVertex"]["stroke"])
            .attr("stroke-width", attributeList["innerVertex"]["stroke-width"]);

        outerVertex.attr("cx", attributeList["outerVertex"]["cx"])
            .attr("cy", attributeList["outerVertex"]["cy"])
            .attr("x", attributeList["outerVertex"]["x"])
            .attr("y", attributeList["outerVertex"]["y"])
            .attr("fill", attributeList["outerVertex"]["fill"])
            .attr("r", attributeList["outerVertex"]["r"])
            .attr("width", attributeList["outerVertex"]["width"])
            .attr("height", attributeList["outerVertex"]["height"])
            .attr("stroke", attributeList["outerVertex"]["stroke"])
            .attr("stroke-width", attributeList["outerVertex"]["stroke-width"]);

        text.attr("x", attributeList["text"]["x"])
            .attr("y", attributeList["text"]["y"])
            .attr("fill", attributeList["text"]["fill"])
            .attr("font-family", attributeList["text"]["font-family"])
            .attr("font-size", attributeList["text"]["font-size"])
            .attr("font-weight", attributeList["text"]["font-weight"])
            .attr("text-anchor", attributeList["text"]["text-anchor"])
            .text(function() {
                return attributeList["text"]["text"];
            });

        extratext.attr("x", attributeList["extratext"]["x"])
            .attr("y", attributeList["extratext"]["y"])
            .attr("fill", attributeList["extratext"]["fill"])
            .attr("font-family", attributeList["extratext"]["font-family"])
            .attr("font-size", attributeList["extratext"]["font-size"])
            .attr("font-weight", attributeList["extratext"]["font-weight"])
            .attr("text-anchor", attributeList["extratext"]["text-anchor"])
            //.attr("z-index", "10") // see if this works
            .text(function() {
                return attributeList["extratext"]["text"];
            });

        hoverTextForeignObject.attr("class", attributeList["hovertextforeignobject"]["class"]);
        hoverTextDiv.attr("class", attributeList["hovertextdiv"]["class"]);
    }

    // Refreshes the vertex image
    // "dur" specifies the duration of the animation in milliseconds
    // If unspecified or illegal value, default duration applies.
    function draw(dur) {
        if (dur == null || isNaN(dur)) dur = defaultAnimationDuration;
        if (dur <= 0) dur = 1;

        innerVertex.transition()
            .duration(dur)
            .attr("cx", attributeList["innerVertex"]["cx"])
            .attr("cy", attributeList["innerVertex"]["cy"])
            .attr("x", attributeList["innerVertex"]["x"])
            .attr("y", attributeList["innerVertex"]["y"])
            .attr("fill", attributeList["innerVertex"]["fill"])
            .attr("r", attributeList["innerVertex"]["r"])
            .attr("width", attributeList["innerVertex"]["width"])
            .attr("height", attributeList["innerVertex"]["height"])
            .attr("stroke", attributeList["innerVertex"]["stroke"])
            .attr("stroke-width", attributeList["innerVertex"]["stroke-width"]);

        outerVertex.transition()
            .duration(dur)
            .attr("cx", attributeList["outerVertex"]["cx"])
            .attr("cy", attributeList["outerVertex"]["cy"])
            .attr("x", attributeList["outerVertex"]["x"])
            .attr("y", attributeList["outerVertex"]["y"])
            .attr("fill", attributeList["outerVertex"]["fill"])
            .attr("r", attributeList["outerVertex"]["r"])
            .attr("width", attributeList["outerVertex"]["width"])
            .attr("height", attributeList["outerVertex"]["height"])
            .attr("stroke", attributeList["outerVertex"]["stroke"])
            .attr("stroke-width", attributeList["outerVertex"]["stroke-width"]);

        text.transition()
            .duration(dur)
            .attr("x", attributeList["text"]["x"])
            .attr("y", attributeList["text"]["y"])
            .attr("fill", attributeList["text"]["fill"])
            .attr("font-family", attributeList["text"]["font-family"])
            .attr("font-size", attributeList["text"]["font-size"])
            .attr("font-weight", attributeList["text"]["font-weight"])
            .attr("text-anchor", attributeList["text"]["text-anchor"])
            .text(function() {
                return attributeList["text"]["text"];
            });

        let extratextTransition = extratext.transition()
            .duration(dur)
            .attr("x", attributeList["extratext"]["x"])
            .attr("y", attributeList["extratext"]["y"])
            .attr("fill", attributeList["extratext"]["fill"])
            .attr("font-family", attributeList["extratext"]["font-family"])
            .attr("font-size", attributeList["extratext"]["font-size"])
            .attr("font-weight", attributeList["extratext"]["font-weight"])
            .attr("text-anchor", attributeList["extratext"]["text-anchor"])
            .text(function() {
                return attributeList["extratext"]["text"];
            });
    }
}