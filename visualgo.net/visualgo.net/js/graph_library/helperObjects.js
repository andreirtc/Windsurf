/*
 * Data structures to assist internal implementation of algorithmic visualizations
 */


// Make sure to check the type of the objects passed in to avoid bugs (especially if used for comparisons)
var ObjectPair = function(objectOne, objectTwo) {
    this.getFirst = function() {
        return objectOne;
    }
    this.getSecond = function() {
        return objectTwo;
    }
    this.setFirst = function(newObjectOne) {
        objectOne = newObjectOne;
    }
    this.setSecond = function(newObjectTwo) {
        objectTwo = newObjectTwo;
    }
}

ObjectPair.compare = function(objPairOne, objPairTwo) {
    if (objPairOne.getFirst() > objPairTwo.getFirst()) return 1;
    else if (objPairOne.getFirst() < objPairTwo.getFirst()) return -1;
    else {
        if (objPairOne.getSecond() > objPairTwo.getSecond()) return 1;
        if (objPairOne.getSecond() < objPairTwo.getSecond()) return -1;
        else return 0;
    }
}


// Make sure to check the type of the objects passed in to avoid bugs (especially if used for comparisons)
var ObjectTriple = function(objectOne, objectTwo, objectThree) {
    this.getFirst = function() {
        return objectOne;
    }
    this.getSecond = function() {
        return objectTwo;
    }
    this.getThird = function() {
        return objectThree;
    }
    this.setFirst = function(newObjectOne) {
        objectOne = newObjectOne;
    }
    this.setSecond = function(newObjectTwo) {
        objectTwo = newObjectTwo;
    }
    this.setThird = function(newObjectThree) {
        objectThree = newObjectThree;
    }
}

ObjectTriple.compare = function(objTripleOne, objTripleTwo) {
    if (objTripleOne.getFirst() > objTripleTwo.getFirst()) return 1;
    else if (objTripleOne.getFirst() < objTripleTwo.getFirst()) return -1;
    else {
        if (objTripleOne.getSecond() > objTripleTwo.getSecond()) return 1;
        if (objTripleOne.getSecond() < objTripleTwo.getSecond()) return -1;
        else {
            if (objTripleOne.getThird() > objTripleTwo.getThird()) return 1;
            if (objTripleOne.getThird() < objTripleTwo.getThird()) return -1;
            else return 0;
        }
    }
}


var UfdsHelper = function() {
    /*
     * Structure of internalUfds:
     * - key: inserted key
     * - value: JS object with:
     *          - "parent"
     *          - "rank"
     */
    var self = this;
    var internalUfds = {};

    this.insert = function(insertedKey) {
        if (internalUfds[insertedKey] != null) return false;
        var newElement = {};
        newElement["parent"] = insertedKey;
        newElement["rank"] = 0;
        internalUfds[insertedKey] = newElement;
    }

    this.findSet = function(key) {
        if (internalUfds[key] == null) return false;

        var currentParent = internalUfds[key]["parent"];
        var currentElement = key;
        while (currentParent != currentElement) {
            currentElement = currentParent;
            currentParent = internalUfds[currentElement]["parent"];
        }
        internalUfds[key]["parent"] = currentParent;

        return currentParent;
    }

    this.unionSet = function(firstKey, secondKey) {
        if (internalUfds[firstKey] == null || internalUfds[secondKey] == null) return false;
        if (self.isSameSet(firstKey, secondKey)) return true;

        var firstSet = self.findSet(firstKey);
        var secondSet = self.findSet(secondKey);

        if (internalUfds[firstSet]["rank"] > internalUfds[secondSet]["rank"]) {
            internalUfds[firstSet]["parent"] = secondSet;
            internalUfds[secondSet]["rank"]++;
        } else {
            internalUfds[secondSet]["parent"] = firstSet;
            internalUfds[firstSet]["rank"]++;
        }
    }

    this.isSameSet = function(firstKey, secondKey) {
        if (internalUfds[firstKey] == null || internalUfds[secondKey] == null) return false;
        return self.findSet(firstKey) == self.findSet(secondKey);
    }
}


function IsUndirected(iVL, iEL) {
    if (iVL.length == 0) return true;
    var M = [];
    for (var i in iVL) {
        M[i] = [];
        for (var j in iVL)
            M[i][j] = 0;
    }
    for (var key in iEL) {
        var u = iEL[key]["u"],
            v = iEL[key]["v"],
            w = iEL[key]["w"];
        M[u][v] = w;
    }
    for (var i in iVL)
        for (var j in iVL)
            if (M[i][j] != M[j][i])
                return false;
    return true;
}

function IsConstantWeighted(iVL, iEL) {
    if (iVL.length == 0) return true;
    var ref = iEL[0]["w"];
    for (var key in iEL)
        if (iEL[key]["w"] != ref)
            return false;
    return true;
}

function HasNegativeWeight(iVL, iEL) {
    if (iVL.length == 0) return false;
    for (var key in iEL)
        if (parseInt(iEL[key]["w"]) < 0)
            return true;
    return false;
}

function IsTree(iVL, iEL) {
    if (iVL.length == 0) return true;
    if (!IsUndirected(iVL, iEL)) return false;

    function dfs(u) {
        visited[u] = true;
        for (var key in iEL)
            if ((iEL[key]["u"] === u) && (visited[iEL[key]["v"]] === false))
                dfs(iEL[key]["v"]);
    }

    var V = 0,
        E = 0,
        visited = [];
    for (var key in iVL) {
        V++;
        visited[key] = false;
    }
    for (var key in iEL) E++;

    if (E / 2 != V - 1) return false; // first condition

    dfs(0);
    for (var key in iVL)
        if (visited[key] === false)
            return false;
    return true; // second condition
}

function IsDAG(iVL, iEL) {
    if (iVL.length == 0) return true;
    if (IsUndirected(iVL, iEL)) return false; // Undirected graph is obviously full of trivial cycles...

    var V = 0;
    for (var key in iVL) V++;

    var M = [];
    for (var i in iVL) {
        M[i] = [];
        for (var j in iVL)
            M[i][j] = 0;
    }
    for (var key in iEL) {
        var u = iEL[key]["u"],
            v = iEL[key]["v"];
        M[u][v] = 1; // there exist an edge
    }

    for (var k = 0; k < V; k++) // Warshall's algorithm
        for (var i = 0; i < V; i++)
            for (var j = 0; j < V; j++)
                if ((M[i][k] == 1) && (M[k][j] == 1))
                    M[i][j] = 1; // indirectly connected

    for (var i = 0; i < V; i++)
        if (M[i][i] == 1)
            return false; // I can go out and come back to I... a cycle...
    return true;
}

function TopoSort(iVL, iEL) {
    if (iVL.length == 0) return {};
    if (!IsDAG(iVL, iEL)) return {};

    function dfs2(u) {
        visited[u] = true;
        for (var key in iEL)
            if ((iEL[key]["u"] === u) && (visited[iEL[key]["v"]] === false))
                dfs2(iEL[key]["v"]);
        order.unshift(u);
    }

    var visited = [],
        order = [];
    for (var key in iVL) visited[key] = false;

    for (var key in iVL)
        if (!visited[key])
            dfs2(parseInt(key));
    return order;
}

function RunBellmanFord(iVL, iEL, sourceVertex) {
    if (iVL.length == 0) return {};

    var V = 0,
        E = 0,
        d = {},
        virus = [];
    for (var key in iVL) {
        V++;
        d[key] = 999;
        virus[key] = false;
    }
    d[parseInt(sourceVertex)] = 0;
    for (var key in iEL) E++;

    for (var i = 1; i < V; i++) // V-1 passes of Bellman Ford's
        for (var key in iEL) {
            var u = iEL[key]["u"],
                v = iEL[key]["v"],
                w = iEL[key]["w"];
            if ((d[u] != 999) && (w != 999) && (d[u] + w < d[v])) d[v] = d[u] + w;
        }

    function dfs(u) {
        virus[u] = true;
        for (var key in iEL)
            if ((iEL[key]["u"] === u) && (virus[iEL[key]["v"]] === false))
                dfs(iEL[key]["v"]);
    }

    var hasNegativeCycle = false;
    for (var key in iEL) {
        var u = iEL[key]["u"],
            v = iEL[key]["v"],
            w = iEL[key]["w"];
        if ((d[u] != 999) && (d[u] + w < d[v])) {
            dfs(u);
            hasNegativeCycle = true;
        }
    }

    if (hasNegativeCycle)
        for (var key in iVL)
            if (virus[key]) d[key] = "??";
    return d;
}

function HasNegativeWeightCycle(iVL, iEL, sourceVertex) {
    if (iVL.length == 0) return false;

    var V = 0,
        E = 0,
        d = {};
    for (var key in iVL) {
        V++;
        d[key] = 999;
    }
    d[parseInt(sourceVertex)] = 0;
    for (var key in iEL) E++;

    for (var i = 1; i < V; i++) // V-1 passes of Bellman Ford's
        for (var key in iEL) {
            var u = iEL[key]["u"],
                v = iEL[key]["v"],
                w = iEL[key]["w"];
            if ((d[u] != 999) && (w != 999) && (d[u] + w < d[v])) d[v] = d[u] + w;
        }

    var hasNegativeCycle = false;
    for (var key in iEL) {
        var u = iEL[key]["u"],
            v = iEL[key]["v"],
            w = iEL[key]["w"];
        if ((d[u] != 999) && (d[u] + w < d[v])) hasNegativeCycle = true;
    }

    return hasNegativeCycle;
}

function getAdjacencyMatrix(iEL, isUndirected, isUnweighted, numVertex) {
    var arr = []
    for (var i = 0; i < numVertex; i++) {
        arr.push([]);
        for (var j = 0; j < numVertex; j++) {
            arr[i].push("0");
        }
    }
    for (var key in iEL) {
        var u = iEL[key]["u"],
            v = iEL[key]["v"],
            w = iEL[key]["w"]
        arr[u][v] = isUnweighted ? "1" : w
        if (isUndirected) {
            arr[v][u] = isUnweighted ? "1" : w
        }
    }
    return arr
}

function getAdjacencyList(iVL, iEL, isUndirected) {
    adjlist = {}
    for (var key in iVL) {
        adjlist[key] = []
    }
    for (var key in iEL) {
        var u = iEL[key]["u"],
            v = iEL[key]["v"],
            w = iEL[key]["w"]
        adjlist[u].push([v, w])
        if (isUndirected) {
            adjlist[v].push([u, w])
        }
    }
    return adjlist
}

function IsBipartite(iVL, iEL, isUndirected = true) {
    if (iVL.length == 0) return false;
    var color = {};
    for (var key in iVL) {
        color[key] = -1;
    }
    var adjlist = getAdjacencyList(iVL, iEL, isUndirected)
    for (var key in iVL) {
        if (color[key] != -1) continue;
        var q = []
        q.push(key)
        color[key] = 0;
        while (q.length > 0) {
            var u = q.shift();
            for (let [v, w] of adjlist[u]) {
                if (color[v] == -1) {
                    color[v] = 1 - color[u];
                    q.push(v)
                }
                if (color[u] == color[v]) return false;
            }
        }
    }
    return true;
}

// Graph Example Constants
var VL = 0;
var EL = 1;
var CP3_4_1 = 0;
var CP3_4_3 = 1;
var CP3_4_4 = 2;
var CP3_4_9 = 3;
var CP3_4_10 = 4;
var CP3_4_14 = 5;
var CP3_4_17 = 6;
var CP3_4_18 = 7;
var CP3_4_19 = 8;
var CP3_4_24 = 9;
var CP3_4_26_1 = 10;
var CP3_4_26_2 = 11;
var CP3_4_26_3 = 12;
var CP3_4_40 = 13;
var K5 = 14;
var RAIL = 15;
var TESSELLATION = 16;
var BELLMANFORD_KILLER = 17;
var DIJKSTRA_KILLER = 18;
var DAG = 19;
var FORDFULKERSON_KILLER = 20;
var DINIC_SHOWCASE = 21;
var MVC_U_TWO_APPROX_KILLER = 22;
var EXAMPLE_VERTEX_WEIGHTED_TREE = 23;
var MVC_W_TWO_APPROX_KILLER = 24;
var INTERESTING_BIPARTITE = 25;
var LINEAR_CHAIN = 26;
var CS4234_SAMPLE = 27;
var K4 = 28;
var K8 = 29;
var CS4234_TUTORIAL_THREE = 30;
var WHEEL = 31;
var HOUSE_OF_CARDS = 32;
var FMOD = 33;
var GREEDY_AUGMENTING_PATH_KILLER = 34;
var K55 = 35;
var K55_ALMOST = 36;
// from graphds
var CP4_2_7 = 37;
var CP4_4_3 = 38;
var CP4_4_7 = 39;
var CP4_4_8_C = 40;
var CP4_4_8_D = 41;
var CP4_4_9 = 42;
var CP4_4_12 = 43;
var CP4_4_13 = 44;
var CP4_4_16 = 45;
var CP4_4_23 = 46;
var CP4_4_28_A = 47;
var CP4_4_29 = 48;
var CP4_4_36 = 49;
var CP4_8_17_B = 50;
var BIPARTITE = 51;
var TREE = 52;
var B_TREE = 53;
var CYCLIC = 54;
var TOURNAMENT = 55;
var SSSP = 56;
var CP4_2_7_DISJOINT = 57;
var WHEEL_DS = 58;
var STAR = 59;
var DFSBFSLARGE = 60;
var DFSBFSLARGECYCLES = 61;
var MSTLARGE = 62;
var SSSPLARGE = 63;
var SSSPMRT = 64;
var BIPARTITE2 = 65;
var STAR2 = 66;
var CS4234_STEINER_SAMPLE_1 = 67;
var CS4234_STEINER_SAMPLE_2 = 68;
var SQUARE = 69;
var PENTAGON = 70;
var CRESCENT_MOON = 71;
var CIRCLE = 72;
var CONCAVE = 73;
var CONVEX = 74;
var MOUNTAIN = 75;
var MAZE = 76;
var STAR3 = 77;
var GOALKEEPER = 78;
var FISH = 79;
var UNCONNECTED_GRAPH = 80;
var MVC_BRUTEFORCE_LARGE_GRAPH_1 = 81;
var MVC_PSEUDOFOREST = 82;
var K4_BAR = 83;
var K5_BAR = 84;
var MVC_MAX_CLIQUE_EXAMPLE = 85;
var MVC_MAX_CLIQUE_EXAMPLE_BAR = 86;
var TSP_SMALL = 87;
var STEINER_TREE_1 = 88;
var STEINER_TREE_K5_OPT = 89;

// TODO: Add examples here
function getExampleGraph(id, mode) {
    if (id == CP3_4_1) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25
            },
            1: {
                "x": 400,
                "y": 25
            },
            2: {
                "x": 400,
                "y": 125
            },
            3: {
                "x": 500,
                "y": 25
            },
            4: {
                "x": 600,
                "y": 25
            },
            5: {
                "x": 700,
                "y": 25
            },
            6: {
                "x": 600,
                "y": 125
            },
            7: {
                "x": 500,
                "y": 125
            },
            8: {
                "x": 700,
                "y": 125
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 0,
                "w": 1
            },
            2: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            3: {
                "u": 1,
                "v": 3,
                "w": 1
            },
            4: {
                "u": 2,
                "v": 1,
                "w": 1
            },
            5: {
                "u": 2,
                "v": 3,
                "w": 1
            },
            6: {
                "u": 3,
                "v": 1,
                "w": 1
            },
            7: {
                "u": 3,
                "v": 2,
                "w": 1
            },
            8: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            9: {
                "u": 4,
                "v": 3,
                "w": 1
            },
            10: {
                "u": 6,
                "v": 7,
                "w": 1
            },
            11: {
                "u": 6,
                "v": 8,
                "w": 1
            },
            12: {
                "u": 7,
                "v": 6,
                "w": 1
            },
            13: {
                "u": 8,
                "v": 6,
                "w": 1
            },
        };
    } else if (id == CP3_4_3) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25
            },
            1: {
                "x": 400,
                "y": 25
            },
            2: {
                "x": 500,
                "y": 25
            },
            3: {
                "x": 600,
                "y": 25
            },
            4: {
                "x": 300,
                "y": 125
            },
            5: {
                "x": 400,
                "y": 125
            },
            6: {
                "x": 500,
                "y": 125
            },
            7: {
                "x": 600,
                "y": 125
            },
            8: {
                "x": 300,
                "y": 225
            },
            9: {
                "x": 300,
                "y": 325
            },
            10: {
                "x": 400,
                "y": 325
            },
            11: {
                "x": 500,
                "y": 325
            },
            12: {
                "x": 600,
                "y": 325
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 4,
                "w": 1
            },
            2: {
                "u": 1,
                "v": 0,
                "w": 1
            },
            3: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            4: {
                "u": 1,
                "v": 5,
                "w": 1
            },
            5: {
                "u": 2,
                "v": 1,
                "w": 1
            },
            6: {
                "u": 2,
                "v": 3,
                "w": 1
            },
            7: {
                "u": 2,
                "v": 6,
                "w": 1
            },
            8: {
                "u": 3,
                "v": 2,
                "w": 1
            },
            9: {
                "u": 3,
                "v": 7,
                "w": 1
            },
            10: {
                "u": 4,
                "v": 0,
                "w": 1
            },
            11: {
                "u": 4,
                "v": 8,
                "w": 1
            },
            12: {
                "u": 5,
                "v": 1,
                "w": 1
            },
            13: {
                "u": 5,
                "v": 6,
                "w": 1
            },
            14: {
                "u": 5,
                "v": 10,
                "w": 1
            },
            15: {
                "u": 6,
                "v": 2,
                "w": 1
            },
            16: {
                "u": 6,
                "v": 5,
                "w": 1
            },
            17: {
                "u": 6,
                "v": 11,
                "w": 1
            },
            18: {
                "u": 7,
                "v": 3,
                "w": 1
            },
            19: {
                "u": 7,
                "v": 12,
                "w": 1
            },
            20: {
                "u": 8,
                "v": 4,
                "w": 1
            },
            21: {
                "u": 8,
                "v": 9,
                "w": 1
            },
            22: {
                "u": 9,
                "v": 8,
                "w": 1
            },
            23: {
                "u": 9,
                "v": 10,
                "w": 1
            },
            24: {
                "u": 10,
                "v": 5,
                "w": 1
            },
            25: {
                "u": 10,
                "v": 9,
                "w": 1
            },
            26: {
                "u": 10,
                "v": 11,
                "w": 1
            },
            27: {
                "u": 11,
                "v": 6,
                "w": 1
            },
            28: {
                "u": 11,
                "v": 10,
                "w": 1
            },
            29: {
                "u": 11,
                "v": 12,
                "w": 1
            },
            30: {
                "u": 12,
                "v": 7,
                "w": 1
            },
            31: {
                "u": 12,
                "v": 11,
                "w": 1
            }
        };
    } else if (id == CP3_4_4) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25
            },
            1: {
                "x": 400,
                "y": 25
            },
            2: {
                "x": 400,
                "y": 125
            },
            3: {
                "x": 500,
                "y": 25
            },
            4: {
                "x": 600,
                "y": 25
            },
            5: {
                "x": 700,
                "y": 25
            },
            6: {
                "x": 500,
                "y": 125
            },
            7: {
                "x": 600,
                "y": 125
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            3: {
                "u": 1,
                "v": 3,
                "w": 1
            },
            4: {
                "u": 2,
                "v": 3,
                "w": 1
            },
            5: {
                "u": 2,
                "v": 5,
                "w": 1
            },
            6: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            7: {
                "u": 7,
                "v": 6,
                "w": 1
            },
        };
    } else if (id == CP3_4_9) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25
            },
            1: {
                "x": 400,
                "y": 25
            },
            2: {
                "x": 400,
                "y": 125
            },
            3: {
                "x": 500,
                "y": 25
            },
            4: {
                "x": 600,
                "y": 25
            },
            5: {
                "x": 700,
                "y": 25
            },
            6: {
                "x": 600,
                "y": 125
            },
            7: {
                "x": 700,
                "y": 125
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 3,
                "w": 1
            },
            2: {
                "u": 3,
                "v": 2,
                "w": 1
            },
            3: {
                "u": 2,
                "v": 1,
                "w": 1
            },
            4: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            5: {
                "u": 4,
                "v": 5,
                "w": 1
            },
            6: {
                "u": 5,
                "v": 7,
                "w": 1
            },
            7: {
                "u": 7,
                "v": 6,
                "w": 1
            },
            8: {
                "u": 6,
                "v": 4,
                "w": 1
            }
        };
    } else if (id == CP3_4_10) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 125
            },
            1: {
                "x": 400,
                "y": 25
            },
            2: {
                "x": 500,
                "y": 125
            },
            3: {
                "x": 400,
                "y": 225
            },
            4: {
                "x": 300,
                "y": 325
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 4
            },
            1: {
                "u": 2,
                "v": 0,
                "w": 4
            }, // purposely make a cycle
            2: {
                "u": 0,
                "v": 3,
                "w": 6
            },
            3: {
                "u": 0,
                "v": 4,
                "w": 6
            },
            4: {
                "u": 1,
                "v": 2,
                "w": 2
            },
            5: {
                "u": 2,
                "v": 3,
                "w": 8
            },
            6: {
                "u": 3,
                "v": 4,
                "w": 9
            }
        };
    } else if (id == CP3_4_14) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25
            },
            1: {
                "x": 450,
                "y": 175
            },
            2: {
                "x": 450,
                "y": 25
            },
            3: {
                "x": 600,
                "y": 175
            },
            4: {
                "x": 450,
                "y": 325
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 9
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 75
            },
            2: {
                "u": 1,
                "v": 2,
                "w": 95
            },
            3: {
                "u": 3,
                "v": 1,
                "w": 19
            }, // purposely make a cycle
            4: {
                "u": 1,
                "v": 4,
                "w": 42
            },
            5: {
                "u": 2,
                "v": 3,
                "w": 51
            },
            6: {
                "u": 4,
                "v": 3,
                "w": 31
            } // purposely make another cycle
        };
    } else if (id == CP3_4_17) {
        if (mode == VL) return {
            0: {
                "x": 415,
                "y": 105
            },
            1: {
                "x": 300,
                "y": 25
            },
            2: {
                "x": 455,
                "y": 180
            },
            3: {
                "x": 590,
                "y": 25
            },
            4: {
                "x": 470,
                "y": 275
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 1,
                "v": 4,
                "w": 6
            },
            1: {
                "u": 1,
                "v": 3,
                "w": 3
            },
            2: {
                "u": 0,
                "v": 1,
                "w": 2
            },
            3: {
                "u": 2,
                "v": 4,
                "w": 1
            },
            4: {
                "u": 0,
                "v": 2,
                "w": 6
            },
            5: {
                "u": 3,
                "v": 4,
                "w": 5
            },
            6: {
                "u": 0,
                "v": 3,
                "w": 7
            },
            7: {
                "u": 2,
                "v": 0,
                "w": 1
            }
        };
    } else if (id == CP3_4_18) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 100
            },
            1: {
                "x": 400,
                "y": 25
            },
            2: {
                "x": 400,
                "y": 175
            },
            3: {
                "x": 500,
                "y": 100
            },
            4: {
                "x": 600,
                "y": 100
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 3,
                "w": 2
            },
            2: {
                "u": 3,
                "v": 4,
                "w": 3
            },
            3: {
                "u": 0,
                "v": 2,
                "w": 10
            },
            4: {
                "u": 2,
                "v": 3,
                "w": -10
            }
        };
    } else if (id == CP3_4_19) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25
            },
            1: {
                "x": 400,
                "y": 25
            },
            2: {
                "x": 500,
                "y": 25
            },
            3: {
                "x": 600,
                "y": 25
            },
            4: {
                "x": 400,
                "y": 100
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 99
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 15
            },
            2: {
                "u": 2,
                "v": 1,
                "w": -42
            },
            3: {
                "u": 2,
                "v": 3,
                "w": 10
            },
            4: {
                "u": 0,
                "v": 4,
                "w": -99
            },
        };
    } else if (id == CP3_4_24) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 125
            },
            1: {
                "x": 400,
                "y": 25
            },
            2: {
                "x": 400,
                "y": 225
            },
            3: {
                "x": 500,
                "y": 125
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 4
            },
            1: {
                "u": 1,
                "v": 3,
                "w": 8
            },
            2: {
                "u": 0,
                "v": 2,
                "w": 8
            },
            3: {
                "u": 2,
                "v": 3,
                "w": 3
            },
            4: {
                "u": 2,
                "v": 1,
                "w": 1
            },
            5: {
                "u": 1,
                "v": 2,
                "w": 1
            }
        };
    } else if (id == CP3_4_26_1) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 125
            },
            1: {
                "x": 500,
                "y": 225
            },
            2: {
                "x": 400,
                "y": 25
            },
            3: {
                "x": 400,
                "y": 225
            },
            4: {
                "x": 600,
                "y": 125
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 2,
                "w": 5
            },
            1: {
                "u": 0,
                "v": 3,
                "w": 3
            },
            2: {
                "u": 2,
                "v": 3,
                "w": 3
            },
            3: {
                "u": 3,
                "v": 1,
                "w": 5
            },
            4: {
                "u": 2,
                "v": 1,
                "w": 3
            },
            5: {
                "u": 2,
                "v": 4,
                "w": 3
            },
            6: {
                "u": 1,
                "v": 4,
                "w": 7
            }
        };
    } else if (id == CP3_4_26_2) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 125
            },
            1: {
                "x": 500,
                "y": 225
            },
            2: {
                "x": 400,
                "y": 25
            },
            3: {
                "x": 400,
                "y": 225
            },
            4: {
                "x": 600,
                "y": 125
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 2,
                "w": 5
            },
            1: {
                "u": 0,
                "v": 3,
                "w": 3
            },
            2: {
                "u": 2,
                "v": 3,
                "w": 3
            },
            3: {
                "u": 3,
                "v": 1,
                "w": 5
            },
            4: {
                "u": 2,
                "v": 1,
                "w": 3
            },
            5: {
                "u": 2,
                "v": 4,
                "w": 3
            },
            6: {
                "u": 1,
                "v": 4,
                "w": 4
            }
        };
    } else if (id == CP3_4_26_3) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 125
            },
            1: {
                "x": 500,
                "y": 225
            },
            2: {
                "x": 400,
                "y": 25
            },
            3: {
                "x": 400,
                "y": 225
            },
            4: {
                "x": 600,
                "y": 125
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 2,
                "w": 5
            },
            1: {
                "u": 0,
                "v": 3,
                "w": 3
            },
            2: {
                "u": 3,
                "v": 1,
                "w": 5
            },
            3: {
                "u": 2,
                "v": 1,
                "w": 2
            },
            4: {
                "u": 2,
                "v": 4,
                "w": 2
            },
            5: {
                "u": 1,
                "v": 4,
                "w": 7
            }
        };
    } else if (id == CP3_4_40) {
        if (mode == VL) return {
            0: {
                "x": 400,
                "y": 25
            },
            1: {
                "x": 500,
                "y": 100
            },
            2: {
                "x": 500,
                "y": 250
            },
            3: {
                "x": 400,
                "y": 175
            },
            4: {
                "x": 300,
                "y": 250
            },
            5: {
                "x": 300,
                "y": 100
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 2
            },
            1: {
                "u": 0,
                "v": 5,
                "w": 4
            },
            2: {
                "u": 1,
                "v": 0,
                "w": 2
            },
            3: {
                "u": 1,
                "v": 3,
                "w": 9
            },
            4: {
                "u": 2,
                "v": 3,
                "w": 5
            },
            5: {
                "u": 3,
                "v": 1,
                "w": 9
            },
            6: {
                "u": 3,
                "v": 2,
                "w": 5
            },
            7: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            8: {
                "u": 4,
                "v": 3,
                "w": 1
            },
            9: {
                "u": 5,
                "v": 0,
                "w": 4
            },
        };
    } else if (id == K5) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 125
            },
            1: {
                "x": 640,
                "y": 125
            },
            2: {
                "x": 370,
                "y": 315
            },
            3: {
                "x": 470,
                "y": 25
            },
            4: {
                "x": 570,
                "y": 315
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 28
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 13
            },
            2: {
                "u": 0,
                "v": 3,
                "w": 13
            },
            3: {
                "u": 0,
                "v": 4,
                "w": 22
            },
            4: {
                "u": 1,
                "v": 2,
                "w": 27
            },
            5: {
                "u": 1,
                "v": 3,
                "w": 13
            },
            6: {
                "u": 1,
                "v": 4,
                "w": 13
            },
            7: {
                "u": 2,
                "v": 3,
                "w": 19
            },
            8: {
                "u": 2,
                "v": 4,
                "w": 14
            },
            9: {
                "u": 3,
                "v": 4,
                "w": 19
            }
        };
    } else if (id == RAIL) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25
            },
            1: {
                "x": 400,
                "y": 25
            },
            2: {
                "x": 500,
                "y": 25
            },
            3: {
                "x": 600,
                "y": 25
            },
            4: {
                "x": 700,
                "y": 25
            },
            5: {
                "x": 300,
                "y": 125
            },
            6: {
                "x": 400,
                "y": 125
            },
            7: {
                "x": 500,
                "y": 125
            },
            8: {
                "x": 600,
                "y": 125
            },
            9: {
                "x": 700,
                "y": 125
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 10
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 10
            },
            2: {
                "u": 1,
                "v": 6,
                "w": 8
            },
            3: {
                "u": 1,
                "v": 7,
                "w": 13
            },
            4: {
                "u": 2,
                "v": 3,
                "w": 10
            },
            5: {
                "u": 2,
                "v": 7,
                "w": 8
            },
            6: {
                "u": 2,
                "v": 8,
                "w": 13
            },
            7: {
                "u": 3,
                "v": 4,
                "w": 10
            },
            8: {
                "u": 3,
                "v": 8,
                "w": 8
            },
            9: {
                "u": 5,
                "v": 6,
                "w": 10
            },
            10: {
                "u": 6,
                "v": 7,
                "w": 10
            },
            11: {
                "u": 7,
                "v": 8,
                "w": 10
            },
            12: {
                "u": 8,
                "v": 9,
                "w": 10
            }
        };
    } else if (id == TESSELLATION) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25
            },
            1: {
                "x": 300,
                "y": 145
            },
            2: {
                "x": 450,
                "y": 85
            },
            3: {
                "x": 600,
                "y": 145
            },
            4: {
                "x": 375,
                "y": 265
            },
            5: {
                "x": 600,
                "y": 265
            },
            6: {
                "x": 700,
                "y": 25
            },
            7: {
                "x": 740,
                "y": 215
            },
            8: {
                "x": 800,
                "y": 95
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 8
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 12
            },
            2: {
                "u": 1,
                "v": 2,
                "w": 13
            },
            3: {
                "u": 1,
                "v": 3,
                "w": 25
            },
            4: {
                "u": 4,
                "v": 1,
                "w": 9
            }, // purposely make a cycle
            5: {
                "u": 2,
                "v": 3,
                "w": 14
            },
            6: {
                "u": 2,
                "v": 6,
                "w": 21
            },
            7: {
                "u": 3,
                "v": 4,
                "w": 20
            },
            8: {
                "u": 3,
                "v": 5,
                "w": 8
            },
            9: {
                "u": 3,
                "v": 6,
                "w": 12
            },
            10: {
                "u": 3,
                "v": 7,
                "w": 12
            },
            11: {
                "u": 3,
                "v": 8,
                "w": 16
            },
            12: {
                "u": 4,
                "v": 5,
                "w": 19
            },
            13: {
                "u": 5,
                "v": 7,
                "w": 11
            },
            14: {
                "u": 6,
                "v": 8,
                "w": 11
            },
            15: {
                "u": 7,
                "v": 8,
                "w": 9
            }
        };
    } else if (id == BELLMANFORD_KILLER) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25
            },
            1: {
                "x": 375,
                "y": 25
            },
            2: {
                "x": 450,
                "y": 25
            },
            3: {
                "x": 525,
                "y": 25
            },
            4: {
                "x": 600,
                "y": 25
            },
            5: {
                "x": 675,
                "y": 25
            },
            6: {
                "x": 750,
                "y": 25
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 5,
                "v": 6,
                "w": 1
            },
            1: {
                "u": 4,
                "v": 5,
                "w": 2
            },
            2: {
                "u": 3,
                "v": 4,
                "w": 3
            },
            3: {
                "u": 2,
                "v": 3,
                "w": 4
            },
            4: {
                "u": 1,
                "v": 2,
                "w": 5
            },
            5: {
                "u": 0,
                "v": 1,
                "w": 6
            }
        };
    } else if (id == DIJKSTRA_KILLER) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 125
            },
            1: {
                "x": 350,
                "y": 25
            },
            2: {
                "x": 400,
                "y": 125
            },
            3: {
                "x": 450,
                "y": 25
            },
            4: {
                "x": 500,
                "y": 125
            },
            5: {
                "x": 550,
                "y": 25
            },
            6: {
                "x": 600,
                "y": 125
            },
            7: {
                "x": 650,
                "y": 25
            },
            8: {
                "x": 700,
                "y": 125
            },
            9: {
                "x": 750,
                "y": 25
            },
            10: {
                "x": 800,
                "y": 125
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 1,
                "v": 2,
                "w": -32
            },
            1: {
                "u": 3,
                "v": 4,
                "w": -16
            },
            2: {
                "u": 5,
                "v": 6,
                "w": -8
            },
            3: {
                "u": 7,
                "v": 8,
                "w": -4
            },
            4: {
                "u": 9,
                "v": 10,
                "w": -2
            },
            5: {
                "u": 0,
                "v": 2,
                "w": 0
            },
            6: {
                "u": 2,
                "v": 4,
                "w": 0
            },
            7: {
                "u": 4,
                "v": 6,
                "w": 0
            },
            8: {
                "u": 6,
                "v": 8,
                "w": 0
            },
            9: {
                "u": 8,
                "v": 10,
                "w": 0
            },
            10: {
                "u": 8,
                "v": 9,
                "w": 1
            },
            11: {
                "u": 6,
                "v": 7,
                "w": 2
            },
            12: {
                "u": 4,
                "v": 5,
                "w": 4
            },
            13: {
                "u": 2,
                "v": 3,
                "w": 8
            },
            14: {
                "u": 0,
                "v": 1,
                "w": 16
            }
        };
    } else if (id == DAG) {
        if (mode == VL) return {
            0: {
                "x": 380,
                "y": 95
            },
            1: {
                "x": 500,
                "y": 25
            },
            2: {
                "x": 300,
                "y": 225
            },
            3: {
                "x": 600,
                "y": 95
            },
            4: {
                "x": 600,
                "y": 225
            },
            5: {
                "x": 700,
                "y": 25
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 7
            },
            2: {
                "u": 1,
                "v": 3,
                "w": 9
            },
            3: {
                "u": 1,
                "v": 5,
                "w": 15
            },
            4: {
                "u": 2,
                "v": 4,
                "w": 4
            },
            5: {
                "u": 3,
                "v": 4,
                "w": 10
            },
            6: {
                "u": 3,
                "v": 5,
                "w": 5
            },
            7: {
                "u": 4,
                "v": 5,
                "w": 3
            }
        };
    } else if (id == FORDFULKERSON_KILLER) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 125
            },
            1: {
                "x": 400,
                "y": 225
            },
            2: {
                "x": 400,
                "y": 25
            },
            3: {
                "x": 500,
                "y": 125
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 8
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 8
            },
            2: {
                "u": 1,
                "v": 3,
                "w": 8
            },
            3: {
                "u": 2,
                "v": 3,
                "w": 8
            },
            4: {
                "u": 2,
                "v": 1,
                "w": 1
            }
        };
    } else if (id == DINIC_SHOWCASE) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 125
            },
            1: {
                "x": 500,
                "y": 25
            },
            2: {
                "x": 500,
                "y": 75
            },
            3: {
                "x": 450,
                "y": 175
            },
            4: {
                "x": 450,
                "y": 225
            },
            5: {
                "x": 450,
                "y": 275
            },
            6: {
                "x": 550,
                "y": 175
            },
            7: {
                "x": 550,
                "y": 225
            },
            8: {
                "x": 550,
                "y": 275
            },
            9: {
                "x": 700,
                "y": 125
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 9,
                "w": 7
            },
            1: {
                "u": 0,
                "v": 1,
                "w": 5
            },
            2: {
                "u": 1,
                "v": 9,
                "w": 4
            },
            3: {
                "u": 0,
                "v": 2,
                "w": 8
            },
            4: {
                "u": 2,
                "v": 9,
                "w": 9
            },
            5: {
                "u": 0,
                "v": 3,
                "w": 3
            },
            6: {
                "u": 3,
                "v": 6,
                "w": 1
            },
            7: {
                "u": 6,
                "v": 9,
                "w": 1
            },
            8: {
                "u": 0,
                "v": 4,
                "w": 5
            },
            9: {
                "u": 4,
                "v": 7,
                "w": 4
            },
            10: {
                "u": 7,
                "v": 9,
                "w": 6
            },
            11: {
                "u": 0,
                "v": 5,
                "w": 7
            },
            12: {
                "u": 5,
                "v": 8,
                "w": 6
            },
            13: {
                "u": 8,
                "v": 9,
                "w": 5
            },
            14: {
                "u": 5,
                "v": 7,
                "w": 2
            },
            15: {
                "u": 5,
                "v": 6,
                "w": 1
            }
        };
    } else if (id == MVC_U_TWO_APPROX_KILLER) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25,
                "w": 2
            },
            1: {
                "x": 300,
                "y": 125,
                "w": 3
            },
            2: {
                "x": 300,
                "y": 225,
                "w": 4
            },
            3: {
                "x": 300,
                "y": 325,
                "w": 7
            },
            4: {
                "x": 400,
                "y": 25,
                "w": 1
            },
            5: {
                "x": 400,
                "y": 125,
                "w": 5
            },
            6: {
                "x": 400,
                "y": 225,
                "w": 6
            },
            7: {
                "x": 400,
                "y": 325,
                "w": 9
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 4,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 5,
                "w": 1
            },
            2: {
                "u": 2,
                "v": 6,
                "w": 1
            },
            3: {
                "u": 3,
                "v": 7,
                "w": 1
            },
        };
    } else if (id == EXAMPLE_VERTEX_WEIGHTED_TREE) {
        if (mode == VL) return {
            0: {
                "x": 400,
                "y": 25,
                "w": 2
            },
            1: {
                "x": 300,
                "y": 100,
                "w": 9
            },
            2: {
                "x": 350,
                "y": 100,
                "w": 9
            },
            3: {
                "x": 450,
                "y": 100,
                "w": 9
            },
            4: {
                "x": 300,
                "y": 175,
                "w": 1
            },
            5: {
                "x": 350,
                "y": 175,
                "w": 1
            },
            6: {
                "x": 400,
                "y": 175,
                "w": 1
            },
            7: {
                "x": 500,
                "y": 175,
                "w": 1
            },
            8: {
                "x": 450,
                "y": 250,
                "w": 3
            },
            9: {
                "x": 500,
                "y": 250,
                "w": 2
            },
            10: {
                "x": 550,
                "y": 250,
                "w": 4
            },
            11: {
                "x": 500,
                "y": 325,
                "w": 5
            },
            12: {
                "x": 600,
                "y": 325,
                "w": 1
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 0,
                "v": 3,
                "w": 1
            },
            3: {
                "u": 1,
                "v": 4,
                "w": 1
            },
            4: {
                "u": 2,
                "v": 5,
                "w": 1
            },
            5: {
                "u": 3,
                "v": 6,
                "w": 1
            },
            6: {
                "u": 3,
                "v": 7,
                "w": 1
            },
            7: {
                "u": 7,
                "v": 8,
                "w": 1
            },
            8: {
                "u": 7,
                "v": 9,
                "w": 1
            },
            9: {
                "u": 7,
                "v": 10,
                "w": 1
            },
            10: {
                "u": 10,
                "v": 11,
                "w": 1
            },
            11: {
                "u": 10,
                "v": 12,
                "w": 1
            }
        };
    } else if (id == MVC_W_TWO_APPROX_KILLER) {
        if (mode == VL) return {
            0: {
                "x": 400,
                "y": 25,
                "w": 5
            },
            1: {
                "x": 300,
                "y": 125,
                "w": 1
            },
            2: {
                "x": 350,
                "y": 125,
                "w": 2
            },
            3: {
                "x": 400,
                "y": 125,
                "w": 2
            },
            4: {
                "x": 450,
                "y": 125,
                "w": 3
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1
            },
            1: {
                "u": 0,
                "v": 2
            },
            2: {
                "u": 0,
                "v": 3
            },
            3: {
                "u": 0,
                "v": 4
            },
        };
    } else if (id == INTERESTING_BIPARTITE) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25,
                "w": 2
            },
            1: {
                "x": 300,
                "y": 125,
                "w": 3
            },
            2: {
                "x": 300,
                "y": 225,
                "w": 4
            },
            3: {
                "x": 400,
                "y": 25,
                "w": 7
            },
            4: {
                "x": 400,
                "y": 125,
                "w": 1
            },
            5: {
                "x": 400,
                "y": 225,
                "w": 5
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 3,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 4,
                "w": 1
            },
            2: {
                "u": 2,
                "v": 5,
                "w": 1
            },
            3: {
                "u": 1,
                "v": 5,
                "w": 1
            },
            4: {
                "u": 0,
                "v": 5,
                "w": 1
            },
        };
    } else if (id == LINEAR_CHAIN) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25,
                "w": 3
            },
            1: {
                "x": 375,
                "y": 25,
                "w": 1
            },
            2: {
                "x": 450,
                "y": 25,
                "w": 4
            },
            3: {
                "x": 525,
                "y": 25,
                "w": 2
            },
            4: {
                "x": 600,
                "y": 25,
                "w": 9
            },
            5: {
                "x": 675,
                "y": 25,
                "w": 1
            },
            6: {
                "x": 750,
                "y": 25,
                "w": 2
            },
            7: {
                "x": 825,
                "y": 25,
                "w": 9
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 3
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 2,
                "v": 3,
                "w": 2
            },
            3: {
                "u": 3,
                "v": 4,
                "w": 4
            },
            4: {
                "u": 4,
                "v": 5,
                "w": 5
            },
            5: {
                "u": 5,
                "v": 6,
                "w": 9
            },
            6: {
                "u": 6,
                "v": 7,
                "w": 8
            },
        };
    } else if (id == CS4234_SAMPLE) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25,
                "w": 1
            },
            1: {
                "x": 400,
                "y": 25,
                "w": 1
            },
            2: {
                "x": 500,
                "y": 25,
                "w": 1
            },
            3: {
                "x": 600,
                "y": 25,
                "w": 1
            },
            4: {
                "x": 400,
                "y": 125,
                "w": 1
            },
            5: {
                "x": 500,
                "y": 125,
                "w": 1
            },
            6: {
                "x": 600,
                "y": 125,
                "w": 1
            },
            7: {
                "x": 600,
                "y": 225,
                "w": 1
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 1,
                "v": 4,
                "w": 1
            },
            3: {
                "u": 2,
                "v": 3,
                "w": 1
            },
            4: {
                "u": 2,
                "v": 5,
                "w": 1
            },
            5: {
                "u": 3,
                "v": 6,
                "w": 1
            },
            6: {
                "u": 4,
                "v": 5,
                "w": 1
            },
            7: {
                "u": 5,
                "v": 6,
                "w": 1
            },
            8: {
                "u": 6,
                "v": 7,
                "w": 1
            },
            9: {
                "u": 1,
                "v": 5,
                "w": 1
            },
        };
    } else if (id == K8) {
        if (mode == VL) return {
            0: {
                "x": 400,
                "y": 25
            },
            1: {
                "x": 600,
                "y": 25
            },
            2: {
                "x": 700,
                "y": 175
            },
            3: {
                "x": 700,
                "y": 325
            },
            4: {
                "x": 600,
                "y": 475
            },
            5: {
                "x": 400,
                "y": 475
            },
            6: {
                "x": 300,
                "y": 325
            },
            7: {
                "x": 300,
                "y": 175
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 13
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 13
            },
            2: {
                "u": 0,
                "v": 3,
                "w": 12
            },
            3: {
                "u": 0,
                "v": 4,
                "w": 12
            },
            4: {
                "u": 0,
                "v": 5,
                "w": 13
            },
            5: {
                "u": 0,
                "v": 6,
                "w": 14
            },
            6: {
                "u": 0,
                "v": 7,
                "w": 12
            },
            7: {
                "u": 1,
                "v": 2,
                "w": 14
            },
            8: {
                "u": 1,
                "v": 3,
                "w": 14
            },
            9: {
                "u": 1,
                "v": 4,
                "w": 13
            },
            10: {
                "u": 1,
                "v": 5,
                "w": 14
            },
            11: {
                "u": 1,
                "v": 6,
                "w": 13
            },
            12: {
                "u": 1,
                "v": 7,
                "w": 12
            },
            13: {
                "u": 2,
                "v": 3,
                "w": 13
            },
            14: {
                "u": 2,
                "v": 4,
                "w": 13
            },
            15: {
                "u": 2,
                "v": 5,
                "w": 12
            },
            16: {
                "u": 2,
                "v": 6,
                "w": 12
            },
            17: {
                "u": 2,
                "v": 7,
                "w": 12
            },
            18: {
                "u": 3,
                "v": 4,
                "w": 13
            },
            19: {
                "u": 3,
                "v": 5,
                "w": 13
            },
            20: {
                "u": 3,
                "v": 6,
                "w": 13
            },
            21: {
                "u": 3,
                "v": 7,
                "w": 13
            },
            22: {
                "u": 4,
                "v": 5,
                "w": 13
            },
            23: {
                "u": 4,
                "v": 6,
                "w": 12
            },
            24: {
                "u": 4,
                "v": 7,
                "w": 13
            },
            25: {
                "u": 5,
                "v": 6,
                "w": 12
            },
            26: {
                "u": 5,
                "v": 7,
                "w": 12
            },
            27: {
                "u": 6,
                "v": 7,
                "w": 12
            }
        };
    } else if (id == CS4234_TUTORIAL_THREE) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 325
            },
            1: {
                "x": 580,
                "y": 325
            },
            2: {
                "x": 580,
                "y": 145
            },
            3: {
                "x": 480,
                "y": 85
            },
            4: {
                "x": 360,
                "y": 85
            },
            5: {
                "x": 600,
                "y": 25
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 1,
                "v": 0,
                "w": 28
            },
            1: {
                "u": 2,
                "v": 0,
                "w": 33
            },
            2: {
                "u": 3,
                "v": 0,
                "w": 30
            },
            3: {
                "u": 4,
                "v": 0,
                "w": 25
            },
            4: {
                "u": 0,
                "v": 5,
                "w": 42
            },
            5: {
                "u": 2,
                "v": 1,
                "w": 18
            },
            6: {
                "u": 3,
                "v": 1,
                "w": 26
            },
            7: {
                "u": 4,
                "v": 1,
                "w": 33
            },
            8: {
                "u": 5,
                "v": 1,
                "w": 30
            },
            9: {
                "u": 3,
                "v": 2,
                "w": 12
            },
            10: {
                "u": 4,
                "v": 2,
                "w": 23
            },
            11: {
                "u": 5,
                "v": 2,
                "w": 12
            },
            12: {
                "u": 4,
                "v": 3,
                "w": 12
            },
            13: {
                "u": 5,
                "v": 3,
                "w": 13
            },
            14: {
                "u": 5,
                "v": 4,
                "w": 25
            }
        }
    } else if (id == WHEEL) {
        if (mode == VL) return {
            0: {
                "x": 500,
                "y": 125
            },
            1: {
                "x": 400,
                "y": 225
            },
            2: {
                "x": 300,
                "y": 125
            },
            3: {
                "x": 400,
                "y": 25
            },
            4: {
                "x": 400,
                "y": 125
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 14
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 14
            },
            2: {
                "u": 2,
                "v": 3,
                "w": 14
            },
            3: {
                "u": 3,
                "v": 0,
                "w": 14
            },
            4: {
                "u": 4,
                "v": 2,
                "w": 10
            },
            5: {
                "u": 4,
                "v": 3,
                "w": 10
            },
            6: {
                "u": 4,
                "v": 0,
                "w": 10
            },
            7: {
                "u": 4,
                "v": 1,
                "w": 10
            },
        };
    } else if (id == CS4234_STEINER_SAMPLE_1) {
        if (mode == VL) return {
            0: {
                "x": 500,
                "y": 125
            },
            1: {
                "x": 400,
                "y": 225
            },
            2: {
                "x": 300,
                "y": 125
            },
            3: {
                "x": 400,
                "y": 25
            },
            4: {
                "x": 200,
                "y": 125
            },
            5: {
                "x": 400,
                "y": 125
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 14
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 14
            },
            2: {
                "u": 2,
                "v": 3,
                "w": 14
            },
            3: {
                "u": 3,
                "v": 0,
                "w": 14
            },
            4: {
                "u": 4,
                "v": 2,
                "w": 10
            },
            5: {
                "u": 5,
                "v": 0,
                "w": 10
            },
            6: {
                "u": 5,
                "v": 1,
                "w": 10
            },
            7: {
                "u": 5,
                "v": 2,
                "w": 10
            },
            8: {
                "u": 5,
                "v": 3,
                "w": 10
            },
        };
    } else if (id == CS4234_STEINER_SAMPLE_2) {
        if (mode == VL) return {
            0: {
                "x": 500,
                "y": 125
            },
            1: {
                "x": 400,
                "y": 225
            },
            2: {
                "x": 300,
                "y": 125
            },
            3: {
                "x": 400,
                "y": 25
            },
            4: {
                "x": 200,
                "y": 125
            },
            5: {
                "x": 375,
                "y": 100
            },
            6: {
                "x": 425,
                "y": 150
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 6,
                "v": 0,
                "w": 8
            },
            1: {
                "u": 6,
                "v": 1,
                "w": 8
            },
            2: {
                "u": 5,
                "v": 2,
                "w": 8
            },
            3: {
                "u": 5,
                "v": 3,
                "w": 8
            },
            4: {
                "u": 0,
                "v": 1,
                "w": 14
            },
            5: {
                "u": 1,
                "v": 2,
                "w": 14
            },
            6: {
                "u": 2,
                "v": 3,
                "w": 14
            },
            7: {
                "u": 3,
                "v": 0,
                "w": 14
            },
            8: {
                "u": 4,
                "v": 2,
                "w": 10
            },
            9: {
                "u": 5,
                "v": 6,
                "w": 6
            },
        };
    } else if (id == K4) {
        if (mode == VL) return {
            0: {
                "x": 400,
                "y": 25
            },
            1: {
                "x": 300,
                "y": 225
            },
            2: {
                "x": 500,
                "y": 225
            },
            3: {
                "x": 400,
                "y": 165
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 1,
                "v": 2,
                "w": 99
            },
            1: {
                "u": 1,
                "v": 3,
                "w": 13
            },
            2: {
                "u": 1,
                "v": 0,
                "w": 99
            },
            3: {
                "u": 2,
                "v": 3,
                "w": 13
            },
            4: {
                "u": 2,
                "v": 0,
                "w": 99
            },
            5: {
                "u": 3,
                "v": 0,
                "w": 13
            },
        };
    } else if (id == HOUSE_OF_CARDS) {
        if (mode == VL) return {
            0: {
                "x": 450,
                "y": 25
            },
            1: {
                "x": 400,
                "y": 105
            },
            2: {
                "x": 500,
                "y": 105
            },
            3: {
                "x": 350,
                "y": 185
            },
            4: {
                "x": 450,
                "y": 185
            },
            5: {
                "x": 550,
                "y": 185
            },
            6: {
                "x": 300,
                "y": 265
            },
            7: {
                "x": 400,
                "y": 265
            },
            8: {
                "x": 500,
                "y": 265
            },
            9: {
                "x": 600,
                "y": 265
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 3,
                "w": 1
            },
            2: {
                "u": 3,
                "v": 6,
                "w": 1
            },
            3: {
                "u": 6,
                "v": 7,
                "w": 1
            },
            4: {
                "u": 7,
                "v": 8,
                "w": 1
            },
            5: {
                "u": 8,
                "v": 9,
                "w": 1
            },
            6: {
                "v": 5,
                "u": 9,
                "w": 1
            },
            7: {
                "v": 4,
                "u": 5,
                "w": 1
            },
            8: {
                "v": 3,
                "u": 4,
                "w": 1
            },
            9: {
                "v": 2,
                "u": 4,
                "w": 1
            },
            10: {
                "v": 1,
                "u": 2,
                "w": 1
            },
            11: {
                "u": 0,
                "v": 2,
                "w": 1
            },
            12: {
                "u": 2,
                "v": 5,
                "w": 1
            },
            13: {
                "u": 1,
                "v": 4,
                "w": 1
            },
            14: {
                "u": 4,
                "v": 7,
                "w": 1
            },
            15: {
                "u": 4,
                "v": 8,
                "w": 1
            },
            16: {
                "u": 3,
                "v": 7,
                "w": 1
            },
            17: {
                "u": 5,
                "v": 8,
                "w": 1
            }
        };
    } else if (id == FMOD) {
        if (mode == VL) return {
            7: {
                "x": 300,
                "y": 25
            },
            0: {
                "x": 420,
                "y": 25
            },
            1: {
                "x": 540,
                "y": 25
            },
            6: {
                "x": 420,
                "y": 125
            },
            2: {
                "x": 540,
                "y": 125
            },
            3: {
                "x": 660,
                "y": 125
            },
            4: {
                "x": 540,
                "y": 225
            },
            5: {
                "x": 660,
                "y": 225
            }
        };
        else if (mode == EL) return {
            0: {
                "v": 7,
                "u": 0,
                "w": 1
            },
            1: {
                "v": 0,
                "u": 1,
                "w": 1
            },
            2: {
                "v": 1,
                "u": 3,
                "w": 1
            },
            3: {
                "v": 3,
                "u": 2,
                "w": 1
            },
            4: {
                "u": 3,
                "v": 5,
                "w": 1
            },
            5: {
                "u": 2,
                "v": 1,
                "w": 1
            },
            6: {
                "u": 2,
                "v": 4,
                "w": 1
            },
            7: {
                "v": 4,
                "u": 5,
                "w": 1
            },
            8: {
                "u": 4,
                "v": 6,
                "w": 1
            },
            9: {
                "v": 6,
                "u": 0,
                "w": 1
            }
        };
    } else if (id == GREEDY_AUGMENTING_PATH_KILLER) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25,
                "w": 2
            },
            1: {
                "x": 300,
                "y": 75,
                "w": 3
            },
            2: {
                "x": 300,
                "y": 125,
                "w": 4
            },
            3: {
                "x": 300,
                "y": 175,
                "w": 2
            },
            4: {
                "x": 300,
                "y": 225,
                "w": 3
            },
            5: {
                "x": 300,
                "y": 275,
                "w": 4
            },
            6: {
                "x": 400,
                "y": 25,
                "w": 7
            },
            7: {
                "x": 400,
                "y": 75,
                "w": 1
            },
            8: {
                "x": 400,
                "y": 125,
                "w": 5
            },
            9: {
                "x": 400,
                "y": 175,
                "w": 5
            },
            10: {
                "x": 400,
                "y": 225,
                "w": 5
            },
            11: {
                "x": 400,
                "y": 275,
                "w": 5
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 6,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 7,
                "w": 1
            },
            2: {
                "u": 1,
                "v": 6,
                "w": 1
            },
            3: {
                "u": 2,
                "v": 8,
                "w": 1
            },
            4: {
                "u": 2,
                "v": 9,
                "w": 1
            },
            5: {
                "u": 3,
                "v": 8,
                "w": 1
            },
            6: {
                "u": 4,
                "v": 10,
                "w": 1
            },
            7: {
                "u": 4,
                "v": 11,
                "w": 1
            },
            8: {
                "u": 5,
                "v": 10,
                "w": 1
            },
        };
    } else if (id == K55) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25,
                "w": 2
            },
            1: {
                "x": 300,
                "y": 100,
                "w": 3
            },
            2: {
                "x": 300,
                "y": 175,
                "w": 4
            },
            3: {
                "x": 300,
                "y": 250,
                "w": 2
            },
            4: {
                "x": 300,
                "y": 325,
                "w": 3
            },
            5: {
                "x": 400,
                "y": 25,
                "w": 7
            },
            6: {
                "x": 400,
                "y": 100,
                "w": 1
            },
            7: {
                "x": 400,
                "y": 175,
                "w": 5
            },
            8: {
                "x": 400,
                "y": 250,
                "w": 5
            },
            9: {
                "x": 400,
                "y": 325,
                "w": 5
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 5,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 6,
                "w": 1
            },
            2: {
                "u": 0,
                "v": 7,
                "w": 1
            },
            3: {
                "u": 0,
                "v": 8,
                "w": 1
            },
            4: {
                "u": 0,
                "v": 9,
                "w": 1
            },
            5: {
                "u": 1,
                "v": 5,
                "w": 1
            },
            6: {
                "u": 1,
                "v": 6,
                "w": 1
            },
            7: {
                "u": 1,
                "v": 7,
                "w": 1
            },
            8: {
                "u": 1,
                "v": 8,
                "w": 1
            },
            9: {
                "u": 1,
                "v": 9,
                "w": 1
            },
            10: {
                "u": 2,
                "v": 5,
                "w": 1
            },
            11: {
                "u": 2,
                "v": 6,
                "w": 1
            },
            12: {
                "u": 2,
                "v": 7,
                "w": 1
            },
            13: {
                "u": 2,
                "v": 8,
                "w": 1
            },
            14: {
                "u": 2,
                "v": 9,
                "w": 1
            },
            15: {
                "u": 3,
                "v": 5,
                "w": 1
            },
            16: {
                "u": 3,
                "v": 6,
                "w": 1
            },
            17: {
                "u": 3,
                "v": 7,
                "w": 1
            },
            18: {
                "u": 3,
                "v": 8,
                "w": 1
            },
            19: {
                "u": 3,
                "v": 9,
                "w": 1
            },
            20: {
                "u": 4,
                "v": 5,
                "w": 1
            },
            21: {
                "u": 4,
                "v": 6,
                "w": 1
            },
            22: {
                "u": 4,
                "v": 7,
                "w": 1
            },
            23: {
                "u": 4,
                "v": 8,
                "w": 1
            },
            24: {
                "u": 4,
                "v": 9,
                "w": 1
            },
        };
    } else if (id == K55_ALMOST) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 25,
                "w": 2
            },
            1: {
                "x": 300,
                "y": 100,
                "w": 3
            },
            2: {
                "x": 300,
                "y": 175,
                "w": 4
            },
            3: {
                "x": 300,
                "y": 250,
                "w": 2
            },
            4: {
                "x": 300,
                "y": 325,
                "w": 3
            },
            5: {
                "x": 400,
                "y": 25,
                "w": 7
            },
            6: {
                "x": 400,
                "y": 100,
                "w": 1
            },
            7: {
                "x": 400,
                "y": 175,
                "w": 5
            },
            8: {
                "x": 400,
                "y": 250,
                "w": 5
            },
            9: {
                "x": 400,
                "y": 325,
                "w": 5
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 5,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 6,
                "w": 1
            },
            2: {
                "u": 0,
                "v": 8,
                "w": 1
            },
            3: {
                "u": 0,
                "v": 9,
                "w": 1
            },
            4: {
                "u": 1,
                "v": 6,
                "w": 1
            },
            5: {
                "u": 1,
                "v": 7,
                "w": 1
            },
            6: {
                "u": 1,
                "v": 8,
                "w": 1
            },
            7: {
                "u": 2,
                "v": 5,
                "w": 1
            },
            8: {
                "u": 2,
                "v": 6,
                "w": 1
            },
            9: {
                "u": 2,
                "v": 7,
                "w": 1
            },
            10: {
                "u": 2,
                "v": 8,
                "w": 1
            },
            11: {
                "u": 2,
                "v": 9,
                "w": 1
            },
            12: {
                "u": 3,
                "v": 5,
                "w": 1
            },
            13: {
                "u": 3,
                "v": 7,
                "w": 1
            },
            14: {
                "u": 3,
                "v": 8,
                "w": 1
            },
            15: {
                "u": 3,
                "v": 9,
                "w": 1
            },
            16: {
                "u": 4,
                "v": 5,
                "w": 1
            },
        };
    } else if (id == CP4_2_7) {
        if (mode == VL) return {
            0: {
                "x": 220,
                "y": 270
            },
            1: {
                "x": 120,
                "y": 180
            },
            2: {
                "x": 320,
                "y": 180
            },
            3: {
                "x": 120,
                "y": 90
            },
            4: {
                "x": 320,
                "y": 90
            },
            5: {
                "x": 520,
                "y": 90
            },
            6: {
                "x": 520,
                "y": 180
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 3,
                "v": 1,
                "w": 1
            },
            3: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            4: {
                "u": 4,
                "v": 2,
                "w": 1
            },
            5: {
                "u": 4,
                "v": 5,
                "w": 1
            },
            6: {
                "u": 5,
                "v": 6,
                "w": 1
            },
            7: {
                "u": 2,
                "v": 0,
                "w": 1
            },
        };
    } else if (id == CP4_4_3) {
        if (mode == VL) return {
            0: {
                "x": 100,
                "y": 100
            },
            1: {
                "x": 210,
                "y": 100
            },
            2: {
                "x": 210,
                "y": 210
            },
            3: {
                "x": 320,
                "y": 100
            },
            4: {
                "x": 430,
                "y": 100
            },
            5: {
                "x": 540,
                "y": 100
            },
            6: {
                "x": 430,
                "y": 210
            },
            7: {
                "x": 540,
                "y": 210
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            3: {
                "u": 7,
                "v": 6,
                "w": 1
            },
            4: {
                "u": 2,
                "v": 5,
                "w": 1
            },
            5: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            6: {
                "u": 1,
                "v": 3,
                "w": 1
            },
            7: {
                "u": 2,
                "v": 3,
                "w": 1
            },
        };
    } else if (id == CP4_4_7) {
        if (mode == VL) return {
            0: {
                "x": 100,
                "y": 100
            },
            1: {
                "x": 210,
                "y": 100
            },
            2: {
                "x": 210,
                "y": 210
            },
            3: {
                "x": 320,
                "y": 100
            },
            4: {
                "x": 430,
                "y": 100
            },
            5: {
                "x": 540,
                "y": 100
            },
            6: {
                "x": 430,
                "y": 210
            },
            7: {
                "x": 540,
                "y": 210
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 3,
                "w": 1
            },
            2: {
                "u": 3,
                "v": 2,
                "w": 1
            },
            3: {
                "u": 2,
                "v": 1,
                "w": 1
            },
            4: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            5: {
                "u": 4,
                "v": 5,
                "w": 1
            },
            6: {
                "u": 5,
                "v": 7,
                "w": 1
            },
            7: {
                "u": 7,
                "v": 6,
                "w": 1
            },
            8: {
                "u": 6,
                "v": 4,
                "w": 1
            }
        };
    } else if (id == CP4_4_8_C) {
        if (mode == VL) return {
            0: {
                "x": 100,
                "y": 75
            },
            1: {
                "x": 100,
                "y": 175
            },
            2: {
                "x": 100,
                "y": 275
            },
            3: {
                "x": 250,
                "y": 75
            },
            4: {
                "x": 250,
                "y": 175
            },
            5: {
                "x": 250,
                "y": 275
            },
            6: {
                "x": 400,
                "y": 75
            },
            7: {
                "x": 400,
                "y": 175
            },
            8: {
                "x": 400,
                "y": 275
            },
            9: {
                "x": 550,
                "y": 75
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 5,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 7,
                "w": 1
            },
            2: {
                "u": 1,
                "v": 6,
                "w": 1
            },
            3: {
                "u": 1,
                "v": 8,
                "w": 1
            },
            4: {
                "u": 2,
                "v": 3,
                "w": 1
            },
            5: {
                "u": 2,
                "v": 7,
                "w": 1
            },
            6: {
                "u": 3,
                "v": 8,
                "w": 1
            },
            7: {
                "u": 4,
                "v": 9,
                "w": 1
            },
            8: {
                "u": 5,
                "v": 6,
                "w": 1
            },
            9: {
                "u": 8,
                "v": 9,
                "w": 1
            }
        };
    } else if (id == CP4_4_8_D) {
        if (mode == VL) return {
            0: {
                "x": 200,
                "y": 50
            },
            1: {
                "x": 200,
                "y": 125
            },
            2: {
                "x": 400,
                "y": 50
            },
            3: {
                "x": 200,
                "y": 200
            },
            4: {
                "x": 400,
                "y": 275
            },
            5: {
                "x": 200,
                "y": 275
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 4,
                "w": 1
            },
            2: {
                "u": 2,
                "v": 3,
                "w": 1
            },
            3: {
                "u": 2,
                "v": 5,
                "w": 1
            },
            4: {
                "u": 3,
                "v": 4,
                "w": 1
            },
        };
    } else if (id == CP4_4_9) {
        if (mode == VL) return {
            0: {
                "x": 220,
                "y": 130
            },
            1: {
                "x": 320,
                "y": 30
            },
            2: {
                "x": 420,
                "y": 130
            },
            3: {
                "x": 320,
                "y": 230
            },
            4: {
                "x": 220,
                "y": 330
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 2,
                "v": 3,
                "w": 1
            },
            3: {
                "u": 3,
                "v": 0,
                "w": 1
            },
            4: {
                "u": 0,
                "v": 2,
                "w": 1
            },
            5: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            6: {
                "u": 4,
                "v": 0,
                "w": 1
            }
        };
    } else if (id == CP4_4_12) {
        if (mode == VL) return {
            0: {
                "x": 220,
                "y": 75
            },
            1: {
                "x": 420,
                "y": 75
            },
            2: {
                "x": 420,
                "y": 275
            },
            3: {
                "x": 220,
                "y": 275
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 25
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 13
            },
            2: {
                "u": 2,
                "v": 3,
                "w": 17
            },
            3: {
                "u": 3,
                "v": 0,
                "w": 10
            }
        };
    } else if (id == CP4_4_13) {
        if (mode == VL) return {
            0: {
                "x": 100,
                "y": 175
            },
            1: {
                "x": 200,
                "y": 75
            },
            2: {
                "x": 200,
                "y": 275
            },
            3: {
                "x": 300,
                "y": 175
            },
            4: {
                "x": 400,
                "y": 75
            },
            5: {
                "x": 400,
                "y": 275
            },
            6: {
                "x": 500,
                "y": 175
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 50
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 60
            },
            2: {
                "u": 2,
                "v": 5,
                "w": 50
            },
            3: {
                "u": 1,
                "v": 3,
                "w": 120
            },
            4: {
                "u": 1,
                "v": 4,
                "w": 90
            },
            5: {
                "u": 3,
                "v": 5,
                "w": 80
            },
            6: {
                "u": 3,
                "v": 6,
                "w": 70
            },
            7: {
                "u": 4,
                "v": 6,
                "w": 40
            },
            8: {
                "u": 5,
                "v": 6,
                "w": 140
            }
        };
    } else if (id == CP4_4_16) {
        if (mode == VL) return {
            0: {
                "x": 260,
                "y": 140
            },
            1: {
                "x": 160,
                "y": 75
            },
            2: {
                "x": 290,
                "y": 210
            },
            3: {
                "x": 420,
                "y": 75
            },
            4: {
                "x": 295,
                "y": 290
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 2
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 6
            },
            2: {
                "u": 0,
                "v": 3,
                "w": 7
            },
            3: {
                "u": 1,
                "v": 3,
                "w": 3
            },
            4: {
                "u": 1,
                "v": 4,
                "w": 6
            },
            5: {
                "u": 3,
                "v": 4,
                "w": 5
            },
            6: {
                "u": 2,
                "v": 4,
                "w": 1
            },
        };
    } else if (id == CP4_4_23) {
        if (mode == VL) return {
            0: {
                "x": 160,
                "y": 130
            },
            1: {
                "x": 320,
                "y": 50
            },
            2: {
                "x": 220,
                "y": 290
            },
            3: {
                "x": 480,
                "y": 130
            },
            4: {
                "x": 420,
                "y": 290
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 2
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 0,
                "v": 4,
                "w": 3
            },
            3: {
                "u": 1,
                "v": 3,
                "w": 4
            },
            4: {
                "u": 2,
                "v": 1,
                "w": 1
            },
            5: {
                "u": 2,
                "v": 4,
                "w": 1
            },
            6: {
                "u": 3,
                "v": 0,
                "w": 1
            },
            7: {
                "u": 3,
                "v": 2,
                "w": 3
            },
            8: {
                "u": 3,
                "v": 4,
                "w": 5
            }
        };
    } else if (id == CP4_4_28_A) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 80
            },
            1: {
                "x": 360,
                "y": 140
            },
            2: {
                "x": 360,
                "y": 260
            },
            3: {
                "x": 300,
                "y": 200
            },
            4: {
                "x": 240,
                "y": 260
            },
            5: {
                "x": 240,
                "y": 140
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 5,
                "v": 0,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            2: {
                "u": 3,
                "v": 1,
                "w": 1
            },
            3: {
                "u": 3,
                "v": 2,
                "w": 1
            },
            4: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            5: {
                "u": 4,
                "v": 2,
                "w": 1
            }
        };
    } else if (id == CP4_4_29) {
        if (mode == VL) return {
            0: {
                "x": 170,
                "y": 220
            },
            1: {
                "x": 270,
                "y": 100
            },
            2: {
                "x": 370,
                "y": 100
            },
            3: {
                "x": 300,
                "y": 220
            },
            4: {
                "x": 430,
                "y": 220
            },
            5: {
                "x": 490,
                "y": 100
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 3,
                "w": 1
            },
            2: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            3: {
                "u": 2,
                "v": 4,
                "w": 1
            },
            4: {
                "u": 2,
                "v": 5,
                "w": 1
            },
            5: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            6: {
                "u": 4,
                "v": 5,
                "w": 1
            }
        };
    } else if (id == CP4_4_36) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 80
            },
            1: {
                "x": 360,
                "y": 140
            },
            2: {
                "x": 360,
                "y": 260
            },
            3: {
                "x": 300,
                "y": 200
            },
            4: {
                "x": 240,
                "y": 260
            },
            5: {
                "x": 240,
                "y": 140
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 2
            },
            1: {
                "u": 0,
                "v": 5,
                "w": 4
            },
            2: {
                "u": 1,
                "v": 3,
                "w": 9
            },
            3: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            4: {
                "u": 3,
                "v": 2,
                "w": 5
            }
        };
    } else if (id == CP4_8_17_B) {
        if (mode == VL) return {
            0: {
                "x": 95,
                "y": 180
            },
            1: {
                "x": 245,
                "y": 100
            },
            2: {
                "x": 245,
                "y": 260
            },
            3: {
                "x": 395,
                "y": 260
            },
            4: {
                "x": 545,
                "y": 180
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 100
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 50
            },
            2: {
                "u": 1,
                "v": 2,
                "w": 50
            },
            3: {
                "u": 1,
                "v": 3,
                "w": 50
            },
            4: {
                "u": 1,
                "v": 4,
                "w": 50
            },
            5: {
                "u": 2,
                "v": 3,
                "w": 100
            },
            6: {
                "u": 3,
                "v": 4,
                "w": 75
            }
        };
    } else if (id == BIPARTITE) {
        if (mode == VL) return {
            0: {
                "x": 200,
                "y": 50
            },
            1: {
                "x": 200,
                "y": 110
            },
            2: {
                "x": 200,
                "y": 170
            },
            3: {
                "x": 200,
                "y": 230
            },
            4: {
                "x": 200,
                "y": 290
            },
            5: {
                "x": 400,
                "y": 50
            },
            6: {
                "x": 400,
                "y": 110
            },
            7: {
                "x": 400,
                "y": 170
            },
            8: {
                "x": 400,
                "y": 230
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 5,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 6,
                "w": 1
            },
            2: {
                "u": 1,
                "v": 5,
                "w": 1
            },
            3: {
                "u": 1,
                "v": 6,
                "w": 1
            },
            4: {
                "u": 2,
                "v": 7,
                "w": 1
            },
            5: {
                "u": 3,
                "v": 7,
                "w": 1
            },
            6: {
                "u": 4,
                "v": 7,
                "w": 1
            }
        };
    } else if (id == BIPARTITE2) {
        if (mode == VL) return {
            0: {
                "x": 200,
                "y": 50
            },
            1: {
                "x": 200,
                "y": 110
            },
            2: {
                "x": 200,
                "y": 170
            },
            3: {
                "x": 200,
                "y": 230
            },
            4: {
                "x": 200,
                "y": 290
            },
            5: {
                "x": 400,
                "y": 50
            },
            6: {
                "x": 400,
                "y": 130
            },
            7: {
                "x": 400,
                "y": 210
            },
            8: {
                "x": 400,
                "y": 290
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 5,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 6,
                "w": 1
            },
            2: {
                "u": 1,
                "v": 6,
                "w": 1
            },
            3: {
                "u": 1,
                "v": 7,
                "w": 1
            },
            4: {
                "u": 2,
                "v": 6,
                "w": 1
            },
            5: {
                "u": 2,
                "v": 7,
                "w": 1
            },
            6: {
                "u": 2,
                "v": 8,
                "w": 1
            },
            7: {
                "u": 3,
                "v": 7,
                "w": 1
            },
            8: {
                "u": 4,
                "v": 7,
                "w": 1
            }
        };
    } else if (id == TREE) {
        if (mode == VL) return {
            0: {
                "x": 320,
                "y": 50
            },
            1: {
                "x": 160,
                "y": 125
            },
            2: {
                "x": 70,
                "y": 200
            },
            3: {
                "x": 130,
                "y": 200
            },
            4: {
                "x": 110,
                "y": 275
            },
            5: {
                "x": 150,
                "y": 275
            },
            6: {
                "x": 190,
                "y": 200
            },
            7: {
                "x": 250,
                "y": 200
            },
            8: {
                "x": 480,
                "y": 125
            },
            9: {
                "x": 480,
                "y": 200
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 1,
                "v": 3,
                "w": 1
            },
            3: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            4: {
                "u": 3,
                "v": 5,
                "w": 1
            },
            5: {
                "u": 1,
                "v": 6,
                "w": 1
            },
            6: {
                "u": 1,
                "v": 7,
                "w": 1
            },
            7: {
                "u": 0,
                "v": 8,
                "w": 1
            },
            8: {
                "u": 8,
                "v": 9,
                "w": 1
            }
        };
    } else if (id == B_TREE) {
        if (mode == VL) return {
            0: {
                "x": 320,
                "y": 50
            },
            1: {
                "x": 160,
                "y": 125
            },
            2: {
                "x": 100,
                "y": 200
            },
            3: {
                "x": 560,
                "y": 200
            },
            4: {
                "x": 200,
                "y": 275
            },
            5: {
                "x": 240,
                "y": 275
            },
            6: {
                "x": 220,
                "y": 200
            },
            7: {
                "x": 480,
                "y": 125
            },
            8: {
                "x": 400,
                "y": 200
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 7,
                "w": 1
            },
            2: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            3: {
                "u": 1,
                "v": 6,
                "w": 1
            },
            4: {
                "u": 6,
                "v": 4,
                "w": 1
            },
            5: {
                "u": 6,
                "v": 5,
                "w": 1
            },
            6: {
                "u": 7,
                "v": 8,
                "w": 1
            },
            7: {
                "u": 7,
                "v": 3,
                "w": 1
            }
        };
    } else if (id == CYCLIC) {
        if (mode == VL) return {
            0: {
                "x": 120,
                "y": 250
            },
            1: {
                "x": 320,
                "y": 100
            },
            2: {
                "x": 520,
                "y": 250
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 2,
                "v": 0,
                "w": 1
            },
        };
    } else if (id == TOURNAMENT) {
        if (mode == VL) return {
            0: {
                "x": 220,
                "y": 75
            },
            1: {
                "x": 420,
                "y": 75
            },
            2: {
                "x": 220,
                "y": 275
            },
            3: {
                "x": 420,
                "y": 275
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 3,
                "w": 1
            },
            2: {
                "u": 1,
                "v": 3,
                "w": 1
            },
            3: {
                "u": 3,
                "v": 2,
                "w": 1
            },
            4: {
                "u": 2,
                "v": 0,
                "w": 1
            },
            5: {
                "u": 2,
                "v": 1,
                "w": 1
            }
        };
    } else if (id == SSSP) {
        if (mode == VL) return {
            0: {
                "x": 120,
                "y": 250
            },
            1: {
                "x": 220,
                "y": 100
            },
            2: {
                "x": 320,
                "y": 250
            },
            3: {
                "x": 420,
                "y": 100
            },
            4: {
                "x": 520,
                "y": 250
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 2
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 7
            },
            2: {
                "u": 1,
                "v": 2,
                "w": 4
            },
            3: {
                "u": 2,
                "v": 3,
                "w": 1
            },
            4: {
                "u": 2,
                "v": 4,
                "w": 4
            },
            5: {
                "u": 3,
                "v": 4,
                "w": 2
            },
        };
    } else if (id == CP4_2_7_DISJOINT) {
        if (mode == VL) return {
            0: {
                "x": 220,
                "y": 270
            },
            1: {
                "x": 120,
                "y": 180
            },
            2: {
                "x": 320,
                "y": 180
            },
            3: {
                "x": 120,
                "y": 90
            },
            4: {
                "x": 320,
                "y": 90
            },
            5: {
                "x": 520,
                "y": 90
            },
            6: {
                "x": 520,
                "y": 180
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 3,
                "v": 1,
                "w": 1
            },
            3: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            4: {
                "u": 4,
                "v": 2,
                "w": 1
            },
            5: {
                "u": 5,
                "v": 6,
                "w": 1
            },
            6: {
                "u": 2,
                "v": 0,
                "w": 1
            },
        };
    } else if (id == WHEEL_DS) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 60
            },
            1: {
                "x": 380,
                "y": 120
            },
            2: {
                "x": 340,
                "y": 240
            },
            3: {
                "x": 260,
                "y": 240
            },
            4: {
                "x": 220,
                "y": 120
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 2,
                "v": 3,
                "w": 7
            },
            3: {
                "u": 3,
                "v": 4,
                "w": 8
            },
            4: {
                "u": 4,
                "v": 0,
                "w": 5
            },
        };
    } else if (id == STAR) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 60,
                "w": 1
            },
            1: {
                "x": 380,
                "y": 120,
                "w": 1
            },
            2: {
                "x": 340,
                "y": 240,
                "w": 1
            },
            3: {
                "x": 260,
                "y": 240,
                "w": 1
            },
            4: {
                "x": 220,
                "y": 120,
                "w": 1
            },
            5: {
                "x": 300,
                "y": 160,
                "w": 99
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 5,
                "v": 0,
                "w": 1
            },
            1: {
                "u": 5,
                "v": 1,
                "w": 7
            },
            2: {
                "u": 5,
                "v": 2,
                "w": 8
            },
            3: {
                "u": 5,
                "v": 3,
                "w": 5
            },
            4: {
                "u": 5,
                "v": 4,
                "w": 3
            },
        };
    } else if (id == STAR2) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 60,
                "w": 99
            },
            1: {
                "x": 380,
                "y": 120,
                "w": 99
            },
            2: {
                "x": 340,
                "y": 240,
                "w": 99
            },
            3: {
                "x": 260,
                "y": 240,
                "w": 99
            },
            4: {
                "x": 220,
                "y": 120,
                "w": 99
            },
            5: {
                "x": 300,
                "y": 160,
                "w": 1
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 5,
                "v": 0,
                "w": 1
            },
            1: {
                "u": 5,
                "v": 1,
                "w": 7
            },
            2: {
                "u": 5,
                "v": 2,
                "w": 8
            },
            3: {
                "u": 5,
                "v": 3,
                "w": 5
            },
            4: {
                "u": 5,
                "v": 4,
                "w": 3
            },
        };
    } else if (id == DFSBFSLARGE) {
        if (mode == VL) return {
            0: {
                "x": 100,
                "y": 50
            },
            1: {
                "x": 250,
                "y": 50
            },
            2: {
                "x": 400,
                "y": 50
            },
            3: {
                "x": 550,
                "y": 50
            },
            4: {
                "x": 700,
                "y": 50
            },
            5: {
                "x": 850,
                "y": 50
            },
            6: {
                "x": 1000,
                "y": 50
            },
            7: {
                "x": 1150,
                "y": 50
            },
            8: {
                "x": 100,
                "y": 200
            },
            9: {
                "x": 250,
                "y": 200
            },
            10: {
                "x": 400,
                "y": 200
            },
            11: {
                "x": 550,
                "y": 200
            },
            12: {
                "x": 700,
                "y": 200
            },
            13: {
                "x": 850,
                "y": 200
            },
            14: {
                "x": 1000,
                "y": 200
            },
            15: {
                "x": 1150,
                "y": 200
            },
            16: {
                "x": 100,
                "y": 350
            },
            17: {
                "x": 250,
                "y": 350
            },
            18: {
                "x": 400,
                "y": 350
            },
            19: {
                "x": 550,
                "y": 350
            },
            20: {
                "x": 700,
                "y": 350
            },
            21: {
                "x": 850,
                "y": 350
            },
            22: {
                "x": 1000,
                "y": 350
            },
            23: {
                "x": 1150,
                "y": 350
            },
            24: {
                "x": 100,
                "y": 500
            },
            25: {
                "x": 250,
                "y": 500
            },
            26: {
                "x": 400,
                "y": 500
            },
            27: {
                "x": 550,
                "y": 500
            },
            28: {
                "x": 700,
                "y": 500
            },
            29: {
                "x": 850,
                "y": 500
            },
            30: {
                "x": 1000,
                "y": 500
            },
            31: {
                "x": 1150,
                "y": 500
            },
            32: {
                "x": 100,
                "y": 650
            },
            33: {
                "x": 250,
                "y": 650
            },
            34: {
                "x": 400,
                "y": 650
            },
            35: {
                "x": 550,
                "y": 650
            },
            36: {
                "x": 700,
                "y": 650
            },
            37: {
                "x": 850,
                "y": 650
            },
            38: {
                "x": 1000,
                "y": 650
            },
            39: {
                "x": 1150,
                "y": 650
            },
            40: {
                "x": 100,
                "y": 800
            },
            41: {
                "x": 250,
                "y": 800
            },
            42: {
                "x": 400,
                "y": 800
            },
            43: {
                "x": 550,
                "y": 800
            },
            44: {
                "x": 700,
                "y": 800
            },
            45: {
                "x": 850,
                "y": 800
            },
            46: {
                "x": 1000,
                "y": 800
            },
            47: {
                "x": 1150,
                "y": 800
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 2,
                "v": 3,
                "w": 1
            },
            3: {
                "u": 3,
                "v": 11,
                "w": 1
            },
            4: {
                "u": 11,
                "v": 4,
                "w": 1
            },
            5: {
                "u": 4,
                "v": 5,
                "w": 1
            },
            6: {
                "u": 5,
                "v": 12,
                "w": 1
            },
            7: {
                "u": 5,
                "v": 6,
                "w": 1
            },
            8: {
                "u": 5,
                "v": 13,
                "w": 1
            },
            9: {
                "u": 6,
                "v": 7,
                "w": 1
            },
            10: {
                "u": 7,
                "v": 15,
                "w": 1
            },
            11: {
                "u": 15,
                "v": 14,
                "w": 1
            },
            12: {
                "u": 0,
                "v": 9,
                "w": 1
            },
            13: {
                "u": 9,
                "v": 8,
                "w": 1
            },
            14: {
                "u": 8,
                "v": 17,
                "w": 1
            },
            15: {
                "u": 8,
                "v": 16,
                "w": 1
            },
            16: {
                "u": 2,
                "v": 10,
                "w": 1
            },
            17: {
                "u": 10,
                "v": 18,
                "w": 1
            },
            18: {
                "u": 18,
                "v": 19,
                "w": 1
            },
            19: {
                "u": 14,
                "v": 22,
                "w": 1
            },
            20: {
                "u": 22,
                "v": 23,
                "w": 1
            },
            21: {
                "u": 23,
                "v": 31,
                "w": 1
            },
            22: {
                "u": 31,
                "v": 30,
                "w": 1
            },
            23: {
                "u": 30,
                "v": 38,
                "w": 1
            },
            24: {
                "u": 38,
                "v": 39,
                "w": 1
            },
            25: {
                "u": 39,
                "v": 47,
                "w": 1
            },
            26: {
                "u": 47,
                "v": 46,
                "w": 1
            },
            27: {
                "u": 16,
                "v": 25,
                "w": 1
            },
            28: {
                "u": 25,
                "v": 32,
                "w": 1
            },
            29: {
                "u": 32,
                "v": 24,
                "w": 1
            },
            30: {
                "u": 24,
                "v": 33,
                "w": 1
            },
            31: {
                "u": 33,
                "v": 40,
                "w": 1
            },
            32: {
                "u": 33,
                "v": 41,
                "w": 1
            },
            33: {
                "u": 33,
                "v": 42,
                "w": 1
            },
            34: {
                "u": 41,
                "v": 34,
                "w": 1
            },
            35: {
                "u": 34,
                "v": 43,
                "w": 1
            },
            36: {
                "u": 43,
                "v": 44,
                "w": 1
            },
            37: {
                "u": 44,
                "v": 45,
                "w": 1
            },
            38: {
                "u": 18,
                "v": 25,
                "w": 1
            },
            39: {
                "u": 25,
                "v": 26,
                "w": 1
            },
            40: {
                "u": 26,
                "v": 35,
                "w": 1
            },
            41: {
                "u": 35,
                "v": 34,
                "w": 1
            },
            42: {
                "u": 35,
                "v": 28,
                "w": 1
            },
            43: {
                "u": 28,
                "v": 36,
                "w": 1
            },
            44: {
                "u": 36,
                "v": 29,
                "w": 1
            },
            45: {
                "u": 35,
                "v": 27,
                "w": 1
            },
            46: {
                "u": 27,
                "v": 20,
                "w": 1
            },
            47: {
                "u": 20,
                "v": 21,
                "w": 1
            },
            48: {
                "u": 36,
                "v": 37,
                "w": 1
            },
        }
    } else if (id == DFSBFSLARGECYCLES) {
        if (mode == VL) return {
            0: {
                "x": 100,
                "y": 100
            },
            1: {
                "x": 200,
                "y": 200
            },
            2: {
                "x": 100,
                "y": 200
            },
            3: {
                "x": 300,
                "y": 300
            },
            4: {
                "x": 200,
                "y": 300
            },
            5: {
                "x": 100,
                "y": 250
            },
            6: {
                "x": 100,
                "y": 350
            },
            7: {
                "x": 200,
                "y": 400
            },
            8: {
                "x": 100,
                "y": 400
            },
            9: {
                "x": 100,
                "y": 500
            },
            10: {
                "x": 400,
                "y": 200
            },
            11: {
                "x": 500,
                "y": 300
            },
            12: {
                "x": 600,
                "y": 200
            },
            13: {
                "x": 700,
                "y": 300
            },
            14: {
                "x": 600,
                "y": 400
            },
            15: {
                "x": 400,
                "y": 400
            },
            16: {
                "x": 800,
                "y": 450
            },
            17: {
                "x": 850,
                "y": 350
            },
            18: {
                "x": 850,
                "y": 200
            },
            19: {
                "x": 850,
                "y": 150
            },
            20: {
                "x": 850,
                "y": 100
            },
            21: {
                "x": 850,
                "y": 50
            },
            22: {
                "x": 950,
                "y": 250
            },
            23: {
                "x": 950,
                "y": 150
            },
            24: {
                "x": 1050,
                "y": 150
            },
            25: {
                "x": 1050,
                "y": 300
            },
            26: {
                "x": 750,
                "y": 550
            },
            27: {
                "x": 650,
                "y": 550
            },
            28: {
                "x": 550,
                "y": 700
            },
            29: {
                "x": 550,
                "y": 850
            },
            30: {
                "x": 550,
                "y": 1000
            },
            31: {
                "x": 400,
                "y": 1000
            },
            32: {
                "x": 400,
                "y": 850
            },
            33: {
                "x": 400,
                "y": 700
            },
            34: {
                "x": 250,
                "y": 700
            },
            35: {
                "x": 250,
                "y": 850
            },
            36: {
                "x": 250,
                "y": 1000
            },
            37: {
                "x": 750,
                "y": 700
            },
            38: {
                "x": 750,
                "y": 850
            },
            39: {
                "x": 850,
                "y": 600
            },
            40: {
                "x": 900,
                "y": 650
            },
            41: {
                "x": 1000,
                "y": 850
            },
            42: {
                "x": 1100,
                "y": 750
            },
            43: {
                "x": 1100,
                "y": 950
            },
            44: {
                "x": 1200,
                "y": 850
            },
            45: {
                "x": 1300,
                "y": 1000
            },
            46: {
                "x": 1100,
                "y": 1050
            },
            47: {
                "x": 950,
                "y": 450
            },
            48: {
                "x": 950,
                "y": 550
            },
            49: {
                "x": 1100,
                "y": 450
            },
            50: {
                "x": 1050,
                "y": 600
            },
            51: {
                "x": 1200,
                "y": 500
            },
            52: {
                "x": 1200,
                "y": 600
            },
            53: {
                "x": 1350,
                "y": 500
            },
            54: {
                "x": 1400,
                "y": 600
            },
            55: {
                "x": 1300,
                "y": 750
            },
            56: {
                "x": 1250,
                "y": 300
            },
            57: {
                "x": 1250,
                "y": 150
            },
            58: {
                "x": 1350,
                "y": 50
            },
            59: {
                "x": 1400,
                "y": 150
            },
            60: {
                "x": 1400,
                "y": 300
            },
            61: {
                "x": 1300,
                "y": 400
            }
        };
        else if (mode == EL) return {
            0: {
                "u": 1,
                "v": 0,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 3,
                "v": 1,
                "w": 1
            },
            3: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            4: {
                "u": 4,
                "v": 5,
                "w": 1
            },
            5: {
                "u": 4,
                "v": 6,
                "w": 1
            },
            6: {
                "u": 3,
                "v": 7,
                "w": 1
            },
            7: {
                "u": 7,
                "v": 8,
                "w": 1
            },
            8: {
                "u": 7,
                "v": 9,
                "w": 1
            },
            9: {
                "u": 3,
                "v": 10,
                "w": 1
            },
            10: {
                "u": 10,
                "v": 11,
                "w": 1
            },
            11: {
                "u": 11,
                "v": 12,
                "w": 1
            },
            12: {
                "u": 12,
                "v": 13,
                "w": 1
            },
            13: {
                "u": 13,
                "v": 14,
                "w": 1
            },
            14: {
                "u": 14,
                "v": 11,
                "w": 1
            },
            15: {
                "u": 11,
                "v": 15,
                "w": 1
            },
            16: {
                "u": 15,
                "v": 3,
                "w": 1
            },
            17: {
                "u": 16,
                "v": 13,
                "w": 1
            },
            18: {
                "u": 16,
                "v": 17,
                "w": 1
            },
            19: {
                "u": 17,
                "v": 18,
                "w": 1
            },
            20: {
                "u": 18,
                "v": 19,
                "w": 1
            },
            21: {
                "u": 19,
                "v": 20,
                "w": 1
            },
            22: {
                "u": 20,
                "v": 21,
                "w": 1
            },
            23: {
                "u": 17,
                "v": 22,
                "w": 1
            },
            24: {
                "u": 22,
                "v": 23,
                "w": 1
            },
            25: {
                "u": 22,
                "v": 24,
                "w": 1
            },
            26: {
                "u": 22,
                "v": 25,
                "w": 1
            },
            27: {
                "u": 16,
                "v": 26,
                "w": 1
            },
            28: {
                "u": 26,
                "v": 16,
                "w": 1
            },
            29: {
                "u": 27,
                "v": 26,
                "w": 1
            },
            30: {
                "u": 27,
                "v": 28,
                "w": 1
            },
            31: {
                "u": 28,
                "v": 29,
                "w": 1
            },
            32: {
                "u": 28,
                "v": 33,
                "w": 1
            },
            33: {
                "u": 33,
                "v": 28,
                "w": 1
            },
            34: {
                "u": 29,
                "v": 30,
                "w": 1
            },
            35: {
                "u": 29,
                "v": 33,
                "w": 1
            },
            36: {
                "u": 33,
                "v": 29,
                "w": 1
            },
            37: {
                "u": 30,
                "v": 31,
                "w": 1
            },
            38: {
                "u": 31,
                "v": 29,
                "w": 1
            },
            39: {
                "u": 31,
                "v": 32,
                "w": 1
            },
            40: {
                "u": 32,
                "v": 33,
                "w": 1
            },
            41: {
                "u": 33,
                "v": 34,
                "w": 1
            },
            42: {
                "u": 34,
                "v": 35,
                "w": 1
            },
            43: {
                "u": 35,
                "v": 32,
                "w": 1
            },
            44: {
                "u": 32,
                "v": 35,
                "w": 1
            },
            45: {
                "u": 35,
                "v": 36,
                "w": 1
            },
            46: {
                "u": 36,
                "v": 31,
                "w": 1
            },
            47: {
                "u": 37,
                "v": 27,
                "w": 1
            },
            48: {
                "u": 37,
                "v": 38,
                "w": 1
            },
            49: {
                "u": 38,
                "v": 37,
                "w": 1
            },
            50: {
                "u": 39,
                "v": 37,
                "w": 1
            },
            51: {
                "u": 37,
                "v": 40,
                "w": 1
            },
            52: {
                "u": 40,
                "v": 39,
                "w": 1
            },
            53: {
                "u": 40,
                "v": 41,
                "w": 1
            },
            54: {
                "u": 41,
                "v": 42,
                "w": 1
            },
            55: {
                "u": 42,
                "v": 43,
                "w": 1
            },
            56: {
                "u": 43,
                "v": 44,
                "w": 1
            },
            57: {
                "u": 41,
                "v": 44,
                "w": 1
            },
            58: {
                "u": 44,
                "v": 45,
                "w": 1
            },
            59: {
                "u": 45,
                "v": 46,
                "w": 1
            },
            60: {
                "u": 46,
                "v": 41,
                "w": 1
            },
            61: {
                "u": 39,
                "v": 47,
                "w": 1
            },
            62: {
                "u": 47,
                "v": 16,
                "w": 1
            },
            63: {
                "u": 47,
                "v": 48,
                "w": 1
            },
            64: {
                "u": 48,
                "v": 49,
                "w": 1
            },
            65: {
                "u": 49,
                "v": 50,
                "w": 1
            },
            66: {
                "u": 50,
                "v": 47,
                "w": 1
            },
            67: {
                "u": 40,
                "v": 50,
                "w": 1
            },
            68: {
                "u": 51,
                "v": 49,
                "w": 1
            },
            69: {
                "u": 51,
                "v": 52,
                "w": 1
            },
            70: {
                "u": 52,
                "v": 53,
                "w": 1
            },
            71: {
                "u": 53,
                "v": 54,
                "w": 1
            },
            72: {
                "u": 53,
                "v": 55,
                "w": 1
            },
            73: {
                "u": 55,
                "v": 52,
                "w": 1
            },
            74: {
                "u": 56,
                "v": 57,
                "w": 1
            },
            75: {
                "u": 53,
                "v": 52,
                "w": 1
            },
            76: {
                "u": 51,
                "v": 53,
                "w": 1
            },
            77: {
                "u": 49,
                "v": 57,
                "w": 1
            },
            78: {
                "u": 57,
                "v": 58,
                "w": 1
            },
            79: {
                "u": 58,
                "v": 59,
                "w": 1
            },
            80: {
                "u": 59,
                "v": 60,
                "w": 1
            },
            81: {
                "u": 60,
                "v": 61,
                "w": 1
            },
            82: {
                "u": 61,
                "v": 56,
                "w": 1
            },
            83: {
                "u": 16,
                "v": 39,
                "w": 1
            },
        }
    } else if (id == SSSPLARGE) {
        if (mode == VL) return {
            0: {
                "x": 100,
                "y": 50
            },
            1: {
                "x": 350,
                "y": 150
            },
            2: {
                "x": 500,
                "y": 50
            },
            3: {
                "x": 600,
                "y": 100
            },
            4: {
                "x": 650,
                "y": 200
            },
            5: {
                "x": 750,
                "y": 100
            },
            6: {
                "x": 850,
                "y": 200
            },
            7: {
                "x": 950,
                "y": 100
            },
            8: {
                "x": 1050,
                "y": 200
            },
            9: {
                "x": 1150,
                "y": 100
            },
            10: {
                "x": 1250,
                "y": 200
            },
            11: {
                "x": 1250,
                "y": 300
            },
            12: {
                "x": 1400,
                "y": 200
            },
            13: {
                "x": 1450,
                "y": 250
            },
            14: {
                "x": 1500,
                "y": 150
            },
            15: {
                "x": 1500,
                "y": 350
            },
            16: {
                "x": 1400,
                "y": 350
            },
            17: {
                "x": 1050,
                "y": 300
            },
            18: {
                "x": 850,
                "y": 300
            },
            19: {
                "x": 450,
                "y": 250
            },
            20: {
                "x": 250,
                "y": 350
            },
            21: {
                "x": 500,
                "y": 350
            },
            22: {
                "x": 650,
                "y": 400
            },
            23: {
                "x": 900,
                "y": 450
            },
            24: {
                "x": 1000,
                "y": 400
            },
            25: {
                "x": 1150,
                "y": 350
            },
            26: {
                "x": 1400,
                "y": 500
            },
            27: {
                "x": 1250,
                "y": 450
            },
            28: {
                "x": 1350,
                "y": 600
            },
            29: {
                "x": 1350,
                "y": 700
            },
            30: {
                "x": 1350,
                "y": 800
            },
            31: {
                "x": 1350,
                "y": 900
            },
            32: {
                "x": 1350,
                "y": 1000
            },
            33: {
                "x": 1250,
                "y": 700
            },
            34: {
                "x": 1150,
                "y": 800
            },
            35: {
                "x": 1100,
                "y": 600
            },
            36: {
                "x": 1050,
                "y": 700
            },
            37: {
                "x": 1000,
                "y": 800
            },
            38: {
                "x": 950,
                "y": 600
            },
            39: {
                "x": 900,
                "y": 700
            },
            40: {
                "x": 750,
                "y": 750
            },
            41: {
                "x": 750,
                "y": 550
            },
            42: {
                "x": 900,
                "y": 850
            },
            43: {
                "x": 800,
                "y": 900
            },
            44: {
                "x": 650,
                "y": 800
            },
            45: {
                "x": 500,
                "y": 750
            },
            46: {
                "x": 350,
                "y": 750
            },
            47: {
                "x": 550,
                "y": 550
            },
            48: {
                "x": 400,
                "y": 650
            },
            49: {
                "x": 250,
                "y": 350
            },
            50: {
                "x": 500,
                "y": 900
            },
            51: {
                "x": 400,
                "y": 1000
            },
            52: {
                "x": 500,
                "y": 1050
            },
            53: {
                "x": 650,
                "y": 950
            },
            54: {
                "x": 750,
                "y": 950
            },
            55: {
                "x": 850,
                "y": 1050
            },
            56: {
                "x": 950,
                "y": 950
            },
            57: {
                "x": 1050,
                "y": 950
            },
            58: {
                "x": 1150,
                "y": 1050
            },
            59: {
                "x": 1050,
                "y": 1100
            },
            60: {
                "x": 950,
                "y": 1100
            },
            61: {
                "x": 750,
                "y": 1100
            },
            62: {
                "x": 650,
                "y": 1100
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 46
            },
            1: {
                "u": 0,
                "v": 20,
                "w": 34
            },
            2: {
                "u": 1,
                "v": 2,
                "w": 93
            },
            3: {
                "u": 2,
                "v": 3,
                "w": 17
            },
            4: {
                "u": 3,
                "v": 4,
                "w": 95
            },
            5: {
                "u": 4,
                "v": 5,
                "w": 71
            },
            6: {
                "u": 5,
                "v": 6,
                "w": 3
            },
            7: {
                "u": 6,
                "v": 7,
                "w": 61
            },
            8: {
                "u": 7,
                "v": 8,
                "w": 86
            },
            9: {
                "u": 8,
                "v": 9,
                "w": 36
            },
            10: {
                "u": 9,
                "v": 10,
                "w": 97
            },
            11: {
                "u": 10,
                "v": 11,
                "w": 29
            },
            12: {
                "u": 11,
                "v": 12,
                "w": 80
            },
            13: {
                "u": 11,
                "v": 16,
                "w": 93
            },
            14: {
                "u": 16,
                "v": 13,
                "w": 19
            },
            15: {
                "u": 13,
                "v": 12,
                "w": 73
            },
            16: {
                "u": 14,
                "v": 13,
                "w": 30
            },
            17: {
                "u": 13,
                "v": 15,
                "w": 36
            },
            18: {
                "u": 11,
                "v": 8,
                "w": 62
            },
            19: {
                "u": 8,
                "v": 17,
                "w": 55
            },
            20: {
                "u": 17,
                "v": 6,
                "w": 76
            },
            21: {
                "u": 6,
                "v": 18,
                "w": 71
            },
            22: {
                "u": 18,
                "v": 4,
                "w": 18
            },
            23: {
                "u": 4,
                "v": 19,
                "w": 51
            },
            24: {
                "u": 1,
                "v": 19,
                "w": 16
            },
            25: {
                "u": 19,
                "v": 2,
                "w": 55
            },
            26: {
                "u": 20,
                "v": 1,
                "w": 10
            },
            27: {
                "u": 20,
                "v": 21,
                "w": 38
            },
            28: {
                "u": 21,
                "v": 4,
                "w": 82
            },
            29: {
                "u": 17,
                "v": 24,
                "w": 43
            },
            30: {
                "u": 18,
                "v": 24,
                "w": 24
            },
            31: {
                "u": 18,
                "v": 22,
                "w": 70
            },
            32: {
                "u": 25,
                "v": 17,
                "w": 27
            },
            33: {
                "u": 15,
                "v": 26,
                "w": 54
            },
            34: {
                "u": 21,
                "v": 47,
                "w": 93
            },
            35: {
                "u": 47,
                "v": 22,
                "w": 38
            },
            36: {
                "u": 21,
                "v": 49,
                "w": 10
            },
            37: {
                "u": 49,
                "v": 20,
                "w": 6
            },
            38: {
                "u": 49,
                "v": 48,
                "w": 62
            },
            39: {
                "u": 48,
                "v": 20,
                "w": 55
            },
            40: {
                "u": 48,
                "v": 47,
                "w": 80
            },
            41: {
                "u": 22,
                "v": 41,
                "w": 42
            },
            42: {
                "u": 41,
                "v": 23,
                "w": 94
            },
            43: {
                "u": 23,
                "v": 18,
                "w": 80
            },
            44: {
                "u": 26,
                "v": 28,
                "w": 33
            },
            45: {
                "u": 28,
                "v": 27,
                "w": 20
            },
            46: {
                "u": 27,
                "v": 26,
                "w": 40
            },
            47: {
                "u": 28,
                "v": 29,
                "w": 16
            },
            48: {
                "u": 29,
                "v": 30,
                "w": 59
            },
            49: {
                "u": 30,
                "v": 31,
                "w": 47
            },
            50: {
                "u": 31,
                "v": 32,
                "w": 12
            },
            51: {
                "u": 28,
                "v": 33,
                "w": 91
            },
            52: {
                "u": 33,
                "v": 34,
                "w": 97
            },
            53: {
                "u": 34,
                "v": 35,
                "w": 26
            },
            54: {
                "u": 35,
                "v": 33,
                "w": 39
            },
            55: {
                "u": 35,
                "v": 25,
                "w": 88
            },
            56: {
                "u": 35,
                "v": 27,
                "w": 18
            },
            57: {
                "u": 23,
                "v": 38,
                "w": 35
            },
            58: {
                "u": 38,
                "v": 35,
                "w": 83
            },
            59: {
                "u": 34,
                "v": 36,
                "w": 36
            },
            60: {
                "u": 36,
                "v": 37,
                "w": 76
            },
            61: {
                "u": 41,
                "v": 39,
                "w": 72
            },
            62: {
                "u": 39,
                "v": 37,
                "w": 75
            },
            63: {
                "u": 39,
                "v": 38,
                "w": 22
            },
            64: {
                "u": 39,
                "v": 40,
                "w": 87
            },
            65: {
                "u": 41,
                "v": 45,
                "w": 52
            },
            66: {
                "u": 45,
                "v": 46,
                "w": 62
            },
            67: {
                "u": 41,
                "v": 44,
                "w": 7
            },
            68: {
                "u": 40,
                "v": 42,
                "w": 1
            },
            69: {
                "u": 40,
                "v": 43,
                "w": 57
            },
            70: {
                "u": 44,
                "v": 43,
                "w": 82
            },
            71: {
                "u": 44,
                "v": 50,
                "w": 25
            },
            72: {
                "u": 50,
                "v": 51,
                "w": 13
            },
            73: {
                "u": 50,
                "v": 52,
                "w": 78
            },
            74: {
                "u": 52,
                "v": 53,
                "w": 19
            },
            75: {
                "u": 53,
                "v": 54,
                "w": 5
            },
            76: {
                "u": 54,
                "v": 55,
                "w": 33
            },
            77: {
                "u": 55,
                "v": 56,
                "w": 88
            },
            78: {
                "u": 56,
                "v": 57,
                "w": 17
            },
            79: {
                "u": 57,
                "v": 58,
                "w": 39
            },
            80: {
                "u": 58,
                "v": 59,
                "w": 16
            },
            81: {
                "u": 59,
                "v": 60,
                "w": 91
            },
            82: {
                "u": 60,
                "v": 55,
                "w": 10
            },
            83: {
                "u": 55,
                "v": 61,
                "w": 23
            },
            84: {
                "u": 61,
                "v": 62,
                "w": 3
            },
            85: {
                "u": 62,
                "v": 52,
                "w": 34
            },
            86: {
                "u": 53,
                "v": 61,
                "w": 47
            },
            87: {
                "u": 61,
                "v": 54,
                "w": 64
            },
            88: {
                "u": 53,
                "v": 62,
                "w": 26
            },
            89: {
                "u": 62,
                "v": 54,
                "w": 92
            },
            90: {
                "u": 56,
                "v": 59,
                "w": 82
            },
            91: {
                "u": 60,
                "v": 57,
                "w": 60
            },
            92: {
                "u": 60,
                "v": 56,
                "w": 9
            },
            93: {
                "u": 57,
                "v": 59,
                "w": 52
            },
        }
    } else if (id == SSSPMRT) {
        if (mode == VL) return {
            0: {
                "x": 100,
                "y": 100
            },
            1: {
                "x": 100,
                "y": 200
            },
            2: {
                "x": 100,
                "y": 300
            },
            3: {
                "x": 100,
                "y": 400
            },
            4: {
                "x": 100,
                "y": 500
            },
            5: {
                "x": 100,
                "y": 600
            },
            6: {
                "x": 100,
                "y": 700
            },
            7: {
                "x": 200,
                "y": 800
            },
            8: {
                "x": 300,
                "y": 800
            },
            9: {
                "x": 400,
                "y": 800
            },
            10: {
                "x": 500,
                "y": 800
            },
            11: {
                "x": 600,
                "y": 800
            },
            12: {
                "x": 700,
                "y": 800
            },
            13: {
                "x": 800,
                "y": 900
            },
            14: {
                "x": 900,
                "y": 1000
            },
            15: {
                "x": 1000,
                "y": 1020
            },
            16: {
                "x": 1150,
                "y": 1020
            },
            17: {
                "x": 1150,
                "y": 950
            },
            18: {
                "x": 1250,
                "y": 850
            },
            19: {
                "x": 1350,
                "y": 750
            },
            20: {
                "x": 1450,
                "y": 650
            },
            21: {
                "x": 1500,
                "y": 650
            },
            22: {
                "x": 400,
                "y": 650
            },
            23: {
                "x": 400,
                "y": 550
            },
            24: {
                "x": 400,
                "y": 450
            },
            25: {
                "x": 400,
                "y": 350
            },
            26: {
                "x": 400,
                "y": 250
            },
            27: {
                "x": 500,
                "y": 150
            },
            28: {
                "x": 600,
                "y": 150
            },
            29: {
                "x": 700,
                "y": 150
            },
            30: {
                "x": 800,
                "y": 150
            },
            31: {
                "x": 900,
                "y": 150
            },
            32: {
                "x": 1000,
                "y": 150
            },
            33: {
                "x": 1100,
                "y": 250
            },
            34: {
                "x": 1100,
                "y": 350
            },
            35: {
                "x": 1100,
                "y": 450
            },
            36: {
                "x": 1100,
                "y": 550
            },
            37: {
                "x": 1100,
                "y": 650
            },
            38: {
                "x": 1100,
                "y": 750
            },
            39: {
                "x": 1100,
                "y": 850
            },
            40: {
                "x": 700,
                "y": 650
            },
            41: {
                "x": 800,
                "y": 500
            },
            42: {
                "x": 950,
                "y": 450
            },
            43: {
                "x": 1250,
                "y": 550
            },
            44: {
                "x": 1300,
                "y": 650
            },
            45: {
                "x": 1350,
                "y": 900
            },
            46: {
                "x": 1300,
                "y": 1050
            },
            47: {
                "x": 1150,
                "y": 1070
            },
            48: {
                "x": 950,
                "y": 1070
            },
            49: {
                "x": 800,
                "y": 1050
            },
            50: {
                "x": 700,
                "y": 950
            },
            51: {
                "x": 950,
                "y": 900
            },
            52: {
                "x": 1000,
                "y": 800
            },
            53: {
                "x": 1050,
                "y": 700
            },
            54: {
                "x": 1150,
                "y": 600
            },
            55: {
                "x": 1250,
                "y": 450
            },
            56: {
                "x": 1250,
                "y": 350
            },
            57: {
                "x": 1350,
                "y": 250
            },
            58: {
                "x": 1450,
                "y": 150
            },
            59: {
                "x": 550,
                "y": 250
            },
            60: {
                "x": 550,
                "y": 450
            },
            61: {
                "x": 600,
                "y": 500
            },
            62: {
                "x": 950,
                "y": 650
            },
            63: {
                "x": 650,
                "y": 200
            },
            64: {
                "x": 750,
                "y": 300
            },
            65: {
                "x": 950,
                "y": 300
            },
            66: {
                "x": 950,
                "y": 750
            },
            67: {
                "x": 1050,
                "y": 850
            },
            68: {
                "x": 1050,
                "y": 950
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 2
            },
            1: {
                "u": 1,
                "v": 0,
                "w": 2
            },
            2: {
                "u": 1,
                "v": 2,
                "w": 4
            },
            3: {
                "u": 2,
                "v": 1,
                "w": 4
            },
            4: {
                "u": 2,
                "v": 3,
                "w": 3
            },
            5: {
                "u": 3,
                "v": 2,
                "w": 3
            },
            6: {
                "u": 3,
                "v": 4,
                "w": 5
            },
            7: {
                "u": 4,
                "v": 3,
                "w": 5
            },
            8: {
                "u": 4,
                "v": 5,
                "w": 3
            },
            9: {
                "u": 5,
                "v": 6,
                "w": 3
            },
            10: {
                "u": 6,
                "v": 5,
                "w": 3
            },
            11: {
                "u": 6,
                "v": 7,
                "w": 2
            },
            12: {
                "u": 7,
                "v": 6,
                "w": 2
            },
            13: {
                "u": 7,
                "v": 8,
                "w": 5
            },
            14: {
                "u": 8,
                "v": 7,
                "w": 5
            },
            15: {
                "u": 8,
                "v": 9,
                "w": 6
            },
            16: {
                "u": 9,
                "v": 8,
                "w": 6
            },
            17: {
                "u": 9,
                "v": 10,
                "w": 7
            },
            18: {
                "u": 10,
                "v": 9,
                "w": 7
            },
            19: {
                "u": 10,
                "v": 11,
                "w": 4
            },
            20: {
                "u": 11,
                "v": 10,
                "w": 4
            },
            21: {
                "u": 11,
                "v": 12,
                "w": 5
            },
            22: {
                "u": 12,
                "v": 11,
                "w": 5
            },
            23: {
                "u": 12,
                "v": 13,
                "w": 8
            },
            24: {
                "u": 13,
                "v": 12,
                "w": 8
            },
            25: {
                "u": 13,
                "v": 14,
                "w": 2
            },
            26: {
                "u": 14,
                "v": 13,
                "w": 2
            },
            27: {
                "u": 14,
                "v": 15,
                "w": 7
            },
            28: {
                "u": 15,
                "v": 14,
                "w": 7
            },
            29: {
                "u": 15,
                "v": 16,
                "w": 8
            },
            30: {
                "u": 16,
                "v": 15,
                "w": 8
            },
            31: {
                "u": 16,
                "v": 17,
                "w": 7
            },
            32: {
                "u": 17,
                "v": 16,
                "w": 7
            },
            33: {
                "u": 17,
                "v": 18,
                "w": 4
            },
            34: {
                "u": 18,
                "v": 17,
                "w": 4
            },
            35: {
                "u": 18,
                "v": 19,
                "w": 1
            },
            36: {
                "u": 19,
                "v": 18,
                "w": 1
            },
            37: {
                "u": 19,
                "v": 20,
                "w": 6
            },
            38: {
                "u": 20,
                "v": 19,
                "w": 6
            },
            39: {
                "u": 20,
                "v": 21,
                "w": 5
            },
            40: {
                "u": 21,
                "v": 20,
                "w": 5
            },
            41: {
                "u": 9,
                "v": 22,
                "w": 5
            },
            42: {
                "u": 22,
                "v": 9,
                "w": 5
            },
            43: {
                "u": 22,
                "v": 23,
                "w": 6
            },
            44: {
                "u": 23,
                "v": 22,
                "w": 6
            },
            45: {
                "u": 23,
                "v": 24,
                "w": 1
            },
            46: {
                "u": 24,
                "v": 23,
                "w": 1
            },
            47: {
                "u": 24,
                "v": 25,
                "w": 6
            },
            48: {
                "u": 25,
                "v": 24,
                "w": 6
            },
            49: {
                "u": 25,
                "v": 26,
                "w": 1
            },
            50: {
                "u": 26,
                "v": 25,
                "w": 1
            },
            51: {
                "u": 26,
                "v": 27,
                "w": 5
            },
            52: {
                "u": 27,
                "v": 26,
                "w": 5
            },
            53: {
                "u": 27,
                "v": 28,
                "w": 2
            },
            54: {
                "u": 28,
                "v": 27,
                "w": 2
            },
            55: {
                "u": 28,
                "v": 29,
                "w": 2
            },
            56: {
                "u": 29,
                "v": 28,
                "w": 2
            },
            57: {
                "u": 29,
                "v": 30,
                "w": 7
            },
            58: {
                "u": 30,
                "v": 29,
                "w": 7
            },
            59: {
                "u": 30,
                "v": 31,
                "w": 6
            },
            60: {
                "u": 31,
                "v": 30,
                "w": 6
            },
            61: {
                "u": 31,
                "v": 32,
                "w": 7
            },
            62: {
                "u": 32,
                "v": 31,
                "w": 7
            },
            63: {
                "u": 32,
                "v": 33,
                "w": 6
            },
            64: {
                "u": 33,
                "v": 32,
                "w": 6
            },
            65: {
                "u": 33,
                "v": 34,
                "w": 1
            },
            66: {
                "u": 34,
                "v": 33,
                "w": 1
            },
            67: {
                "u": 34,
                "v": 35,
                "w": 6
            },
            68: {
                "u": 35,
                "v": 34,
                "w": 6
            },
            69: {
                "u": 35,
                "v": 36,
                "w": 1
            },
            70: {
                "u": 36,
                "v": 35,
                "w": 1
            },
            71: {
                "u": 36,
                "v": 37,
                "w": 8
            },
            72: {
                "u": 37,
                "v": 36,
                "w": 8
            },
            73: {
                "u": 37,
                "v": 38,
                "w": 3
            },
            74: {
                "u": 38,
                "v": 37,
                "w": 3
            },
            75: {
                "u": 38,
                "v": 39,
                "w": 1
            },
            76: {
                "u": 39,
                "v": 38,
                "w": 1
            },
            77: {
                "u": 39,
                "v": 17,
                "w": 5
            },
            78: {
                "u": 17,
                "v": 39,
                "w": 5
            }, // <<<<<<<<<<<< Here as of 1755hrs 20 March
            79: {
                "u": 12,
                "v": 40,
                "w": 1
            },
            80: {
                "u": 40,
                "v": 12,
                "w": 1
            },
            81: {
                "u": 40,
                "v": 41,
                "w": 5
            },
            82: {
                "u": 41,
                "v": 40,
                "w": 5
            },
            83: {
                "u": 41,
                "v": 42,
                "w": 8
            },
            84: {
                "u": 42,
                "v": 41,
                "w": 8
            },
            85: {
                "u": 42,
                "v": 35,
                "w": 3
            },
            86: {
                "u": 35,
                "v": 42,
                "w": 3
            },
            87: {
                "u": 35,
                "v": 43,
                "w": 1
            },
            88: {
                "u": 43,
                "v": 35,
                "w": 1
            },
            89: {
                "u": 43,
                "v": 44,
                "w": 4
            },
            90: {
                "u": 44,
                "v": 43,
                "w": 4
            },
            91: {
                "u": 44,
                "v": 19,
                "w": 7
            },
            92: {
                "u": 19,
                "v": 44,
                "w": 7
            },
            93: {
                "u": 19,
                "v": 45,
                "w": 1
            },
            94: {
                "u": 45,
                "v": 19,
                "w": 1
            },
            95: {
                "u": 45,
                "v": 46,
                "w": 6
            },
            96: {
                "u": 46,
                "v": 45,
                "w": 6
            },
            97: {
                "u": 46,
                "v": 47,
                "w": 5
            },
            98: {
                "u": 47,
                "v": 46,
                "w": 5
            },
            99: {
                "u": 47,
                "v": 48,
                "w": 1
            },
            100: {
                "u": 48,
                "v": 49,
                "w": 1
            },
            101: {
                "u": 49,
                "v": 48,
                "w": 1
            },
            102: {
                "u": 49,
                "v": 50,
                "w": 3
            },
            103: {
                "u": 50,
                "v": 49,
                "w": 3
            },
            104: {
                "u": 50,
                "v": 12,
                "w": 5
            },
            105: {
                "u": 12,
                "v": 50,
                "w": 5
            },
            106: {
                "u": 14,
                "v": 51,
                "w": 4
            },
            107: {
                "u": 51,
                "v": 14,
                "w": 4
            },
            108: {
                "u": 51,
                "v": 52,
                "w": 5
            },
            109: {
                "u": 52,
                "v": 51,
                "w": 5
            },
            110: {
                "u": 52,
                "v": 53,
                "w": 1
            },
            111: {
                "u": 53,
                "v": 52,
                "w": 1
            },
            112: {
                "u": 53,
                "v": 54,
                "w": 6
            },
            113: {
                "u": 54,
                "v": 53,
                "w": 6
            },
            114: {
                "u": 54,
                "v": 43,
                "w": 1
            },
            115: {
                "u": 43,
                "v": 54,
                "w": 1
            },
            116: {
                "u": 43,
                "v": 55,
                "w": 4
            },
            117: {
                "u": 55,
                "v": 43,
                "w": 4
            },
            118: {
                "u": 55,
                "v": 56,
                "w": 5
            },
            119: {
                "u": 56,
                "v": 55,
                "w": 5
            },
            120: {
                "u": 56,
                "v": 57,
                "w": 8
            },
            121: {
                "u": 57,
                "v": 56,
                "w": 8
            },
            122: {
                "u": 57,
                "v": 58,
                "w": 6
            },
            123: {
                "u": 58,
                "v": 57,
                "w": 6
            },
            124: {
                "u": 59,
                "v": 60,
                "w": 6
            },
            125: {
                "u": 60,
                "v": 59,
                "w": 6
            },
            126: {
                "u": 60,
                "v": 61,
                "w": 8
            },
            127: {
                "u": 61,
                "v": 60,
                "w": 8
            },
            128: {
                "u": 61,
                "v": 41,
                "w": 8
            },
            129: {
                "u": 41,
                "v": 61,
                "w": 8
            },
            130: {
                "u": 41,
                "v": 62,
                "w": 2
            },
            131: {
                "u": 62,
                "v": 41,
                "w": 2
            },
            132: {
                "u": 62,
                "v": 53,
                "w": 4
            },
            133: {
                "u": 53,
                "v": 62,
                "w": 4
            },
            134: {
                "u": 53,
                "v": 38,
                "w": 3
            },
            135: {
                "u": 38,
                "v": 53,
                "w": 3
            },
            136: {
                "u": 38,
                "v": 18,
                "w": 5
            },
            137: {
                "u": 18,
                "v": 38,
                "w": 5
            },
            138: {
                "u": 63,
                "v": 64,
                "w": 1
            },
            139: {
                "u": 64,
                "v": 63,
                "w": 1
            },
            140: {
                "u": 64,
                "v": 65,
                "w": 2
            },
            141: {
                "u": 65,
                "v": 64,
                "w": 2
            },
            142: {
                "u": 65,
                "v": 42,
                "w": 1
            },
            143: {
                "u": 42,
                "v": 65,
                "w": 1
            },
            144: {
                "u": 42,
                "v": 62,
                "w": 7
            },
            145: {
                "u": 62,
                "v": 42,
                "w": 7
            },
            146: {
                "u": 62,
                "v": 66,
                "w": 5
            },
            147: {
                "u": 66,
                "v": 62,
                "w": 5
            },
            148: {
                "u": 66,
                "v": 52,
                "w": 4
            },
            149: {
                "u": 52,
                "v": 66,
                "w": 4
            },
            150: {
                "u": 52,
                "v": 67,
                "w": 5
            },
            151: {
                "u": 67,
                "v": 52,
                "w": 5
            },
            152: {
                "u": 67,
                "v": 68,
                "w": 4
            },
            153: {
                "u": 68,
                "v": 67,
                "w": 4
            },
            154: {
                "u": 48,
                "v": 47,
                "w": 1
            },
            155: {
                "u": 5,
                "v": 4,
                "w": 3
            },
        }
    } else if (id == MSTLARGE) {
        if (mode == VL) return {
            0: {
                "x": 150,
                "y": 100
            },
            1: {
                "x": 400,
                "y": 100
            },
            2: {
                "x": 800,
                "y": 150
            },
            3: {
                "x": 900,
                "y": 150
            },
            4: {
                "x": 1200,
                "y": 100
            },
            5: {
                "x": 1450,
                "y": 100
            },
            6: {
                "x": 200,
                "y": 250
            },
            7: {
                "x": 350,
                "y": 250
            },
            8: {
                "x": 600,
                "y": 200
            },
            9: {
                "x": 750,
                "y": 250
            },
            10: {
                "x": 1050,
                "y": 200
            },
            11: {
                "x": 1300,
                "y": 150
            },
            12: {
                "x": 500,
                "y": 350
            },
            13: {
                "x": 850,
                "y": 350
            },
            14: {
                "x": 1100,
                "y": 300
            },
            15: {
                "x": 1300,
                "y": 300
            },
            16: {
                "x": 1450,
                "y": 300
            },
            17: {
                "x": 300,
                "y": 500
            },
            18: {
                "x": 550,
                "y": 500
            },
            19: {
                "x": 800,
                "y": 450
            },
            20: {
                "x": 950,
                "y": 450
            },
            21: {
                "x": 1150,
                "y": 350
            },
            22: {
                "x": 1500,
                "y": 350
            },
            23: {
                "x": 1550,
                "y": 400
            },
            24: {
                "x": 1450,
                "y": 450
            },
            25: {
                "x": 1400,
                "y": 500
            },
            26: {
                "x": 1250,
                "y": 450
            },
            27: {
                "x": 1100,
                "y": 550
            },
            28: {
                "x": 800,
                "y": 600
            },
            29: {
                "x": 450,
                "y": 700
            },
            30: {
                "x": 200,
                "y": 650
            },
            31: {
                "x": 100,
                "y": 700
            },
            32: {
                "x": 300,
                "y": 750
            },
            33: {
                "x": 700,
                "y": 750
            },
            34: {
                "x": 950,
                "y": 700
            },
            35: {
                "x": 1200,
                "y": 650
            },
            36: {
                "x": 1300,
                "y": 700
            },
            37: {
                "x": 1200,
                "y": 750
            },
            38: {
                "x": 1500,
                "y": 850
            },
            39: {
                "x": 1350,
                "y": 850
            },
            40: {
                "x": 1250,
                "y": 900
            },
            41: {
                "x": 1200,
                "y": 1000
            },
            42: {
                "x": 1400,
                "y": 1000
            },
            43: {
                "x": 1100,
                "y": 850
            },
            44: {
                "x": 850,
                "y": 850
            },
            45: {
                "x": 750,
                "y": 900
            },
            46: {
                "x": 650,
                "y": 850
            },
            47: {
                "x": 150,
                "y": 850
            },
            48: {
                "x": 400,
                "y": 950
            },
            49: {
                "x": 600,
                "y": 1050
            },
            50: {
                "x": 950,
                "y": 950
            },
            51: {
                "x": 300,
                "y": 1000
            },
            52: {
                "x": 450,
                "y": 1050
            },
            53: {
                "x": 900,
                "y": 1050
            },
        };
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 46
            },
            1: {
                "u": 1,
                "v": 8,
                "w": 34
            },
            2: {
                "u": 0,
                "v": 6,
                "w": 93
            },
            3: {
                "u": 1,
                "v": 6,
                "w": 17
            },
            4: {
                "u": 6,
                "v": 7,
                "w": 95
            },
            5: {
                "u": 1,
                "v": 7,
                "w": 71
            },
            6: {
                "u": 7,
                "v": 8,
                "w": 3
            },
            7: {
                "u": 8,
                "v": 9,
                "w": 61
            },
            8: {
                "u": 2,
                "v": 9,
                "w": 86
            },
            9: {
                "u": 2,
                "v": 3,
                "w": 36
            },
            10: {
                "u": 3,
                "v": 9,
                "w": 97
            },
            11: {
                "u": 8,
                "v": 12,
                "w": 29
            },
            12: {
                "u": 9,
                "v": 13,
                "w": 80
            },
            13: {
                "u": 9,
                "v": 19,
                "w": 93
            },
            14: {
                "u": 7,
                "v": 12,
                "w": 19
            },
            15: {
                "u": 7,
                "v": 17,
                "w": 73
            },
            16: {
                "u": 12,
                "v": 17,
                "w": 30
            },
            17: {
                "u": 8,
                "v": 19,
                "w": 36
            },
            18: {
                "u": 10,
                "v": 13,
                "w": 62
            },
            19: {
                "u": 10,
                "v": 14,
                "w": 55
            },
            20: {
                "u": 4,
                "v": 10,
                "w": 76
            },
            21: {
                "u": 4,
                "v": 11,
                "w": 71
            },
            22: {
                "u": 5,
                "v": 11,
                "w": 18
            },
            23: {
                "u": 5,
                "v": 16,
                "w": 51
            },
            24: {
                "u": 11,
                "v": 16,
                "w": 16
            },
            25: {
                "u": 11,
                "v": 15,
                "w": 55
            },
            26: {
                "u": 4,
                "v": 15,
                "w": 10
            },
            27: {
                "u": 4,
                "v": 21,
                "w": 38
            },
            28: {
                "u": 12,
                "v": 18,
                "w": 82
            },
            29: {
                "u": 13,
                "v": 19,
                "w": 43
            },
            30: {
                "u": 14,
                "v": 20,
                "w": 24
            },
            31: {
                "u": 14,
                "v": 21,
                "w": 70
            },
            32: {
                "u": 15,
                "v": 16,
                "w": 27
            },
            33: {
                "u": 15,
                "v": 21,
                "w": 54
            },
            34: {
                "u": 15,
                "v": 24,
                "w": 93
            },
            35: {
                "u": 15,
                "v": 25,
                "w": 38
            },
            36: {
                "u": 15,
                "v": 26,
                "w": 10
            },
            37: {
                "u": 16,
                "v": 22,
                "w": 6
            },
            38: {
                "u": 16,
                "v": 24,
                "w": 62
            },
            39: {
                "u": 22,
                "v": 24,
                "w": 55
            },
            40: {
                "u": 23,
                "v": 24,
                "w": 80
            },
            41: {
                "u": 18,
                "v": 19,
                "w": 42
            },
            42: {
                "u": 18,
                "v": 28,
                "w": 94
            },
            43: {
                "u": 18,
                "v": 29,
                "w": 80
            },
            44: {
                "u": 19,
                "v": 20,
                "w": 33
            },
            45: {
                "u": 19,
                "v": 28,
                "w": 20
            },
            46: {
                "u": 20,
                "v": 27,
                "w": 40
            },
            47: {
                "u": 20,
                "v": 28,
                "w": 16
            },
            48: {
                "u": 21,
                "v": 26,
                "w": 59
            },
            49: {
                "u": 21,
                "v": 27,
                "w": 47
            },
            50: {
                "u": 25,
                "v": 26,
                "w": 12
            },
            51: {
                "u": 25,
                "v": 36,
                "w": 91
            },
            52: {
                "u": 26,
                "v": 27,
                "w": 97
            },
            53: {
                "u": 27,
                "v": 28,
                "w": 26
            },
            54: {
                "u": 27,
                "v": 34,
                "w": 39
            },
            55: {
                "u": 27,
                "v": 35,
                "w": 88
            },
            56: {
                "u": 27,
                "v": 43,
                "w": 18
            },
            57: {
                "u": 28,
                "v": 29,
                "w": 35
            },
            58: {
                "u": 28,
                "v": 33,
                "w": 83
            },
            59: {
                "u": 28,
                "v": 34,
                "w": 36
            },
            60: {
                "u": 29,
                "v": 30,
                "w": 76
            },
            61: {
                "u": 29,
                "v": 32,
                "w": 72
            },
            62: {
                "u": 29,
                "v": 46,
                "w": 75
            },
            63: {
                "u": 30,
                "v": 31,
                "w": 22
            },
            64: {
                "u": 30,
                "v": 32,
                "w": 87
            },
            65: {
                "u": 31,
                "v": 47,
                "w": 52
            },
            66: {
                "u": 30,
                "v": 47,
                "w": 62
            },
            67: {
                "u": 32,
                "v": 47,
                "w": 7
            },
            68: {
                "u": 32,
                "v": 46,
                "w": 1
            },
            69: {
                "u": 33,
                "v": 34,
                "w": 57
            },
            70: {
                "u": 33,
                "v": 44,
                "w": 82
            },
            71: {
                "u": 33,
                "v": 45,
                "w": 25
            },
            72: {
                "u": 33,
                "v": 46,
                "w": 13
            },
            73: {
                "u": 34,
                "v": 44,
                "w": 78
            },
            74: {
                "u": 34,
                "v": 43,
                "w": 19
            },
            75: {
                "u": 35,
                "v": 36,
                "w": 5
            },
            76: {
                "u": 35,
                "v": 37,
                "w": 33
            },
            77: {
                "u": 36,
                "v": 39,
                "w": 88
            },
            78: {
                "u": 37,
                "v": 40,
                "w": 17
            },
            79: {
                "u": 37,
                "v": 43,
                "w": 39
            },
            80: {
                "u": 38,
                "v": 39,
                "w": 16
            },
            81: {
                "u": 38,
                "v": 42,
                "w": 91
            },
            82: {
                "u": 39,
                "v": 40,
                "w": 10
            },
            83: {
                "u": 39,
                "v": 42,
                "w": 23
            },
            84: {
                "u": 40,
                "v": 41,
                "w": 3
            },
            85: {
                "u": 41,
                "v": 43,
                "w": 34
            },
            86: {
                "u": 41,
                "v": 50,
                "w": 47
            },
            87: {
                "u": 43,
                "v": 50,
                "w": 64
            },
            88: {
                "u": 44,
                "v": 50,
                "w": 26
            },
            89: {
                "u": 45,
                "v": 46,
                "w": 92
            },
            90: {
                "u": 45,
                "v": 49,
                "w": 82
            },
            91: {
                "u": 45,
                "v": 50,
                "w": 60
            },
            92: {
                "u": 45,
                "v": 53,
                "w": 9
            },
            93: {
                "u": 47,
                "v": 48,
                "w": 52
            },
            94: {
                "u": 48,
                "v": 49,
                "w": 17
            },
            95: {
                "u": 46,
                "v": 48,
                "w": 42
            },
            96: {
                "u": 48,
                "v": 51,
                "w": 90
            },
            97: {
                "u": 48,
                "v": 52,
                "w": 33
            },
            98: {
                "u": 49,
                "v": 53,
                "w": 55
            },
            99: {
                "u": 49,
                "v": 52,
                "w": 44
            },
            100: {
                "u": 50,
                "v": 53,
                "w": 28
            },
            101: {
                "u": 51,
                "v": 52,
                "w": 52
            },
            102: {
                "u": 32,
                "v": 48,
                "w": 75
            },
            103: {
                "u": 46,
                "v": 49,
                "w": 23
            },
            104: {
                "u": 45,
                "v": 44,
                "w": 47
            },
            105: {
                "u": 12,
                "v": 19,
                "w": 93
            },
            106: {
                "u": 22,
                "v": 23,
                "w": 33
            },
            107: {
                "u": 35,
                "v": 26,
                "w": 3
            },
            108: {
                "u": 35,
                "v": 25,
                "w": 98
            },
            109: {
                "u": 37,
                "v": 36,
                "w": 59
            },
            110: {
                "u": 37,
                "v": 39,
                "w": 39
            },
            111: {
                "u": 43,
                "v": 40,
                "w": 76
            },
            112: {
                "u": 35,
                "v": 43,
                "w": 83
            },
            113: {
                "u": 20,
                "v": 21,
                "w": 31
            },
            114: {
                "u": 44,
                "v": 43,
                "w": 20
            },
            115: {
                "u": 13,
                "v": 20,
                "w": 8
            },
            116: {
                "u": 20,
                "v": 10,
                "w": 99
            },
        }
    } else if (id == UNCONNECTED_GRAPH) {
        if (mode == VL) return {
            0: {
                "x": 400,
                "y": 65
            },
            1: {
                "x": 500,
                "y": 65
            },
            2: {
                "x": 300,
                "y": 95
            },
            3: {
                "x": 600,
                "y": 95
            },
            4: {
                "x": 400,
                "y": 125
            },
            5: {
                "x": 500,
                "y": 125
            }
        }
        // no edges in graph
        else if (mode == EL) return {

        }
    } else if (id == MVC_BRUTEFORCE_LARGE_GRAPH_1) {
        if (mode == VL) return {
            0: {
                "x": 220,
                "y": 80
            },
            1: {
                "x": 580,
                "y": 280
            },
            2: {
                "x": 680,
                "y": 100
            },
            3: {
                "x": 320,
                "y": 280
            },
            4: {
                "x": 420,
                "y": 80
            },
            5: {
                "x": 440,
                "y": 180
            },
            6: {
                "x": 680,
                "y": 180
            },
            7: {
                "x": 240,
                "y": 180
            },
            8: {
                "x": 580,
                "y": 40
            },
            9: {
                "x": 300,
                "y": 20
            },
            10: {
                "x": 560,
                "y": 140
            },
            11: {
                "x": 320,
                "y": 120
            }
        }

        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 11,
                "w": 1
            },
            1: {
                "u": 7,
                "v": 11,
                "w": 1
            },
            2: {
                "u": 0,
                "v": 7,
                "w": 1
            },
            3: {
                "u": 0,
                "v": 9,
                "w": 1
            },
            4: {
                "u": 3,
                "v": 7,
                "w": 1
            },
            5: {
                "u": 4,
                "v": 5,
                "w": 1
            },
            6: {
                "u": 3,
                "v": 5,
                "w": 1
            },
            7: {
                "u": 4,
                "v": 10,
                "w": 1
            },
            8: {
                "u": 5,
                "v": 10,
                "w": 1
            },
            9: {
                "u": 8,
                "v": 10,
                "w": 1
            },
            10: {
                "u": 1,
                "v": 10,
                "w": 1
            },
            11: {
                "u": 2,
                "v": 8,
                "w": 1
            },
            12: {
                "u": 2,
                "v": 10,
                "w": 1
            },
            13: {
                "u": 1,
                "v": 6,
                "w": 1
            },
            14: {
                "u": 6,
                "v": 10,
                "w": 1
            }
        }
    } else if (id == MVC_PSEUDOFOREST) {
        if (mode == VL) return {
            0: {
                "x": 220,
                "y": 200
            },
            1: {
                "x": 340,
                "y": 200
            },
            2: {
                "x": 420,
                "y": 120
            },
            3: {
                "x": 720,
                "y": 120
            },
            4: {
                "x": 600,
                "y": 180
            },
            5: {
                "x": 720,
                "y": 240
            },
            6: {
                "x": 540,
                "y": 100
            },
            7: {
                "x": 480,
                "y": 20
            },
            8: {
                "x": 260,
                "y": 120
            }
        }
        else if (mode == EL) return {
            0: {
                "u": 0,
                "v": 8,
                "w": 1
            },
            1: {
                "v": 1,
                "u": 8,
                "w": 1
            },
            2: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            3: {
                "u": 2,
                "v": 7,
                "w": 1
            },
            4: {
                "v": 6,
                "u": 7,
                "w": 1
            },
            5: {
                "v": 2,
                "u": 6,
                "w": 1
            },
            6: {
                "v": 4,
                "u": 6,
                "w": 1
            },
            7: {
                "v": 3,
                "u": 4,
                "w": 1
            },
            8: {
                "u": 4,
                "v": 5,
                "w": 1
            }
        }
    } else if (id == K4_BAR) {
        if (mode == VL) return {
            0: {
                "x": 400,
                "y": 25
            },
            1: {
                "x": 300,
                "y": 225
            },
            2: {
                "x": 500,
                "y": 225
            },
            3: {
                "x": 400,
                "y": 165
            },
        }
        if (mode == EL) return {
            // empty
        }
    } else if (id == K5_BAR) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 125
            },
            1: {
                "x": 640,
                "y": 125
            },
            2: {
                "x": 370,
                "y": 315
            },
            3: {
                "x": 470,
                "y": 25
            },
            4: {
                "x": 570,
                "y": 315
            },
        }
        if (mode == EL) return {
            // empty
        }
    } else if (id == MVC_MAX_CLIQUE_EXAMPLE) {
        if (mode == VL) return {
            0: {
                "x": 340,
                "y": 100
            },
            1: {
                "x": 460,
                "y": 40
            },
            2: {
                "x": 580,
                "y": 100
            },
            3: {
                "x": 580,
                "y": 220
            },
            4: {
                "x": 460,
                "y": 280
            },
            5: {
                "x": 340,
                "y": 220
            },
            6: {
                "x": 520,
                "y": 160
            },
            7: {
                "x": 280,
                "y": 160
            },
        }
        if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 1
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 1
            },
            2: {
                "u": 0,
                "v": 3,
                "w": 1
            },
            3: {
                "u": 0,
                "v": 4,
                "w": 1
            },
            4: {
                "u": 0,
                "v": 5,
                "w": 1
            },
            5: {
                "u": 0,
                "v": 6,
                "w": 1
            },
            6: {
                "u": 1,
                "v": 2,
                "w": 1
            },
            7: {
                "u": 1,
                "v": 3,
                "w": 1
            },
            8: {
                "u": 1,
                "v": 4,
                "w": 1
            },
            9: {
                "u": 1,
                "v": 5,
                "w": 1
            },
            10: {
                "u": 1,
                "v": 7,
                "w": 1
            },
            11: {
                "u": 2,
                "v": 3,
                "w": 1
            },
            12: {
                "u": 2,
                "v": 4,
                "w": 1
            },
            13: {
                "u": 2,
                "v": 5,
                "w": 1
            },
            14: {
                "u": 2,
                "v": 6,
                "w": 1
            },
            15: {
                "u": 3,
                "v": 4,
                "w": 1
            },
            16: {
                "u": 3,
                "v": 5,
                "w": 1
            },
            17: {
                "u": 3,
                "v": 6,
                "w": 1
            },
            18: {
                "u": 3,
                "v": 7,
                "w": 1
            },
            19: {
                "u": 4,
                "v": 5,
                "w": 1
            },
            20: {
                "u": 4,
                "v": 7,
                "w": 1
            },
            21: {
                "u": 5,
                "v": 6,
                "w": 1
            },
            22: {
                "u": 5,
                "v": 7,
                "w": 1
            },
            23: {
                "u": 6,
                "v": 7,
                "w": 1
            },
        }
    } else if (id == MVC_MAX_CLIQUE_EXAMPLE_BAR) {
        if (mode == VL) return {
            0: {
                "x": 340,
                "y": 100
            },
            1: {
                "x": 460,
                "y": 40
            },
            2: {
                "x": 580,
                "y": 100
            },
            3: {
                "x": 580,
                "y": 220
            },
            4: {
                "x": 460,
                "y": 280
            },
            5: {
                "x": 340,
                "y": 220
            },
            6: {
                "x": 520,
                "y": 160
            },
            7: {
                "x": 280,
                "y": 160
            },
        }
        if (mode == EL) return {
            0: {
                "u": 0,
                "v": 7,
                "w": 1
            },
            1: {
                "u": 1,
                "v": 6,
                "w": 1
            },
            2: {
                "u": 2,
                "v": 7,
                "w": 1
            },
            3: {
                "u": 4,
                "v": 6,
                "w": 1
            },
        }
    } else if (id == TSP_SMALL) {
        if (mode == VL) return {
            0: {
                "x": 300,
                "y": 240
            },
            1: {
                "x": 420,
                "y": 100
            },
            2: {
                "x": 460,
                "y": 280
            },
            3: {
                "x": 500,
                "y": 100
            },
            4: {
                "x": 540,
                "y": 320
            },
            5: {
                "x": 640,
                "y": 180
            },
            6: {
                "x": 390,
                "y": 200
            },
        }
        if (mode == EL) return {
            0: {
                "u": 0,
                "v": 1,
                "w": 18
            },
            1: {
                "u": 0,
                "v": 2,
                "w": 16
            },
            2: {
                "u": 0,
                "v": 3,
                "w": 24
            },
            3: {
                "u": 0,
                "v": 4,
                "w": 25
            },
            4: {
                "u": 0,
                "v": 5,
                "w": 35
            },
            5: {
                "u": 0,
                "v": 6,
                "w": 10
            },
            6: {
                "u": 1,
                "v": 2,
                "w": 18
            },
            7: {
                "u": 1,
                "v": 3,
                "w": 8
            },
            8: {
                "u": 1,
                "v": 4,
                "w": 25
            },
            9: {
                "u": 1,
                "v": 5,
                "w": 23
            },
            10: {
                "u": 1,
                "v": 6,
                "w": 10
            },
            11: {
                "u": 2,
                "v": 3,
                "w": 18
            },
            12: {
                "u": 2,
                "v": 4,
                "w": 9
            },
            13: {
                "u": 2,
                "v": 5,
                "w": 21
            },
            14: {
                "u": 2,
                "v": 6,
                "w": 11
            },
            15: {
                "u": 3,
                "v": 4,
                "w": 22
            },
            16: {
                "u": 3,
                "v": 5,
                "w": 16
            },
            17: {
                "u": 3,
                "v": 6,
                "w": 15
            },
            18: {
                "u": 4,
                "v": 5,
                "w": 17
            },
            19: {
                "u": 4,
                "v": 6,
                "w": 19
            },
            20: {
                "u": 5,
                "v": 6,
                "w": 25
            },
        }
    } else if (id == STEINER_TREE_1) {
        if (mode == VL) return {
            0: {
                'x': 260,
                'y': 100
            },
            1: {
                'x': 260,
                'y': 300
            },
            2: {
                'x': 700,
                'y': 200
            },
            3: {
                'x': 520,
                'y': 100
            },
            4: {
                'x': 520,
                'y': 300
            },
            5: {
                'x': 340,
                'y': 200
            },
            6: {
                'x': 460,
                'y': 200
            },
        }
        if (mode == EL) return {
            0: {
                'u': 5,
                'v': 6,
                'w': 12
            },
            1: {
                'u': 5,
                'v': 0,
                'w': 13
            },
            2: {
                'u': 6,
                'v': 3,
                'w': 12
            },
            3: {
                'u': 5,
                'v': 1,
                'w': 13
            },
            4: {
                'u': 6,
                'v': 4,
                'w': 12
            },
            5: {
                'u': 0,
                'v': 1,
                'w': 20
            },
            6: {
                'u': 4,
                'v': 3,
                'w': 20
            },
            7: {
                'u': 2,
                'v': 3,
                'w': 21
            },
            8: {
                'u': 6,
                'v': 0,
                'w': 22
            },
            9: {
                'u': 4,
                'v': 2,
                'w': 21
            },
            10: {
                'u': 6,
                'v': 1,
                'w': 22
            },
            11: {
                'u': 1,
                'v': 4,
                'w': 26
            },
            12: {
                'u': 2,
                'v': 6,
                'w': 24
            },
            13: {
                'u': 3,
                'v': 0,
                'w': 26
            },
        }
    } else if (id == STEINER_TREE_K5_OPT) {
        if (mode == VL) return {
            0: {
                'x': 280,
                'y': 140
            },
            1: {
                'x': 640,
                'y': 140
            },
            2: {
                'x': 360,
                'y': 320
            },
            3: {
                'x': 460,
                'y': 20
            },
            4: {
                'x': 560,
                'y': 320
            },
            5: {
                'x': 360,
                'y': 200
            },
            6: {
                'x': 460,
                'y': 120
            },
            7: {
                'x': 560,
                'y': 200
            },
        }
        if (mode == EL) return {
            0: {
                'u': 6,
                'v': 3,
                'w': 10
            },
            1: {
                'u': 5,
                'v': 0,
                'w': 10
            },
            2: {
                'u': 7,
                'v': 1,
                'w': 10
            },
            3: {
                'u': 5,
                'v': 6,
                'w': 13
            },
            4: {
                'u': 6,
                'v': 7,
                'w': 13
            },
            5: {
                'u': 5,
                'v': 2,
                'w': 12
            },
            6: {
                'u': 7,
                'v': 4,
                'w': 12
            },
            7: {
                'u': 2,
                'v': 4,
                'w': 20
            },
            8: {
                'u': 5,
                'v': 7,
                'w': 20
            },
            9: {
                'u': 6,
                'v': 0,
                'w': 18
            },
            10: {
                'u': 6,
                'v': 1,
                'w': 18
            },
            11: {
                'u': 3,
                'v': 5,
                'w': 21
            },
            12: {
                'u': 7,
                'v': 3,
                'w': 21
            },
            13: {
                'u': 0,
                'v': 3,
                'w': 22
            },
            14: {
                'u': 1,
                'v': 3,
                'w': 22
            },
            15: {
                'u': 0,
                'v': 2,
                'w': 20
            },
            16: {
                'u': 1,
                'v': 4,
                'w': 20
            },
            17: {
                'u': 5,
                'v': 4,
                'w': 23
            },
            18: {
                'u': 7,
                'v': 2,
                'w': 23
            },
            19: {
                'u': 6,
                'v': 2,
                'w': 22
            },
            20: {
                'u': 6,
                'v': 4,
                'w': 22
            },
            21: {
                'u': 5,
                'v': 1,
                'w': 29
            },
            22: {
                'u': 7,
                'v': 0,
                'w': 29
            },
            23: {
                'u': 2,
                'v': 3,
                'w': 32
            },
            24: {
                'u': 3,
                'v': 4,
                'w': 32
            },
            25: {
                'u': 0,
                'v': 4,
                'w': 33
            },
            26: {
                'u': 1,
                'v': 2,
                'w': 33
            },
            27: {
                'u': 0,
                'v': 1,
                'w': 36
            },
        }
    }
    if (mode == VL) return {}
    if (mode == EL) return {}
}

function getPointList(id) {
    var tempPointList = [];
    if (id == SQUARE) {
        tempPointList = [{
                "x": 400,
                "y": 100
            },
            {
                "x": 400,
                "y": 300
            },
            {
                "x": 600,
                "y": 100
            },
            {
                "x": 600,
                "y": 300
            },
        ];
    } else if (id == PENTAGON) {
        tempPointList = [{
                "x": 500,
                "y": 60
            },
            {
                "x": 580,
                "y": 120
            },
            {
                "x": 540,
                "y": 240
            },
            {
                "x": 460,
                "y": 240
            },
            {
                "x": 420,
                "y": 120
            },
            {
                "x": 500,
                "y": 160
            },
        ];
    } else if (id == CRESCENT_MOON) {
        tempPointList = [{
                "x": 500,
                "y": 60
            },
            {
                "x": 490,
                "y": 90
            },
            {
                "x": 450,
                "y": 95
            },
            {
                "x": 475,
                "y": 140
            },
            {
                "x": 425,
                "y": 145
            },
            {
                "x": 420,
                "y": 180
            },
            {
                "x": 470,
                "y": 180
            },
            {
                "x": 425,
                "y": 215
            },
            {
                "x": 475,
                "y": 220
            },
            {
                "x": 450,
                "y": 265
            },
            {
                "x": 490,
                "y": 270
            },
            {
                "x": 500,
                "y": 300
            },
        ];
    } else if (id == CIRCLE) {
        tempPointList = [{
                "x": 500,
                "y": 20
            },
            {
                "x": 590,
                "y": 50
            },
            {
                "x": 620,
                "y": 80
            },
            {
                "x": 650,
                "y": 170
            },
            {
                "x": 620,
                "y": 260
            },
            {
                "x": 590,
                "y": 290
            },
            {
                "x": 500,
                "y": 320
            },
            {
                "x": 410,
                "y": 290
            },
            {
                "x": 380,
                "y": 260
            },
            {
                "x": 350,
                "y": 170
            },
            {
                "x": 380,
                "y": 80
            },
            {
                "x": 410,
                "y": 50
            },
        ];
    } else if (id == CONCAVE) {
        tempPointList = [{
                "x": 150,
                "y": 330
            },
            {
                "x": 250,
                "y": 250
            },
            {
                "x": 550,
                "y": 330
            },
            {
                "x": 700,
                "y": 200
            },
            {
                "x": 550,
                "y": 50
            },
            {
                "x": 150,
                "y": 50
            },
        ];
    } else if (id == CONVEX) {
        tempPointList = [{
                "x": 150,
                "y": 330
            },
            {
                "x": 550,
                "y": 330
            },
            {
                "x": 700,
                "y": 200
            },
            {
                "x": 550,
                "y": 50
            },
            {
                "x": 150,
                "y": 50
            },
        ];
    } else if (id == MOUNTAIN) {
        tempPointList = [{
                "x": 150,
                "y": 330
            },
            {
                "x": 750,
                "y": 330
            },
            {
                "x": 650,
                "y": 50
            },
            {
                "x": 550,
                "y": 300
            },
            {
                "x": 450,
                "y": 50
            },
            {
                "x": 350,
                "y": 300
            },
            {
                "x": 250,
                "y": 50
            },
        ];
    } else if (id == MAZE) {
        // tempPointList = [
        //   {"x": 150, "y": 400},
        //   {"x": 500, "y": 400},
        //   {"x": 500, "y": 50},
        //   {"x": 150, "y": 50},
        //   {"x": 150, "y": 300},
        //   {"x": 400, "y": 300},
        //   {"x": 400, "y": 150},
        //   {"x": 250, "y": 150},
        //   {"x": 250, "y": 200},
        //   {"x": 350, "y": 200},
        //   {"x": 350, "y": 250},
        //   {"x": 200, "y": 250},
        //   {"x": 200, "y": 100},
        //   {"x": 450, "y": 100},
        //   {"x": 450, "y": 350},
        //   {"x": 150, "y": 350},
        // ]
        tempPointList = [{
                "x": 120,
                "y": 320
            },
            {
                "x": 400,
                "y": 320
            },
            {
                "x": 400,
                "y": 40
            },
            {
                "x": 120,
                "y": 40
            },
            {
                "x": 120,
                "y": 240
            },
            {
                "x": 320,
                "y": 240
            },
            {
                "x": 320,
                "y": 120
            },
            {
                "x": 200,
                "y": 120
            },
            {
                "x": 200,
                "y": 160
            },
            {
                "x": 280,
                "y": 160
            },
            {
                "x": 280,
                "y": 200
            },
            {
                "x": 160,
                "y": 200
            },
            {
                "x": 160,
                "y": 80
            },
            {
                "x": 360,
                "y": 80
            },
            {
                "x": 360,
                "y": 280
            },
            {
                "x": 120,
                "y": 280
            },
        ]
    } else if (id == STAR3) {
        // tempPointList = [
        //   {"x": 100, "y" :350},
        //   {"x": 225, "y": 250},
        //   {"x": 400, "y": 400},
        //   {"x": 275, "y": 225},
        //   {"x": 500, "y": 250},
        //   {"x": 250, "y": 175},
        //   {"x": 300, "y": 50},
        //   {"x": 200, "y": 150},
        //   {"x": 100, "y": 50},
        //   {"x": 175, "y": 225},
        // ]
        tempPointList = [{
                "x": 80,
                "y": 280
            },
            {
                "x": 180,
                "y": 200
            },
            {
                "x": 320,
                "y": 320
            },
            {
                "x": 220,
                "y": 180
            },
            {
                "x": 400,
                "y": 200
            },
            {
                "x": 200,
                "y": 140
            },
            {
                "x": 240,
                "y": 40
            },
            {
                "x": 160,
                "y": 120
            },
            {
                "x": 80,
                "y": 40
            },
            {
                "x": 140,
                "y": 180
            },
        ]
    } else if (id == GOALKEEPER) {
        tempPointList = [{
                "x": 80,
                "y": 280
            },
            {
                "x": 400,
                "y": 320
            },
            {
                "x": 700,
                "y": 340
            },
            {
                "x": 860,
                "y": 320
            },
            {
                "x": 820,
                "y": 280
            },
            {
                "x": 680,
                "y": 300
            },
            {
                "x": 680,
                "y": 180
            },
            {
                "x": 840,
                "y": 140
            },
            {
                "x": 820,
                "y": 60
            },
            {
                "x": 780,
                "y": 80
            },
            {
                "x": 800,
                "y": 120
            },
            {
                "x": 640,
                "y": 140
            },
            {
                "x": 580,
                "y": 180
            },
            {
                "x": 520,
                "y": 180
            },
            {
                "x": 480,
                "y": 60
            },
            {
                "x": 400,
                "y": 20
            },
            {
                "x": 240,
                "y": 40
            },
            {
                "x": 260,
                "y": 80
            },
            {
                "x": 420,
                "y": 60
            },
            {
                "x": 380,
                "y": 200
            },
            {
                "x": 300,
                "y": 100
            },
            {
                "x": 220,
                "y": 120
            },
            {
                "x": 240,
                "y": 180
            },
            {
                "x": 320,
                "y": 220
            },
            {
                "x": 280,
                "y": 260
            },
            {
                "x": 220,
                "y": 260
            },
            {
                "x": 100,
                "y": 240
            },
        ]
    } else if (id == FISH) {
        tempPointList = [{
                "x": 180,
                "y": 180
            },
            {
                "x": 240,
                "y": 220
            },
            {
                "x": 320,
                "y": 220
            },
            {
                "x": 380,
                "y": 200
            },
            {
                "x": 440,
                "y": 160
            },
            {
                "x": 480,
                "y": 180
            },
            {
                "x": 520,
                "y": 240
            },
            {
                "x": 520,
                "y": 20
            },
            {
                "x": 480,
                "y": 80
            },
            {
                "x": 440,
                "y": 100
            },
            {
                "x": 400,
                "y": 40
            },
            {
                "x": 340,
                "y": 20
            },
            {
                "x": 300,
                "y": 20
            },
            {
                "x": 260,
                "y": 40
            },
            {
                "x": 200,
                "y": 60
            },
            {
                "x": 180,
                "y": 80
            },
            {
                "x": 140,
                "y": 140
            },
        ]
    }

    return JSON.stringify(tempPointList);
}