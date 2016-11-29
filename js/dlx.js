/**
 * dlx.js
 * General purpose exact cover finder using Knuth's Dancing Links (Algorithm X)
 */


class Col {
    constructor(l, r, u, d, size, name) {
        this.l = l; // The left pointer
        this.r = r; // The right pointer
        this.u = u; // The up pointer
        this.d = d; // The down pointer
        this.s = size; // Number of rows with ones on this column
        this.n = name; // Identifies this column as part of the solution
    }
};

var root = new Col( /* where l=r=root*/ );

class Cell {
    constructor(l, r, u, d, col) {
        this.l = l; // The left pointer
        this.r = r; // The right pointer
        this.u = u; // The up pointer
        this.d = d; // The down pointer
        this.c = col; // Column pointer with this one
    }
};

function printSolution(O, k) {
    for (var j = 0; j < k; ++j) {
        // printRows(O[j].c.n, O[j].r.c.n, O[j].r.r.c.n, O[j].r.r.r.c.n, ...)
        var o = O[j];
        var i = o;
        while (i.r != o) {
            console.log(i.c.n);
        }
    }

    return false;
}

function cover(c) {
    c.r.l = c.l;
    c.l.r = c.r;

    var i = c.d;
    while (i != c) {

        var j = i.r;
        while (j != i) {
            j.d.u = j.u;
            j.u.d = j.d;
            j.c.s--;
            j = j.r;
        }

        i = i.d;
    }
}

function uncover(c) {
    var i = c.u;
    while (i != c) {

        var j = i.l;
        while (j != i) {
            j.c.s++;
            j.d.u = j;
            j.u.d = j;
            j = j.l;
        }

        i = i.u;
    }

    c.r.l = c;
    c.l.r = c;
}

function chooseColumn(h) {
    // Opt 1: pick columns with least one-rows first (lower branching factor)
    // TODO: Opt 2: if problem has geometrical structure, pick columns that constrain most area first
    // For instance, in the N queens problem should pick centermost columns first in pipe organ order
    var c = null;
    var s = Inf;
    var j = h.r;

    while (j != h) {
        if (j.s < s) {
            c = j;
            s = j.s;
        }

        j = j.r;
    }

    return c;
}

/**
 * Backtracking search using Knuth's Dancing links, works well on small, sparse problems.
 * Will call callback on each solution found, if callback returns true will halt.
 */
function search(h, O, k = 0, choose = chooseColumn, callback = printSolution) {
    // If no columns to uncover left, print solution
    if (h.r === h) {
        return callback(O, k);
    }

    // Choose column c (deterministically, with possibly more optimizations)
    c = choose(h);

    // TODO: slight opt 3: don't bother to cover columns with no rows
    cover(c);

    var r = c.d;
    while (r != c) {
        O[k] = r;

        // Hide the row
        j = r.r;
        while (j != r) {
            cover(j);
            j = r.r;
        }

        // Go one level deeper
        if (search(h, O, k + 1, choose, callback)) {
            return true;
        }

        // Reveal the row
        r = O[k]; // TODO: unnecessary statement?
        c = r.c;
        j = r.l;
        while (j != r) {
            uncover(j);
            j = r.l;
        }

        r = r.d;
    }

    // Backtrack
    uncover(c);
    return false;
}