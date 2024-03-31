interface Rank {
    name: string;
    ascii: string;
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
        ascii: 'ε',
        percentile: 100,
    },
    e_plus: {
        name: 'E+',
        ascii: 'Ε',
        percentile: 95,
    },
    d_minus: {
        name: 'D-',
        ascii: 'δ',
        percentile: 90,
    },
    d_plus: {
        name: 'D+',
        ascii: 'Δ',
        percentile: 84,
    },
    c_minus: {
        name: 'C-',
        ascii: 'γ',
        percentile: 78,
    },
    c_plus: {
        name: 'C+',
        ascii: 'Γ',
        percentile: 70,
    },
    b_minus: {
        name: 'B-',
        ascii: 'β',
        percentile: 62,
    },
    b_plus: {
        name: 'B+',
        ascii: 'Β',
        percentile: 54,
    },
    a_minus: {
        name: 'A-',
        ascii: 'α',
        percentile: 46,
    },
    a_plus: {
        name: 'A+',
        ascii: 'Α',
        percentile: 38,
    },
    s_minus: {
        name: 'S-',
        ascii: 'ϱ',
        percentile: 30,
    },
    s_plus: {
        name: 'S+',
        ascii: 'Σ',
        percentile: 23,
    },
    w_minus: {
        name: 'W-',
        ascii: 'ω',
        percentile: 17,
    },
    w_plus: {
        name: 'W+',
        ascii: 'Ω',
        percentile: 11,
    },
    p_minus: {
        name: 'P-',
        ascii: 'π',
        percentile: 5,
    },
    p_plus: {
        name: 'P+',
        ascii: 'Π',
        percentile: 1,
    },
};