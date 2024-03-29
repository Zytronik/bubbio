interface Rank {
    name: string;
    percentile: number;
    //minRating: number;
}

interface AllRanks {
    e_minus: Rank;
    e_plus: Rank;
    d_minus: Rank;
    d_plus: Rank;
    c_minus: Rank;
    c_plus: Rank;
    b_minus: Rank;
    b_plus: Rank;
    a_minus: Rank;
    a_plus: Rank;
    s_minus: Rank;
    s_plus: Rank;
    w_minus: Rank;
    w_plus: Rank;
    p_minus: Rank;
    p_plus: Rank;
}

export const ranks: AllRanks = {
    e_minus: {
        name: 'E-',
        percentile: 100,
    },
    e_plus: {
        name: 'E+',
        percentile: 95,
    },
    d_minus: {
        name: 'D-',
        percentile: 90,
    },
    d_plus: {
        name: 'D+',
        percentile: 84,
    },
    c_minus: {
        name: 'C-',
        percentile: 78,
    },
    c_plus: {
        name: 'C+',
        percentile: 70,
    },
    b_minus: {
        name: 'B-',
        percentile: 62,
    },
    b_plus: {
        name: 'B+',
        percentile: 54,
    },
    a_minus: {
        name: 'A-',
        percentile: 46,
    },
    a_plus: {
        name: 'A+',
        percentile: 38,
    },
    s_minus: {
        name: 'S-',
        percentile: 30,
    },
    s_plus: {
        name: 'S+',
        percentile: 23,
    },
    w_minus: {
        name: 'W-',
        percentile: 17,
    },
    w_plus: {
        name: 'W+',
        percentile: 11,
    },
    p_minus: {
        name: 'P-',
        percentile: 5,
    },
    p_plus: {
        name: 'P+',
        percentile: 1,
    },
};