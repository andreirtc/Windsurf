var GraphTextWidget = function(x, y, value, textIdNumber, colour) {
    var self = this;
    var defaultAnimationDuration = 250; // millisecond

    var id = textIdNumber;
    var cx = x;
    var cy = y;
    var text;
    var fill = colour;
    var fontSize = 15;
    var textProperties = graphTextProperties;

    this.getId = function() {
        return id;
    };
    this.getX = function() {
        return cx;
    }
    this.getY = function() {
        return cy;
    }

    var attributeList = {
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
        }
    }

    init();

    this.redraw = function(duration) {
        draw(duration);
    }

    this.toggleLOD = function() {
        this.redraw(defaultAnimationDuration);
    }

    this.showText = function() {
        attributeList["text"]["x"] = cx;
        attributeList["text"]["y"] = cy;
        attributeList["text"]["fill"] = fill;
        attributeList["text"]["font-size"] = fontSize;
    }

    this.hideText = function() {
        attributeList["text"]["font-size"] = 0;
    }

    this.moveText = function(nx, ny) {
        attributeList["text"]["x"] = nx;
        attributeList["text"]["y"] = ny;
    }

    this.changeText = function(newText) {
        attributeList["text"]["text"] = newText;
    }

    this.changeFontSize = function(newFontSize) {
        if (newFontSize == null || isNaN(newFontSize)) return;
        fontSize = newFontSize;
        attributeList["text"]["font-size"] = newFontSize;
    }

    this.changeColour = function(newColour) {
        if (newColour == null) return;
        fill = newColour;
        attributeList["text"]["fill"] = newColour;
    }

    this.removeText = function() {
        text.remove();
    }

    this.stateText = function(stateName) {
        var key;
        for (key in textProperties["text"][stateName])
            attributeList["text"][key] = textProperties["text"][stateName][key];
    }

    this.getAttributes = function() {
        return deepCopy(attributeList);
    }

    this.getIdNumber = function() {
        return textIdNumber;
    }

    function init() {
        text = vertexTextSvg.append("text");

        attributeList["text"]["id"] = id;
        attributeList["text"]["class"] = "v";
        attributeList["text"]["x"] = cx;
        attributeList["text"]["y"] = cy;
        attributeList["text"]["fill"] = fill;
        attributeList["text"]["font-family"] = textProperties["text"]["default"]["font-family"];
        attributeList["text"]["font-size"] = fontSize;
        attributeList["text"]["font-weight"] = textProperties["text"]["default"]["font-weight"];
        attributeList["text"]["text-anchor"] = textProperties["text"]["default"]["text-anchor"];
        attributeList["text"]["text"] = value;

        text.attr("class", attributeList["text"]["class"]);

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
    }

    function draw(dur) {
        if (dur == null || isNaN(dur)) dur = defaultAnimationDuration;
        if (dur <= 0) dur = 1;

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
    }
}