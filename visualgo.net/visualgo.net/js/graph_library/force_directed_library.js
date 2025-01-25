class Graph {

    constructor(AM, graph_type) {
        this.num_vertices = AM.length
        this.AM = AM
        this.graph_type = graph_type
    }

    get undirected_unweighted_version() {
        let new_AM = new Array(this.num_vertices).fill(0).map(() =>
            new Array(this.num_vertices).fill([0, 0]));

        for (var u = 0; u < this.num_vertices; u += 1) {
            for (var v = 0; v < this.num_vertices; v += 1) {
                if (this.edge_between(u, v)) {
                    new_AM[u][v] = [1, 1]
                }
            }
        }
        return new Graph(new_AM, 101)
    }

    edge_between(u, v) {
        return this.AM[u][v][0] || this.AM[v][u][0]
    }

    edge_from(u, v) {
        return this.AM[u][v][0]
    }
    // get all adjancent nodes..
    neighbours_of(u) {
        var neighbours = []
        for (var v = 0; v < this.num_vertices; v += 1) {
            if (u == v) continue
            if (this.edge_between(u, v)) {
                neighbours.push(v)
            }
        }
        return neighbours
    }
    // get all adjacent nodes that have an edge towards them
    neighbours_from(u) {
        var neighbours = []
        for (var v = 0; v < this.num_vertices; v += 1) {
            if (u == v) continue
            if (this.edge_from(u, v)) {
                neighbours.push(v)
            }
        }
        return neighbours
    }

    get number_of_edges() {
        var num_edges = 0
        for (var u = 0; u < this.num_vertices; u += 1) {
            for (var v = !directed(this.graph_type) ? u + 1 : 0; v < this.num_vertices; v += 1) {
                if (u == v) continue
                if (this.edge_from(u, v)) {
                    num_edges += 1
                }
            }
        }
        return num_edges
    }

    get degrees_of_vertices() {
        return new Array(this.num_vertices)
            .fill().map((_, index) => this.neighbours_of(index).length)
    }

    get out_degrees_of_vertices() {
        return new Array(this.num_vertices)
            .fill().map((_, index) => this.neighbours_from(index).length)
    }

    get in_degrees_of_vertices() {
        var degrees = new Array(this.num_vertices).fill(0)
        for (var u = 0; u < this.num_vertices; u += 1) {
            for (let v of this.neighbours_from(u)) {
                degrees[v] += 1
            }
        }
        return degrees
    }

    dfs_from(start_idx) {
        var cc = [start_idx]
        var vist = new Array(this.num_vertices).fill(0)
        var stack = [start_idx]
        vist[start_idx] = 1
        while (stack.length != 0) {
            var u = stack.pop()
            for (let v of this.neighbours_from(u)) {
                if (vist[v] == 1) continue
                cc.push(v)
                stack.push(v)
                vist[v] = 1
            }
        }
        return cc
    }
    // treats the graph as unweighted
    bfs_from(start_idx) {
        var distances = new Array(this.num_vertices).fill(-1)
        var cc = []
        var queue = [start_idx]
        var cc = [start_idx]
        distances[start_idx] = 0
        while (queue.length != 0) {
            var u = queue.shift()
            for (let v of this.neighbours_from(u)) {
                if (distances[v] != -1) continue
                distances[v] = distances[u] + 1
                queue.push(v)
                cc.push(v)
            }
        }
        return [cc, distances]
    }

    edge_list_str(indexingOption) {
        var edges = []
        var offset = indexingOption == IndexingOption.Index0 ? 0 : 1
        for (var i = 0; i < this.num_vertices; i += 1) {
            for (var j = (!directed(this.graph_type) ? i : 0); j < this.num_vertices; j += 1) {
                var [hav, w] = this.AM[i][j]
                if (hav != 0) {
                    if (!edge_weighted(this.graph_type)) {
                        edges.push([i + offset, j + offset])
                    } else {
                        edges.push([i + offset, j + offset, w])
                    }
                }
            }
        }

        var str = this.num_vertices.toString() + " " + edges.length.toString() + "\n";
        for (let edge of edges) {
            for (let val of edge) {
                str += val.toString() + " ";
            }
            str += "\n"
        }

        return str
    }

    AM_str() {
        var str = this.num_vertices.toString() + "\n"
        for (var i = 0; i < this.num_vertices; i += 1) {
            for (var j = 0; j < this.num_vertices; j += 1) {
                var [hav, w] = this.AM[i][j]
                if (hav == 0) {
                    w = 0
                }
                str += w.toString() + " ";
            }
            str += "\n";
        }
        return str;
    }

    AL_str(indexingOption) {
        var str = this.num_vertices.toString() + "\n"
        for (var i = 0; i < this.num_vertices; i += 1) {
            var toprint = []
            var w = []
            for (var j = 0; j < this.num_vertices; j += 1) {
                var [hav, weight] = this.AM[i][j]
                if (hav != 0) {
                    toprint.push(j + (indexingOption == IndexingOption.Index0 ? 0 : 1))
                    w.push(weight)
                }
            }
            str += toprint.length.toString() + " ";
            for (var idx = 0; idx < toprint.length; idx += 1) {
                str += toprint[idx].toString() + " ";
                if (edge_weighted(this.graph_type)) {
                    str += w[idx].toString() + " ";
                }
            }
            str += "\n";
        }
        return str;
    }
}

class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(pt) {
        return new Vector2D(this.x + pt.x, this.y + pt.y);
    }
    scale(k) {
        return new Vector2D(this.x * k, this.y * k);
    }
    // this - pt.. pt -> this
    vector_from(pt) {
        return this.add(pt.scale(-1));
    }
    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    get unit_vector() {
        return this.scale(1 / this.magnitude);
    }
}

function append_message_to_lines(lines, which_line, msg) {
    if (which_line >= lines.length) {
        lines.append(msg)
    } else {
        lines[which_line] += msg
    }
    fin = ""
    for (let l of lines) {
        fin += l;
        fin += "\n"
    }
    return fin
}

function throw_error(lines, err_msg, which) {
    throw {
        msg: err_msg,
        new_lines: append_message_to_lines(lines, which, " <<<<ERROR")
    }
}

function tryParseInt(token) {
    if (token == undefined) {
        return null
    }
    w = parseInt(token)
    if (isNaN(w)) {
        return null
    }
    return w
}

function parse_edge_list(str, graph_type, indexingOption) {
    lines = str.split("\n");
    tokens = lines[0].split(" ").filter(x => x != '');
    vertex_count = tryParseInt(tokens[0])
    edge_count = tryParseInt(tokens[1])
    if (vertex_count == null || edge_count == null) {
        throw_error(lines, "Error trying to read 1st line. Format is N E", 0)
    }
    let AM = new Array(vertex_count).fill(0).map(() => new Array(vertex_count).fill([0, 0]));
    var u, v, w = 1;
    for (var i = 0; i < edge_count; i++) {
        tokens = lines[i + 1].split(" ").filter(x => x != '');
        u = tryParseInt(tokens[0])
        v = tryParseInt(tokens[1])
        if (u == null || v == null) {
            throw_error(lines, "Error trying to read line " + (i + 2), i + 1)
        }
        if (indexingOption == IndexingOption.Index1) {
            u -= 1
            v -= 1
        }
        if (edge_weighted(graph_type)) {
            w = tryParseInt(tokens[2])
            if (w == null) {
                throw_error(lines, "Error trying to read line " + (i + 2), i + 1)
            }
        }
        if (u < 0 || u >= vertex_count) {
            throw_error(lines, "Invalid u in line " + (i + 2), i + 1)
        }
        if (v < 0 || v >= vertex_count) {
            throw_error(lines, "Invalid v in line " + (i + 2), i + 1)
        }
        AM[u][v] = [1, w]
        if (!directed(graph_type)) {
            AM[v][u] = [1, w]
        }
    }
    return new Graph(AM, graph_type)
}

function parse_AM(str, graph_type) {

    lines = str.split("\n");
    tokens = lines[0].split(" ").filter(x => x != '');
    vertex_count = tryParseInt(tokens[0])
    if (vertex_count == null) {
        throw_error(lines, "Error in reading vertex count!", 0)
    }
    let AM = new Array(vertex_count).fill(0).map(() => new Array(vertex_count).fill([0, 0]));
    for (var i = 0; i < vertex_count; i++) {
        tokens = lines[i + 1].split(" ").filter(x => x != '');
        if (tokens.length != vertex_count) {
            throw_error(lines, "Invalid AM! Check line " + i + 2, i + 1)
        }
        for (var j = 0; j < vertex_count; j++) {
            if (j < i && !directed(graph_type)) continue;
            var w = tryParseInt(tokens[j])
            if (w == null) {
                throw_error(lines, "Invalid line " + i + 2, i + 1)
            }
            if (w != 0) {
                AM[i][j] = [1, w]
                if (!directed(graph_type)) {
                    AM[j][i] = [1, w]
                }
            }
        }
    }
    return new Graph(AM, graph_type)
}

function parse_AL(str, graph_type, indexingOption) {
    lines = str.split("\n");
    tokens = lines[0].split(" ")
    vertex_count = tryParseInt(tokens[0])
    if (vertex_count == null) {
        throw_error(lines, "Error in reading vertex count!", 0)
    }
    let AM = new Array(vertex_count).fill(0).map(() => new Array(vertex_count).fill([0, 0]));
    for (var i = 0; i < vertex_count; i++) {
        tokens = lines[i + 1].split(" ").filter(x => x != '');
        degree = tryParseInt(tokens[0])
        if (degree == null) {
            throw_error(lines, "Invalid line " + i + 2, i + 1)
        }
        var current_idx = 1
        for (var idx = 0; idx < degree; idx += 1) {
            v = tryParseInt(tokens[current_idx])
            w = 1
            if (v == null) {
                throw_error(lines, "Invalid line " + i + 2, i + 1)
            }
            if (indexingOption == IndexingOption.Index1) {
                v -= 1
            }
            if (v < 0 || v >= vertex_count) {
                throw_error(lines, "Invalid endpoint " + i + 2, i + 1)
            }
            current_idx += 1
            if (edge_weighted(graph_type)) {
                w = tryParseInt(tokens[current_idx])
                current_idx += 1
                if (w == null) {
                    throw_error(lines, "Invalid line " + i + 2, i + 1)
                }
            }
            AM[i][v] = [1, w]
            if (!directed(graph_type)) {
                AM[v][i] = [1, w]
            }
        }
    }
    return new Graph(AM, graph_type)
}

function get_random_positions(n) {
    var arr = []
    for (var idx = 0; idx < n; idx++) {
        var posX = Math.random();
        var posY = Math.random();
        arr.push(new Vector2D(posX, posY))
    }
    return arr;
}

function normalise_positions(positions) {
    if (positions.length <= 1) {
        return [new Vector2D(0.5, 0.5)]
    }
    var min_x = positions[0].x;
    var max_x = positions[0].x;
    var min_y = positions[0].y;
    var max_y = positions[0].y;
    for (var idx = 0; idx < positions.length; idx += 1) {
        min_x = Math.min(positions[idx].x, min_x);
        max_x = Math.max(positions[idx].x, max_x);
        min_y = Math.min(positions[idx].y, min_y);
        max_y = Math.max(positions[idx].y, max_y);
    }
    var center_x = (min_x + max_x) / 2;
    var center_y = (min_y + max_y) / 2;
    var reduce_factor = Math.max(max_x - min_x, max_y - min_y);
    var normalised = []
    for (var idx = 0; idx < positions.length; idx += 1) {
        var new_vector = new Vector2D(positions[idx].x - center_x,
            positions[idx].y - center_y);
        var normalised_vector = new_vector.scale(1 / reduce_factor);
        normalised.push(new Vector2D(normalised_vector.x + 0.5, normalised_vector.y + 0.5))
    }
    return normalised
}



function get_positions_line(graph) {

    var degrees = graph.degrees_of_vertices

    var degree1 = []
    for (var idx = 0; idx < graph.num_vertices; idx += 1) {
        if (degrees[idx] == 1) {
            degree1.push(idx)
        } else if (degrees[idx] != 2) {
            return [false, []]
        }
    }

    if (degree1.length != 2) {
        return [false, []]
    }
    var seq = graph.dfs_from(degree1[0])
    if (seq.length != graph.num_vertices) {
        return [false, []]
    }
    var start = 0.05
    var end = 0.95
    var positions = new Array(graph.num_vertices).fill(new Vector2D(0, 0))
    for (var cidx = 0; cidx < graph.num_vertices; cidx += 1) {
        positions[seq[cidx]] = new Vector2D((end - start) / (graph.num_vertices - 1) * cidx + start, 0.5)
    }
    return [true, positions]
}


function get_positions_cycle(graph) {
    var degrees = graph.degrees_of_vertices

    for (var idx = 0; idx < graph.num_vertices; idx += 1) {
        if (degrees[idx] != 2) {
            return [false, []]
        }
    }
    var vist = new Array(graph.num_vertices).fill(0)
    var cc = [0]
    var attached
    for (var u = 1; u < graph.num_vertices; u += 1) {
        if (graph.edge_between(0, u)) {
            attached = u;
            break;
        }
    }
    vist[attached] = 1
    var queue = [0]
    vist[0] = 1
    while (queue.length != 0) {
        var u = queue.pop()
        for (let v of graph.neighbours_from(u)) {
            if (vist[v] == 1) continue
            cc.push(v)
            queue.push(v)
            vist[v] = 1
        }
    }

    if (!graph.edge_between(attached, cc[cc.length - 1])) {
        return [false, []]
    }
    cc.push(attached)

    if (cc.length != graph.num_vertices) {
        return [false, []]
    }
    var radius = 0.45
    var positions = new Array(graph.num_vertices).fill(new Vector2D(0, 0))
    for (var cidx = 0; cidx < graph.num_vertices; cidx += 1) {
        var angle = 2 * Math.PI / graph.num_vertices * cidx
        positions[cc[cidx]] = new Vector2D(Math.cos(angle), Math.sin(angle)).scale(radius).add(new Vector2D(0.5, 0.5))
    }
    return [true, positions]
}

function get_positions_bipartite(graph) {
    var n = graph.num_vertices
    var color = new Array(n).fill(-1)
    var queue = []
    for (var idx = 0; idx < n; idx += 1) {
        if (color[idx] != -1) continue
        queue.push(idx)
        color[idx] = 0
        while (queue.length != 0) {
            var u = queue.pop()
            for (let v of graph.neighbours_from(u)) {
                if (color[v] != -1) {
                    if (color[v] == color[u]) return [false, []]
                } else {
                    color[v] = 1 - color[u]
                    queue.push(v)
                }
            }
        }
    }
    const Y_PADDING = 0.15
    const X_SPACE = 0.4
    var blacks = color.filter(x => x == 0).length
    var whites = n - blacks
    var blackidx = 0
    var whiteidx = 0
    var positions = []
    for (var idx = 0; idx < n; idx++) {
        if (color[idx] == 0) {
            var y = blacks == 1 ? 0.5 : Y_PADDING + (1 - 2 * Y_PADDING) / (blacks - 1) * blackidx
            positions.push(new Vector2D(0.5 - X_SPACE, y))
            blackidx += 1
        } else {
            var y = whites == 1 ? 0.5 : Y_PADDING + (1 - 2 * Y_PADDING) / (whites - 1) * whiteidx
            positions.push(new Vector2D(0.5 + X_SPACE, y))
            whiteidx += 1
        }
    }
    return [true, positions]


}

function get_positions_dag(graph) {
    var n = graph.num_vertices
    var in_degrees = graph.in_degrees_of_vertices
    var q = []
    for (var u = 0; u < n; u += 1) {
        if (in_degrees[u] == 0) {
            q.push(u)
        }
    }
    var top_order = []
    while (q.length != 0) {
        var u = q.pop()
        top_order.push(u)
        for (let v of graph.neighbours_from(u)) {
            in_degrees[v] -= 1
            if (in_degrees[v] == 0) {
                q.push(v)
            }
        }
    }
    if (top_order.length != n) {
        return [false, []]
    }
    var positions = new Array(n)
    var start = 0.05
    var end = 0.95
    for (var i = 0; i < n; i += 1) {
        positions[top_order[i]] = new Vector2D(n != 1 ?
            (end - start) / (n - 1) * i + start : 0.5, Math.random() * 0.7 + 0.15)
    }
    return [true, positions]

}

function get_positions_tree(graph) {
    if (graph.number_of_edges != graph.num_vertices - 1) {
        return [false, []]
    }
    var [_, distances] = graph.bfs_from(0)
    if (distances.includes(-1)) {
        return [false, []]
    }
    var max_dist = Math.max(...distances)

    function get_children(graph, distances, idx) {
        return graph.neighbours_of(idx).
        filter(vertex => distances[vertex] == distances[idx] + 1)
    }

    function extend_tree(graph, distances) {
        var current_ver = graph.num_vertices
        edge_list = []
        for (var u = 0; u < current_ver; u += 1) {
            for (let v of graph.neighbours_of(u)) {
                if (v < u) continue;
                edge_list.push([u, v])
            }
        }
        for (var u = 0; u < graph.num_vertices; u += 1) {
            if (get_children(graph, distances, u).length == 0) {
                var current_u = u
                for (var cur = 0; cur < max_dist - distances[u]; cur += 1) {
                    edge_list.push([current_u, current_ver])
                    current_u = current_ver
                    current_ver += 1
                }
            }
        }
        let AM = new Array(current_ver).fill(0).map(() => new Array(current_ver).fill([0, 0]));
        for (let [u, v] of edge_list) {
            AM[u][v] = [1, 1]
            AM[v][u] = [1, 1]
        }
        return new Graph(AM, true, true)
    }

    var temp_tree = extend_tree(graph, distances)
    var [bfs_order, temp_distances] = temp_tree.bfs_from(0)
    var temp_positions = new Array(temp_tree.num_vertices).fill()
    const MIN_Y = 0.1
    const MAX_Y = 0.9
    const MIN_X = 0.1
    const MAX_X = 0.9
    var leaves = bfs_order.filter(vertex => temp_distances[vertex] == max_dist)
    for (var i = 0; i < leaves.length; i += 1) {
        var x_pos = leaves.length == 1 ? 0.5 :
            MIN_X + (MAX_X - MIN_X) / (leaves.length - 1) * i
        temp_positions[leaves[i]] = new Vector2D(x_pos, MAX_Y)
    }

    function get_mean(arr) {
        return arr.reduce((a, b) => a + b, 0) / arr.length
    }

    for (var level = max_dist - 1; level >= 0; level -= 1) {
        var y_pos = MIN_Y + (MAX_Y - MIN_Y) / max_dist * level
        for (let idx of bfs_order.filter(vertex => temp_distances[vertex] == level)) {
            var children = get_children(temp_tree, temp_distances, idx)
            var x_pos = get_mean(children.map(idx => temp_positions[idx].x))
            temp_positions[idx] = new Vector2D(x_pos, y_pos)
        }
    }
    var positions = new Array(graph.num_vertices).fill().map((_, index) => temp_positions[index])
    return [true, positions]

}

function linspace(low, high, how_many) {
    if (how_many == 1) {
        return [(low + high) / 2]
    } else {
        return new Array(how_many).fill().
        map((_, index) => low + (high - low) / (how_many - 1) * index)
    }
}

function get_positions_flow(graph) {
    var distances = new Array(graph.num_vertices).fill(-1)
    distances[0] = 0
    var queue = []
    queue.push(0)
    while (queue.length != 0) {
        var u = queue.shift();
        for (let v of graph.neighbours_of(u)) {
            if (distances[v] != -1) continue;
            distances[v] = distances[u] + 1
            queue.push(v)
        }
    }
    if (distances.includes(-1)) {
        return [false, []]
    }
    distances[graph.num_vertices - 1] = Math.max(...distances.slice(0, -1)) + 1
    var positions = new Array(graph.num_vertices)
    var xspace = linspace(0.1, 0.9, distances[graph.num_vertices - 1] + 1)
    for (var dist = 0; dist <= distances[graph.num_vertices - 1]; dist += 1) {
        var nodes = []
        for (var idx = 0; idx < distances.length; idx += 1) {
            if (distances[idx] == dist) {
                nodes.push(idx)
            }
        }
        var yspace = linspace(0.1, 0.9, nodes.length)
        for (var idx = 0; idx < nodes.length; idx += 1) {
            positions[nodes[idx]] = new Vector2D(xspace[dist], yspace[idx])
        }
    }
    return [true, positions]
}

// https://cs.brown.edu/people/rtamassi/gdhandbook/chapters/force-directed.pdf
// this is Eades spring model
// spring force: -c1 * log(d/c2)
// repulsive force: c3 / d^2
// velocity: c4 * force
function get_positions_eades(graph) {
    var n = graph.num_vertices
    var current_positions = get_random_positions(n);
    const c1 = 2;
    const c2 = 1;
    const c3 = 1;
    const c4 = 0.1;
    const MAX_ITERATIONS = 1000;
    const threshhold = 0.00001;
    for (var iteration = 0; iteration < MAX_ITERATIONS; iteration += 1) {
        var next_deltas = []
        var max_movement = 0
        for (var u = 0; u < n; u += 1) {
            var current_force = new Vector2D(0, 0);
            for (var v = 0; v < n; v += 1) {
                if (u == v) continue;
                var force_magnitude;
                // attractive is negative, repulsive is positive
                var distance_vector = current_positions[u].vector_from(current_positions[v])
                var d = distance_vector.magnitude
                if (graph.edge_between(u, v)) {
                    force_magnitude = -c1 * Math.log(d / c2)
                } else {
                    force_magnitude = c3 / (d * d)
                }
                current_force = current_force.add(distance_vector.unit_vector.scale(force_magnitude))
            }
            var movement = current_force.scale(c4)
            max_movement = Math.max(max_movement, movement.magnitude)
            next_deltas.push(movement)
        }
        for (var u = 0; u < n; u += 1) {
            current_positions[u] = current_positions[u].add(next_deltas[u]);
        }
        if (max_movement < threshhold) {
            break;
        }
    }
    var normalised = normalise_positions(current_positions);
    return normalised
}

function getEdgesForConnected(graph) {
    var visited = new Set();
    var comps = []
    for (var i = 0; i < graph.num_vertices; i += 1) {
        if (visited.has(i)) continue;
        comps.push(i);
        visited.add(i);
        var queue = [i]
        while (queue.length != 0) {
            var u = queue.pop();
            for (var v = 0; v < graph.num_vertices; v += 1) {
                if (visited.has(v)) continue;
                if (graph.edge_between(u, v)) {
                    visited.add(v);
                    queue.push(v);
                }
            }
        }
    }
    var edges = []
    for (var idx = 1; idx < comps.length; idx += 1) {
        edges.push([comps[0], comps[idx]]);
    }
    return edges;
}
//wanted format:
// iVL: array of (id, x, y) id is the numbering 
// if undirected, do not repeat
// currently using eades model
// actual x is 0 - 900
// actual y is 0 - 350
// give it to allow effective area of (300-600, 25-325) to prevent skewing

function get_graph_layout(graph, drawing_mode = "Default", dummy_zero = false, xlow = 300, xhigh = 600, ylow = 25, yhigh = 325) {
    var iVL = []
    var iEL = []
    var positions
    // this uses the force directed layout by eades algorithm
    if (drawing_mode == "Default") {
        var temp_graph = graph.undirected_unweighted_version
        var temp_edges = getEdgesForConnected(temp_graph);
        for (var [u, v] of temp_edges) {
            temp_graph.AM[u][v] = [1, 1];
        }
        positions = get_positions_eades(temp_graph)
    } else if (drawing_mode == "Bipartite") {
        [is_valid, positions] = get_positions_bipartite(graph.undirected_unweighted_version)
        if (!is_valid) {
            throw new Error("This is not a bipartite graph!")
        }
    } else if (drawing_mode == "Line") {
        xlow = 100;
        xhigh = 800;
        [is_valid, positions] = get_positions_line(graph.undirected_unweighted_version)
        if (!is_valid) {
            throw new Error("This is not a line graph!")
        }
    } else if (drawing_mode == "Cycle") {
        [is_valid, positions] = get_positions_cycle(graph.undirected_unweighted_version)
        if (!is_valid) {
            throw new Error("This is not cycle graph!")
        }
    } else if (drawing_mode == "DAG") {
        xlow = 100;
        xhigh = 700;
        [is_valid, positions] = get_positions_dag(graph)
        if (!is_valid) {
            throw new Error("This is not Directed Acyclic Graph!")
        }
    } else if (drawing_mode == "Tree") {
        xlow = 100;
        xhigh = 700;
        [is_valid, positions] = get_positions_tree(graph.undirected_unweighted_version)
        if (!is_valid) {
            throw new Error("This is not Tree!")
        }
    } else if (drawing_mode == "Flow") {
        xlow = 100;
        xhigh = 700;
        [is_valid, positions] = get_positions_flow(graph.undirected_unweighted_version)
        if (!is_valid) {
            throw new Error("The graph must be connected for flows!")
        }
    }
    if (dummy_zero) {
        iVL.push({
            "id": 0,
            "x": xlow,
            "y": ylow
        })
    }
    for (var idx = 0; idx < graph.num_vertices; idx++) {
        var posX = positions[idx].x * (xhigh - xlow) + xlow;
        var posY = positions[idx].y * (yhigh - ylow) + ylow;
        iVL.push({
            "id": idx + dummy_zero,
            "x": posX,
            "y": posY
        })
    }
    for (var u = 0; u < graph.num_vertices; u++) {
        for (var v = 0; v < graph.num_vertices; v++) {
            if (!directed(graph.graph_type) && (v < u)) continue;
            if (u == v) continue;
            [have_edge, weight] = graph.AM[u][v]
            if (have_edge == 1) {
                iEL.push({
                    "source": iVL[u + dummy_zero],
                    "target": iVL[v + dummy_zero],
                    "weight": weight
                })
            }
        }
    }
    return [iVL, iEL]
}