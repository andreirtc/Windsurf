function edge_weighted(graph_type) {
    switch (graph_type) {
        case "graphds U/U":
            return false;
        case "graphds U/W":
            return true;
        case "graphds D/U":
            return false;
        case "graphds D/W":
            return true;
        case "dfsbfs":
            return false;
        case "u bip matching":
            return false;
        case "w bip matching":
            return true;
        case "u gen matching":
            return false;
        case "maxflow":
            return true;
        case "mst":
            return true;
        case "mvc":
            return false;
        case "mwvc":
            return false;
        case "sssp":
            return true;
        case "steinertree":
            return true;
        case "tsp":
            return true;
        default:
            break;
    }
}

function directed(graph_type) {
    switch (graph_type) {
        case "graphds U/U":
            return false;
        case "graphds U/W":
            return false;
        case "graphds D/U":
            return true;
        case "graphds D/W":
            return true;
        case "dfsbfs":
            return true;
        case "matching":
            return false;
        case "w bip matching":
            return false;
        case "u gen matching":
            return false;
        case "maxflow":
            return true;
        case "mst":
            return false;
        case "mvc":
            return false;
        case "mwvc":
            return false;
        case "sssp":
            return true;
        case "steinertree":
            return false;
        case "tsp":
            return false;
        default:
            break;
    }
}

function vertex_weighted(graph_type) {
    switch (graph_type) {
        case "graphds U/U":
            return false;
        case "graphds U/W":
            return false;
        case "graphds D/U":
            return false;
        case "graphds D/W":
            return false;
        case "dfsbfs":
            return false;
        case "matching":
            return false;
        case "w bip matching":
            return false;
        case "u gen matching":
            return false;
        case "maxflow":
            return false;
        case "mst":
            return false;
        case "mvc":
            return false;
        case "mwvc":
            return true;
        case "sssp":
            return false;
        case "steinertree":
            return false;
        case "tsp":
            return false;
        default:
            break;
    }
}

function arrowXY(x1, y1, x2, y2, t) {

    if (x1 === x2) {
        if (t === 1) return {
            x: x2 - 4,
            y: y2
        };
        else return {
            x: x2 + 4,
            y: y2
        };
    }

    if (y1 === y2) {
        if (t === 1) return {
            x: x2,
            y: y2 - 4
        };
        else return {
            x: x2,
            y: y2 + 4
        };
    }

    var m1 = (y2 - y1) / (x2 - x1);
    var m2 = -1 / m1;
    var c2 = y2 - m2 * x2;
    var d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    var v = 4;
    d = d * d + v * v;
    var D = d;
    var z1 = c2 - y1;

    var a = 1 + m2 * m2;
    var b = 2 * m2 * z1 - 2 * x1;
    var c = x1 * x1 + z1 * z1 - D;

    var delta = b * b - 4 * a * c;

    delta = Math.sqrt(delta);

    var x_1 = (-b + delta) / (2 * a);
    var y_1 = m2 * x_1 + c2;

    var x_2 = (-b - delta) / (2 * a);
    var y_2 = m2 * x_2 + c2;

    if (t === 2) return {
        x: x_1,
        y: y_1
    };
    else return {
        x: x_2,
        y: y_2
    };
}

function weightXY(x1, y1, x2, y2, t, curve) {
    var dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    var x2 = (x1 + x2) / 2;
    var y2 = (y1 + y2) / 2;

    if (x1 === x2) {
        if (t === 2) return {
            x: x2 + 16,
            y: y2
        };
        else return {
            x: x2 - 16,
            y: y2
        };
    }

    if (y1 === y2) {
        if (t === 2) return {
            x: x2,
            y: y2 + 16
        };
        else return {
            x: x2,
            y: y2 - 16
        };
    }

    var m1 = (y2 - y1) / (x2 - x1);
    var c1 = y1 - m1 * x1;
    var m2 = -1 / m1;
    var c2 = y2 - m2 * x2;
    var d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    var v = 16;
    if (curve === 1) v = 50;
    if (curve === 2) v = 18;

    d = d * d + v * v;
    var D = d;
    var z1 = c2 - y1;

    var a = 1 + m2 * m2;
    var b = 2 * m2 * z1 - 2 * x1;
    var c = x1 * x1 + z1 * z1 - D;

    var delta = b * b - 4 * a * c;

    delta = Math.sqrt(delta);

    var x_1 = (-b + delta) / (2 * a);
    var y_1 = m2 * x_1 + c2;

    var x_2 = (-b - delta) / (2 * a);
    var y_2 = m2 * x_2 + c2;

    if (t === 2) return {
        x: x_1,
        y: y_1
    };
    else return {
        x: x_2,
        y: y_2
    };
}

function representationConvert(iVL, iEL, weightedVertex = false) {
    /*
      input form:
      iVL: array of {"x", "y", "w"}
      eVL: array of {"u", "v", "w"}
      output form:
      iVL: array of {"id", "x", "y", "weight"}
      eVL: array of {"source", "target", "weight"}
    */

    var newiVL = []
    var newiEL = []
    for (var key in iVL) {
        var vertex = iVL[key]
        if (!weightedVertex) {
            newiVL.push({
                "id": parseInt(key),
                "x": vertex["x"],
                "y": vertex["y"]
            })
        } else {
            newiVL.push({
                "id": parseInt(key),
                "x": vertex["x"],
                "y": vertex["y"],
                "weight": vertex["w"]
            })
        }
    }
    for (var key in iEL) {
        var edge = iEL[key]
        var u = edge["u"]
        var v = edge["v"]
        var weight = edge["w"].toString()
        newiEL.push({
            "source": newiVL[u],
            "target": newiVL[v],
            "weight": weight
        })
    }
    return [newiVL, newiEL]
}

var negate_all_handle;

var GraphVisu = function(graph_type, initNodes, initLinks, maxVertex = 100) {
    const NODE_RADIUS = 16
    // toggle correct menu item
    const DIRECTED = directed(graph_type);
    const VERTEX_WEIGHTED = vertex_weighted(graph_type);
    const EDGE_WEIGHTED = edge_weighted(graph_type);
    var nodes;
    var links;
    var maxNodeId = -1;
    var adjMat = [];
    this.amountVertex = function() {
        return nodes.length
    }
    this.amountEdge = function() {
        return links.length
    }
    var maxNumberVertex = maxVertex,
        grid = 20,
        width = 640,
        height = 360,
        colors = d3.scale.category10();
    var selector = "#drawgraph #draw-viz"
    // clear stuff
    d3.select(selector).selectAll('svg').remove();
    var svg = d3.select(selector)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var countNodeId = new Array(maxNumberVertex);
    for (var i = countNodeId.length; i >= 0; i--) {
        countNodeId[i] = 0;
    }
    var lastNodeId;
    if (!VERTEX_WEIGHTED) {
        nodes = [{
                id: 0,
                x: 100,
                y: 100
            },
            {
                id: 1,
                x: 200,
                y: 200
            },
            {
                id: 2,
                x: 300,
                y: 300
            }
        ];
        lastNodeId = 3
    } else {
        nodes = [{
                id: 0,
                x: 100,
                y: 100,
                w: 3
            },
            {
                id: 1,
                x: 200,
                y: 200,
                w: 5
            },
            {
                id: 2,
                x: 300,
                y: 300,
                w: 7
            }
        ];
        lastNodeId = 3
    }
    if (!EDGE_WEIGHTED) {
        links = [{
                source: nodes[0],
                target: nodes[1],
                weight: 2
            },
            {
                source: nodes[1],
                target: nodes[2],
                weight: 2
            }
        ];
    } else {
        links = [{
                source: nodes[0],
                target: nodes[1]
            },
            {
                source: nodes[1],
                target: nodes[2]
            }
        ];
    }

    if (initNodes == undefined || initLinks == undefined) {
        links = [];
        nodes = [];
    } else {
        nodes = initNodes;
        links = initLinks;
    }
    lastNodeId = 0;

    lastNodeId = nodes.length;
    for (var i = 0; i < nodes.length; i++) {
        countNodeId[nodes[i].id]++;
    }

    for (var i = 0; i < links.length; i++) {
        for (var j = 0; j < nodes.length; j++) {
            if (nodes[j].id === links[i].source.id) {
                links[i].source = nodes[j];
            }
            if (nodes[j].id === links[i].target.id) {
                links[i].target = nodes[j];
            }
        }
    }
    svg.append('svg:defs')
        .append('svg:marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 6)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#000');
    var drag_line = svg.append('svg:path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0');
    var path;
    var circle;
    var weight;
    var selected_node = null,
        selected_link = null,
        mousedown_link = null,
        mousedown_node = null,
        mouseup_node = null;

    function resetMouseVars() {
        mousedown_node = null;
        mouseup_node = null;
        mousedown_link = null;
    }

    function restart() { // redraw everything
        svg.selectAll('g').remove();
        path = svg.append('svg:g').selectAll('path');
        circle = svg.append('svg:g').selectAll('g');
        weight = svg.append('svg:g').selectAll('text');
        circle = circle.data(nodes, function(d) {
            return d.id;
        });
        circle.selectAll('circle')
            .style('fill', function(d) {
                return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id);
            });
        var g = circle.enter().append('svg:g');
        g.append('svg:circle')
            .attr('class', 'node')
            .attr('r', NODE_RADIUS)
            .attr('cx', function(d) {
                return d.x;
            })
            .attr('cy', function(d) {
                return d.y;
            })
            .style('fill', function(d) {
                return (d === selected_node) ? d3.rgb(255, 138, 39) : d3.rgb(238, 238, 238);
            })
            .on('mousedown', function(d) {
                if (d3.event.shiftKey) return;
                mousedown_node = d;
                if (mousedown_node === selected_node)
                    selected_node = null;
                else
                    selected_node = mousedown_node;
                selected_link = null;
                // reposition drag line
                drag_line.style('marker-end', 'url(#end-arrow)')
                    .classed('hidden', false)
                    .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);
                restart();
            })
            .on('mouseup', function(d) {
                if (!mousedown_node) return;
                drag_line.classed('hidden', true)
                    .style('marker-end', '');
                // check for drag-to-self
                mouseup_node = d;
                if (mouseup_node === mousedown_node) {
                    resetMouseVars();
                    return;
                }

                var source, target, direction;
                source = mousedown_node;
                target = mouseup_node;
                var link;
                if (DIRECTED) {
                    link = links.filter(function(l) {
                        return (l.source === source && l.target === target);
                    })[0];
                } else {
                    link = links.filter(function(l) {
                        return (l.source === source && l.target === target) || (l.source === target && l.target === source);
                    })[0];
                }

                if (!link) {
                    if (EDGE_WEIGHTED) {
                        var dist = parseInt(Math.sqrt(Math.pow(source.x - target.x, 2) + Math.pow(source.y - target.y, 2)) / 100 + 1);
                        link = {
                            source: source,
                            target: target,
                            weight: dist
                        };
                        links.push(link);
                    } else {
                        link = {
                            source: source,
                            target: target
                        };
                        links.push(link);
                    }
                }

                // select new link
                selected_link = link;
                selected_node = null;
                restart();
            });

        g.append('svg:text')
            .attr('x', function(d) {
                return d.x;
            })
            .attr('y', function(d) {
                return d.y + 16 / 3;
            })
            .attr('class', 'id')
            .text(function(d) {
                return d.id;
            });

        // drawing paths
        path = path.data(links);
        path.classed('selected', function(d) {
            return d === selected_link;
        });
        path.enter().append('svg:path')
            .attr('class', 'link')
            .classed('selected', function(d) {
                return d === selected_link;
            })
            .style('marker-end', function(d) {
                if (DIRECTED) return 'url(#end-arrow)';
            })
            .attr('d', function(d) {
                var deltaX = d.target.x - d.source.x,
                    deltaY = d.target.y - d.source.y,
                    dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
                    normX = deltaX / dist,
                    normY = deltaY / dist,
                    sourcePadding = 12,
                    targetPadding = 17;
                if (!DIRECTED) targetPadding = 12;
                var sourceX = d.source.x + (sourcePadding * normX),
                    sourceY = d.source.y + (sourcePadding * normY),
                    targetX = d.target.x - (targetPadding * normX),
                    targetY = d.target.y - (targetPadding * normY);
                if (!DIRECTED)
                    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;

                // check if needs to draw curve or not ?
                var link;
                link = links.filter(function(l) {
                    return (l.source === d.target && l.target === d.source);
                })[0];

                if (link) {
                    // need arrow
                    var type;
                    if (d.source.id < d.target.id)
                        type = 1;
                    else
                        type = 2;
                    // change final point of arrow
                    var finalX = arrowXY(sourceX, sourceY, targetX, targetY, type).x;
                    var finalY = arrowXY(sourceX, sourceY, targetX, targetY, type).y;
                    var beginX = arrowXY(targetX, targetY, sourceX, sourceY, type).x;
                    var beginY = arrowXY(targetX, targetY, sourceX, sourceY, type).y;
                    return 'M' + beginX + ',' + beginY + 'L' + finalX + ',' + finalY;
                } else { // no need
                    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
                }
                // end check
            })
            .on('mousedown', function(d) {
                if (d3.event.shiftKey) return;
                // select link
                mousedown_link = d;
                if (mousedown_link === selected_link)
                    selected_link = null;
                else
                    selected_link = mousedown_link;
                selected_node = null;
                restart();
            });

        if (EDGE_WEIGHTED) { // start weight display
            weight = svg.append('svg:g').selectAll('text');
            weight = weight.data(links);
            weight.enter().append('svg:text')
                .attr('class', 'weight')
                .attr('x', function(d) {
                    var type;
                    if (d.source.id < d.target.id) {
                        type = 1;
                    } else {
                        type = 2;
                    }
                    var link;
                    link = links.filter(function(l) {
                        return (l.source === d.target && l.target === d.source);
                    })[0];
                    var curve = 0;
                    if (link)
                        curve = 2;
                    var x = weightXY(d.source.x, d.source.y, d.target.x, d.target.y, type, curve).x;
                    return x;
                })
                .attr('y', function(d) {
                    var type;
                    if (d.source.id < d.target.id) {
                        type = 1;
                    } else {
                        type = 2;
                    }
                    var link;
                    link = links.filter(function(l) {
                        return (l.source === d.target && l.target === d.source);
                    })[0];
                    var curve = 0;
                    if (link) {
                        curve = 2;
                    }
                    var y = weightXY(d.source.x, d.source.y, d.target.x, d.target.y, type, curve).y;
                    return y;
                })
                .text(function(d) {
                    return d.weight;
                });
        }

        if (VERTEX_WEIGHTED) {
            weight = svg.append('svg:g').selectAll('text');
            weight = weight.data(nodes);
            weight.enter().append('svg:text')
                .attr('class', 'weight')
                .attr('x', function(d) {
                    return d.x;
                })
                .attr('y', function(d) {
                    return d.y + 30;
                })
                .text(function(d) {
                    return d.weight;
                });
        }

        maxNodeId = -1;
        var countNode = nodes.length;
        var countEdge = links.length;
        adjMat = [];
        for (var i = 0; i < nodes.length; i++)
            if (nodes[i].id > maxNodeId)
                maxNodeId = nodes[i].id;
        maxNodeId++;
        // adjacency matrix
        var validNode = new Array(maxNodeId);
        for (var i = 0; i < maxNodeId; i++)
            validNode[i] = false;
        for (var i = 0; i < nodes.length; i++)
            validNode[nodes[i].id] = true;
        for (var i = 0; i < maxNodeId; i++) {
            adjMat[i] = [];
            for (var j = 0; j < maxNodeId; j++)
                if (validNode[i] === true && validNode[j] === true)
                    adjMat[i][j] = "0";
                else
                    adjMat[i][j] = "x";
        }

        if (!DIRECTED) {
            if (!EDGE_WEIGHTED) {
                for (var i = 0; i < links.length; i++) {
                    adjMat[links[i].source.id][links[i].target.id] = "1";
                    adjMat[links[i].target.id][links[i].source.id] = "1";
                }
            } else {
                for (var i = 0; i < links.length; i++) {
                    adjMat[links[i].source.id][links[i].target.id] = links[i].weight.toString();
                    adjMat[links[i].target.id][links[i].source.id] = links[i].weight.toString();
                }
            }
        } else {
            if (EDGE_WEIGHTED) {
                for (var i = 0; i < links.length; i++) {
                    adjMat[links[i].source.id][links[i].target.id] = "1";
                }
            } else {
                for (var i = 0; i < links.length; i++) {
                    adjMat[links[i].source.id][links[i].target.id] = links[i].weight.toString();
                }
            }
        }

        // json object
        var json = "{\"vl\":{";

        for (var i = 0; i < nodes.length; i++) { // process nodes
            var first = "\"" + i + "\":";
            var obj = new Object();
            obj.x = nodes[i].x;
            obj.y = nodes[i].y;
            if (VERTEX_WEIGHTED) {
                obj.w = nodes[i].weight;
            }
            var second = JSON.stringify(obj);
            json += first + second;
            if (i !== nodes.length - 1) {
                json += ",";
            }
        }

        var add = "},\"el\":{";
        json = json.concat(add);

        for (var i = 0; i < links.length; i++) { // process edges
            var first = "\"" + i + "\":";
            var obj = new Object();
            for (var j = 0; j < nodes.length; j++) {
                if (nodes[j].id == links[i].source.id) {
                    obj.u = j;
                }
                if (nodes[j].id == links[i].target.id) {
                    obj.v = j;
                }
            }
            obj.w = 1;
            if (EDGE_WEIGHTED) {
                obj.w = links[i].weight;
            }
            var second = JSON.stringify(obj);
            json += first + second;
            if (i !== links.length - 1) {
                json += ",";
            }
        }

        add = "}}";
        json = json.concat(add);

        JSONresult = json;
    }

    function mousedown() {
        // TODO: prevent drawing two vertices too close to each other, prevent overlaps
        svg.classed('active', true);
        if (d3.event.shiftKey || mousedown_node || mousedown_link) return;

        // insert new node at point
        var point = d3.mouse(this);
        // check if point overlaps//
        for (var node_id in nodes) {
            var dx = nodes[node_id]['x'] - point[0]
            var dy = nodes[node_id]['y'] - point[1]
            var dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < grid * 2) {
                // bad point
                return;
            }
        }
        var node = {
            id: lastNodeId
        };

        // find new last node ID
        countNodeId[lastNodeId]++;
        for (var i = 0; i < maxNumberVertex; i++)
            if (countNodeId[i] === 0) {
                lastNodeId = i;
                break;
            }

        node.x = point[0];
        node.y = point[1];
        if (VERTEX_WEIGHTED) node.weight = 1;

        node.x = parseInt(node.x) - parseInt(node.x) % grid;
        node.y = parseInt(node.y) - parseInt(node.y) % grid;
        nodes.push(node);
        restart();
    }

    function mousemove() {
        if (!mousedown_node) return;
        drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);
        restart();
    }

    function mouseup() {
        if (mousedown_node) drag_line.classed('hidden', true); // hide drag line
        // because :active only works in WebKit?
        svg.classed('active', false);
        // clear mouse event vars
        resetMouseVars();
    }

    function spliceLinksForNode(node) {
        var toSplice = links.filter(function(l) {
            return (l.source === node || l.target === node);
        });
        toSplice.map(function(l) {
            links.splice(links.indexOf(l), 1);
        });
    }

    var lastKeyDown = -1;
    var drag = d3.behavior.drag().on("drag", function(d) {
        var dragTarget = d3.select(this).select('circle');
        var new_cx, new_cy;
        dragTarget.attr("cx", function() {
                new_cx = d3.mouse($("#drawgraph svg")[0])[0];
                return new_cx;
            })
            .attr("cy", function() {
                new_cy = d3.mouse($("#drawgraph svg")[0])[1];
                return new_cy;
            });
        d.x = new_cx;
        d.y = new_cy;
        d.x = parseInt(d.x) - parseInt(d.x) % grid;
        d.y = parseInt(d.y) - parseInt(d.y) % grid;
        restart();
    });

    function keydown() {

        //d3.event.preventDefault();
        lastKeyDown = d3.event.keyCode;

        if (d3.event.keyCode === 16) { // ctrl
            circle.call(drag);
            svg.classed('ctrl', true);
        }

        if (!selected_node && !selected_link) return;


        switch (d3.event.keyCode) {
            case 46: // delete
                if (selected_node) {
                    nodes.splice(nodes.indexOf(selected_node), 1);
                    spliceLinksForNode(selected_node);
                    countNodeId[selected_node.id] = 0;
                    for (var i = 0; i < maxNumberVertex; i++)
                        if (countNodeId[i] === 0) {
                            lastNodeId = i;
                            break;
                        }
                } else if (selected_link)
                    links.splice(links.indexOf(selected_link), 1);
                selected_link = null;
                selected_node = null;
                restart();
                break;
            case 13: // enter
                if (selected_link && EDGE_WEIGHTED) {
                    while (true) {
                        var newWeight = prompt("Enter new weight: (<= 99)");
                        if (newWeight <= 99) break;
                    }
                    var idx = links.indexOf(selected_link);
                    links[idx].weight = newWeight;
                } else if (selected_node && VERTEX_WEIGHTED) {
                    while (true) {
                        var newWeight = prompt("Enter new weight: (<= 99)");
                        if (newWeight <= 99) break;
                    }
                    var idx = nodes.indexOf(selected_node);
                    nodes[idx].weight = newWeight;
                }
                restart();
                break;
        }
    }

    function keyup() {
        lastKeyDown = -1;
        if (d3.event.keyCode === 16) { // ctrl
            circle.on('mousedown.drag', null)
                .on('touchstart.drag', null);
            svg.classed('ctrl', false);
        }
    }

    negate_all_handle = function() {
        for (let i = 0; i < links.length; i++) {
            links[i].weight *= -1;
        }
        restart();
    }

    svg.on('mousedown', mousedown)
        .on('mousemove', mousemove)
        .on('mouseup', mouseup);
    d3.select(window)
        .on('keydown', keydown)
        .on('keyup', keyup);
    restart();
}

function parseCurrentJSONresult() {
    if (JSONresult == null) return [null, null];
    graph = JSON.parse(JSONresult);
    return [graph["vl"], graph["el"]];
}

var currentGraphVisu;
var JSONresult;

function getGraphVisuGraph(graph_type) {
    var [vl, el] = parseCurrentJSONresult()
    if (vl == null && el == null) {
        return null
    }
    var len = Object.keys(vl).length

    AM = new Array(len).fill(0).map(() => new Array(len).fill([0, 0]));

    for (idx in el) {
        u = el[idx]['u']
        v = el[idx]['v']
        w = el[idx]['w']
        AM[u][v] = [1, w]
        if (!directed(graph_type)) {
            AM[v][u] = [1, w]
        }
    }
    return new Graph(AM, graph_type)
}

function clearGraphVisu(graph_type) {
    currentGraphVisu = new GraphVisu(graph_type, null, null);
}

function showHelp() {
    var helpPopup = document.getElementById("help-popup");
    helpPopup.style.display = "block";
    window.onclick = function(event) {
        if (event.target == helpPopup) {
            helpPopup.style.display = "none";
        }
    }
}

function showGraphInputHelp() {
    var helpPopup = document.getElementById("graph-input-help-popup");
    helpPopup.style.display = "block";
    window.onclick = function(event) {
        if (event.target == helpPopup) {
            helpPopup.style.display = "none";
        }
    }
}

const IndexingOption = {
    Index0: "0-Index",
    Index1: "1-Index"
}

const InputType = {
    EdgeList: "EdgeList",
    AdjacencyMatrix: "AdjacencyMatrix",
    AdjacencyList: "AdjacencyList"
}

class GraphInputConfigs {
    constructor(graph_type, indexingOption, inputType) {
        this.graph_type = graph_type;
        this.indexingOption = indexingOption
        this.inputType = inputType
    }
}

var graphInputConfigs;

function get_graph_from_fields() {
    var ele = document.getElementById('graph-input-field').value;
    try {
        if (graphInputConfigs.inputType == InputType.EdgeList) {
            return [parse_edge_list(ele, graphInputConfigs.graph_type, graphInputConfigs.indexingOption), null]
        } else if (graphInputConfigs.inputType == InputType.AdjacencyMatrix) {
            return [parse_AM(ele, graphInputConfigs.graph_type), null]
        } else {
            return [parse_AL(ele, graphInputConfigs.graph_type, graphInputConfigs.indexingOption), null]
        }
    } catch (err) {
        return [null, err]
    }
}

function showGraphInput() {
    var graphPopup = document.getElementById("custom-graph-input");
    graph = getGraphVisuGraph(graphInputConfigs.graph_type);
    initialise_graph_input_text_field(graph, graphInputConfigs.graph_type)
    graphPopup.style.display = "block";
}

function create_graph() {
    var error_div = document.getElementById("error_messages_graph_input")
    var [graph, err] = get_graph_from_fields(graphInputConfigs.graph_type)
    if (err != null) {
        document.getElementById('graph-input-field').value = err.new_lines
        error_div.innerHTML = '<p>' + err.msg + '</p>'
        return;
    }
    error_div.innerHTML = '';
    var dummy_zero_checkbox = document.getElementById("dummy-zero")
    var drawing_mode = document.querySelector('input[name="graph-drawing-type"]:checked').value;
    var have_dummy_zero = (dummy_zero_checkbox.checked) && (graphInputConfigs.indexingOption == IndexingOption.Index1)
    try {
        var [iVL, iEL] = get_graph_layout(graph, drawing_mode = drawing_mode, dummy_zero = have_dummy_zero)
    } catch (err) {
        error_div.innerHTML = '<p>' + err + '</p>'
        return;
    }
    currentGraphVisu = new GraphVisu(graphInputConfigs.graph_type, iVL, iEL)
    dummy_zero_checkbox.checked = false
    document.getElementById("custom-graph-input").style.display = "none";
}

function initialise_graph_input_text_field(graph) {
    var input_field = document.getElementById('graph-input-field');
    try {
        if (graphInputConfigs.inputType == InputType.EdgeList) {
            var str = graph.edge_list_str(graphInputConfigs.indexingOption)
        } else if (graphInputConfigs.inputType == InputType.AdjacencyMatrix) {
            var str = graph.AM_str()
        } else {
            var str = graph.AL_str(graphInputConfigs.indexingOption)
        }
        input_field.value = str
    } catch (err) {
        // console.log(err)
    }
}

function reshuffleGraphLayout(graph_type) {
    try {
        graph = getGraphVisuGraph(graph_type);
        let drawing_mode = document.querySelector('input[name="graph-drawing-type"]:checked').value;
        let iVL, iEL;
        try {
            [iVL, iEL] = get_graph_layout(graph, drawing_mode = drawing_mode)
        } catch (err) {
            [iVL, iEL] = get_graph_layout(graph)
        }
        currentGraphVisu = new GraphVisu(graph_type, iVL, iEL)
    } catch (err) {
        error_div.innerHTML = '<p>' + err + '</p>'
        return;
    }
}

function closeInput() {
    document.getElementById("custom-graph-input").style.display = "none";
}

function changeInputConfigs() {
    var [graph, _] = get_graph_from_fields()
    graphInputConfigs.inputType = document.querySelector('input[name="graph-input-type"]:checked').value;
    graphInputConfigs.indexingOption = document.querySelector('input[name="indexing-option"]:checked').value;

    if (graph != null) {
        initialise_graph_input_text_field(graph)
    }
}

function get_graph_input_help_html() {
    var style = `
              <style>
                .float-container {
                  border: 3px solid #fff;
                  padding: 5px;
                }
                .float-child {
                  font-size: 14px;
                  width: 29%;
                  float: left;
                  padding: 10px;
                  border: 2px solid red;
                }
                h3 {
                  font-weight: bold
                }
                </style>
              `

    return `<div id="graph-input-help-popup" class="help-popup-modal-background">
            ${style}
            <div class="graph-input-help-popup-content">
              <div>
                <h3> Special Notes:</h3>
                <ul>
                  <font size = "3">
                    <li> The drawn graph is always 0-indexed regardless of the input index option.
                    <li> The dummy 0 vertex option is used to preserve the numbering of the 1 indexed graph input by adding a dummy 0 vertex.
                    This is automatically unchecked after submission.
                    <li> Default drawing randomly draw the graphs each time. If unsatisfied, continue to press submit.
                    <li> Flow graph assumes 0 as source and n-1 as sink.
                  </font>
                </ul>
              </div>
                <div class="float-container">
                  <div class="float-child">
                    <h3>Input format for Edge List:</h3>
                      V E <br>
                      For each edge:<br>
                      u v (w if weighted) <br>
                    <h3>Example (in 1 indexed):</h3>
                      4 6 (4 vertices, 6 edges)<br>
                      1 2<br>
                      2 3<br>
                      3 1<br>
                      1 4<br>
                      4 3<br>
                  </div>
                  <div class="float-child">
                    <h3>Input format for Adjacency Matrix:</h3>
                    V<br>
                    Adjacency Matrix<br><br>
                    <h3>Example:</h3>
                    4<br>
                    0 1 1 1<br>
                    1 0 1 0<br>
                    1 1 0 1<br>
                    1 0 1 0<br>
                  </div>
                  <div class="float-child">
                    <h3>Input format for Adjacency List:</h3>
                    V<br>
                    For each vertex:<br>
                    Deg(v) v1 (w1) v2 (w2)... <br>
                    <h3>Example (Unweighted, 1 Indexed):</h3>
                    4<br>
                    3 2 3 4<br>
                    2 1 3<br>
                    3 1 2 4<br>
                    2 1 3<br>
                  </div>
                </div>
            </div>
          </div>`
}

function include_graph_input(graph_type) {
    graphInputConfigs = new GraphInputConfigs(graph_type, IndexingOption.Index1, InputType.EdgeList)
    var toWrite = `<div id="custom-graph-input" class="graph-input-modal-background">
  <div class="graph-input-background">
    <h1>Input<br> Directed = ${!directed(graph_type)}, Weighted = ${!edge_weighted(graph_type)}</h1>
    <div style="width: 95%; height: auto; display: table">
      <div style= "display: table-row; height:auto">
        <div style = "display: table-cell; width:50%; height:auto">
          <textarea name ="input" id="graph-input-field" overflow-y= "scroll" rows = "15" cols = "35" overflow-x = "scroll" white-space="nowrap"></textarea>
        </div>
        <div id = "graph-input-options" style = "display: table-cell; height:100%; vertical-align:top">\
        </div>
      </div>
    </div>
    <div id = "error_messages_graph_input"></div>
      <button onClick=create_graph() class = "btn">Submit</button>
      <button onClick=closeInput() class = "btn">Close</button>
      <button onClick=showGraphInputHelp()>Help!</button>
    </div>
    ${get_graph_input_help_html()}
    `

    function generateRadio(name, value, onClick, label, checked = false) {
        return `<input type="radio" name=${name} value=${value} ${checked? "checked": ""} onClick = ${onClick}>${label} &nbsp;`
    }
    var menuOptions = `
    <p>Indexing Options</p>
    ${generateRadio("indexing-option", IndexingOption.Index0, "changeInputConfigs()", "0-Indexed", false)}
    ${generateRadio("indexing-option", IndexingOption.Index1, "changeInputConfigs()", "1-Indexed", true)}
    <p>Add dummy 0 vertex: (only work with 1-indexing)</p>
    <input type="checkbox" id="dummy-zero">
    <p>Graph Input Type</p>
    ${generateRadio("graph-input-type", InputType.EdgeList, "changeInputConfigs()", "Edge List", true)}
    ${generateRadio("graph-input-type", InputType.AdjacencyMatrix, "changeInputConfigs()", "Adjacency Matrix", false)}
    ${generateRadio("graph-input-type", InputType.AdjacencyList, "changeInputConfigs()", "Adjacency List", false)}
    <p>Preferred Output Graph</p>`;

    let initial_graph_drawing_type = "Default";
    if (graph_type == "u bip matching" || graph_type == "w bip matching") {
        initial_graph_drawing_type = "Bipartite";
    }
    if (graph_type == "maxflow") {
        initial_graph_drawing_type = "Flow";
    }
    for (let option of ["Default", "Bipartite", "Line", "Cycle", "DAG", "Tree", "Flow"]) {
        menuOptions += generateRadio("graph-drawing-type", option, null, option, option === initial_graph_drawing_type)
    }

    $('#custom-graph-div').html(toWrite);
    $('#graph-input-options').html(menuOptions)
}

function negate_all() {
    negate_all_handle();
}

function write(graph_type) {
    let draw_graph_html = "";
    draw_graph_html += `\
    <div id="main">\
      <div id="draw-status"><p>Status</p></div>\
      <div id="draw-warn"><p>No Warning</p></div>\
      <div id="draw-err"><p>No Error</p></div>\
      <div id="draw-viz">\
    </div>\
    <div id="custom-graph-div"></div>\
    <div id="drawgraph-actions">\
      <button class="button cancel-button" onclick=drawCancel()>Cancel</button>\
      <button class="button clear-button" onclick='clearGraphVisu("${graph_type}")'>Clear</button>\
      <button class="button done-button" onclick=drawDone()>Done</button>\
      <button id="help" class="button help-button" onclick=showHelp()>Help</button>\
  `;
    if (graph_type == "u bip matching" || graph_type == "w bip matching" || graph_type == "maxflow") {
        // note: the only difference is the text on the button.
        draw_graph_html += `\
      <button id="reshuffle-layout" class="button shuffle-button" onClick='reshuffleGraphLayout("${graph_type}")'>Refresh Layout</button>\
    `;
    } else {
        draw_graph_html += `\
      <button id="reshuffle-layout" class="button shuffle-button" onClick='reshuffleGraphLayout("${graph_type}")'>Reshuffle Layout</button>\
    `;
    }
    if (graph_type === "mst" || graph_type === "steinertree") {
        draw_graph_html += `\
      <button id="negate-edges" class="button negate-button" onClick=negate_all()>Negate Edge Weights</button>\
    `;
    }
    draw_graph_html += `\
      <div id="help-popup" class="help-popup-modal-background">\
        <div class="help-popup-content">\
          <ul>\
          <li>Click on empty spaces to add vertex</li>\
          <li>Drag from vertex to vertex to add edge</li>\
          <li>Select + Delete to delete vertex/edge</li>\
          <li>Select Edge + Enter to change edge\'s weight</li>\
          <li>Press Shift and drag vertex to reposition them</li>\
          <li>For Mac users, use Fn + Del for deletion</li>\
          </ul>\
        </div>\
      </div>\
      <form id="drawgraph-form">\
        <!--<input type="checkbox" id="submit" name="submit" value="submit" checked="checked">Submit drawn graph to database for random graph and online quiz purposes\
        <br>--><input type="checkbox" id="copy" name="submit" value="submit" checked="checked">Copy JSON text to clipboard\
      </form>\
    </div>\
  `;
    // idk where this is supposed to go, it's just all the way at the bottom
    // before the revamp.
    // <text x = "250" y = "200"> &bull; Press Ctrl to Drag vertex around</text>\
    $('#drawgraph').html(draw_graph_html);
    include_graph_input(graph_type)
    $('#copy').removeAttr('checked');
}