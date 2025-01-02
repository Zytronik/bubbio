import { useGameStore } from "@/stores/gameStore";
import { Coordinates } from "../_interface/game/coordinates";


export function angleUpdate(deltaTimeMS: number): void {
    for (const gameInstance of useGameStore().getAllInstances()) {
        const previousAngle = gameInstance.angle;
        const angleChange = gameInstance.aps * deltaTimeMS / 1000;
        if (gameInstance.left && !gameInstance.right) {
            gameInstance.angle = Number((previousAngle - angleChange).toFixed(2));
        } else if (!gameInstance.left && gameInstance.right) {
            gameInstance.angle = Number((previousAngle + angleChange).toFixed(2));
        }
    }
}

export function getVector(angle: number): Coordinates {
    const cleanAngle = cleanUpAngle(angle);
    return { x: cosTable[cleanAngle * 10], y: -sinTable[cleanAngle * 10] };
}

function cleanUpAngle(angle: number): number {
    const MIN_ANGLE = 12;
    const MAX_Angle = 168;
    if (angle < MIN_ANGLE) {
        return MIN_ANGLE;
    }
    else if (angle > MAX_Angle) {
        return MAX_Angle;
    }
    else {
        return Number(angle.toFixed(1));
    }
}

const cosTable: number[] = [
    -10000,
    -10000,
    -10000,
    -10000,
    -10000,
    -10000,
    -9999,
    -9999,
    -9999,
    -9999,
    -9998,
    -9998,
    -9998,
    -9997,
    -9997,
    -9997,
    -9996,
    -9996,
    -9995,
    -9995,
    -9994,
    -9993,
    -9993,
    -9992,
    -9991,
    -9990,
    -9990,
    -9989,
    -9988,
    -9987,
    -9986,
    -9985,
    -9984,
    -9983,
    -9982,
    -9981,
    -9980,
    -9979,
    -9978,
    -9977,
    -9976,
    -9974,
    -9973,
    -9972,
    -9971,
    -9969,
    -9968,
    -9966,
    -9965,
    -9963,
    -9962,
    -9960,
    -9959,
    -9957,
    -9956,
    -9954,
    -9952,
    -9951,
    -9949,
    -9947,
    -9945,
    -9943,
    -9942,
    -9940,
    -9938,
    -9936,
    -9934,
    -9932,
    -9930,
    -9928,
    -9925,
    -9923,
    -9921,
    -9919,
    -9917,
    -9914,
    -9912,
    -9910,
    -9907,
    -9905,
    -9903,
    -9900,
    -9898,
    -9895,
    -9893,
    -9890,
    -9888,
    -9885,
    -9882,
    -9880,
    -9877,
    -9874,
    -9871,
    -9869,
    -9866,
    -9863,
    -9860,
    -9857,
    -9854,
    -9851,
    -9848,
    -9845,
    -9842,
    -9839,
    -9836,
    -9833,
    -9829,
    -9826,
    -9823,
    -9820,
    -9816,
    -9813,
    -9810,
    -9806,
    -9803,
    -9799,
    -9796,
    -9792,
    -9789,
    -9785,
    -9781,
    -9778,
    -9774,
    -9770,
    -9767,
    -9763,
    -9759,
    -9755,
    -9751,
    -9748,
    -9744,
    -9740,
    -9736,
    -9732,
    -9728,
    -9724,
    -9720,
    -9715,
    -9711,
    -9707,
    -9703,
    -9699,
    -9694,
    -9690,
    -9686,
    -9681,
    -9677,
    -9673,
    -9668,
    -9664,
    -9659,
    -9655,
    -9650,
    -9646,
    -9641,
    -9636,
    -9632,
    -9627,
    -9622,
    -9617,
    -9613,
    -9608,
    -9603,
    -9598,
    -9593,
    -9588,
    -9583,
    -9578,
    -9573,
    -9568,
    -9563,
    -9558,
    -9553,
    -9548,
    -9542,
    -9537,
    -9532,
    -9527,
    -9521,
    -9516,
    -9511,
    -9505,
    -9500,
    -9494,
    -9489,
    -9483,
    -9478,
    -9472,
    -9466,
    -9461,
    -9455,
    -9449,
    -9444,
    -9438,
    -9432,
    -9426,
    -9421,
    -9415,
    -9409,
    -9403,
    -9397,
    -9391,
    -9385,
    -9379,
    -9373,
    -9367,
    -9361,
    -9354,
    -9348,
    -9342,
    -9336,
    -9330,
    -9323,
    -9317,
    -9311,
    -9304,
    -9298,
    -9291,
    -9285,
    -9278,
    -9272,
    -9265,
    -9259,
    -9252,
    -9245,
    -9239,
    -9232,
    -9225,
    -9219,
    -9212,
    -9205,
    -9198,
    -9191,
    -9184,
    -9178,
    -9171,
    -9164,
    -9157,
    -9150,
    -9143,
    -9135,
    -9128,
    -9121,
    -9114,
    -9107,
    -9100,
    -9092,
    -9085,
    -9078,
    -9070,
    -9063,
    -9056,
    -9048,
    -9041,
    -9033,
    -9026,
    -9018,
    -9011,
    -9003,
    -8996,
    -8988,
    -8980,
    -8973,
    -8965,
    -8957,
    -8949,
    -8942,
    -8934,
    -8926,
    -8918,
    -8910,
    -8902,
    -8894,
    -8886,
    -8878,
    -8870,
    -8862,
    -8854,
    -8846,
    -8838,
    -8829,
    -8821,
    -8813,
    -8805,
    -8796,
    -8788,
    -8780,
    -8771,
    -8763,
    -8755,
    -8746,
    -8738,
    -8729,
    -8721,
    -8712,
    -8704,
    -8695,
    -8686,
    -8678,
    -8669,
    -8660,
    -8652,
    -8643,
    -8634,
    -8625,
    -8616,
    -8607,
    -8599,
    -8590,
    -8581,
    -8572,
    -8563,
    -8554,
    -8545,
    -8536,
    -8526,
    -8517,
    -8508,
    -8499,
    -8490,
    -8480,
    -8471,
    -8462,
    -8453,
    -8443,
    -8434,
    -8425,
    -8415,
    -8406,
    -8396,
    -8387,
    -8377,
    -8368,
    -8358,
    -8348,
    -8339,
    -8329,
    -8320,
    -8310,
    -8300,
    -8290,
    -8281,
    -8271,
    -8261,
    -8251,
    -8241,
    -8231,
    -8221,
    -8211,
    -8202,
    -8192,
    -8181,
    -8171,
    -8161,
    -8151,
    -8141,
    -8131,
    -8121,
    -8111,
    -8100,
    -8090,
    -8080,
    -8070,
    -8059,
    -8049,
    -8039,
    -8028,
    -8018,
    -8007,
    -7997,
    -7986,
    -7976,
    -7965,
    -7955,
    -7944,
    -7934,
    -7923,
    -7912,
    -7902,
    -7891,
    -7880,
    -7869,
    -7859,
    -7848,
    -7837,
    -7826,
    -7815,
    -7804,
    -7793,
    -7782,
    -7771,
    -7760,
    -7749,
    -7738,
    -7727,
    -7716,
    -7705,
    -7694,
    -7683,
    -7672,
    -7660,
    -7649,
    -7638,
    -7627,
    -7615,
    -7604,
    -7593,
    -7581,
    -7570,
    -7559,
    -7547,
    -7536,
    -7524,
    -7513,
    -7501,
    -7490,
    -7478,
    -7466,
    -7455,
    -7443,
    -7431,
    -7420,
    -7408,
    -7396,
    -7385,
    -7373,
    -7361,
    -7349,
    -7337,
    -7325,
    -7314,
    -7302,
    -7290,
    -7278,
    -7266,
    -7254,
    -7242,
    -7230,
    -7218,
    -7206,
    -7193,
    -7181,
    -7169,
    -7157,
    -7145,
    -7133,
    -7120,
    -7108,
    -7096,
    -7083,
    -7071,
    -7059,
    -7046,
    -7034,
    -7022,
    -7009,
    -6997,
    -6984,
    -6972,
    -6959,
    -6947,
    -6934,
    -6921,
    -6909,
    -6896,
    -6884,
    -6871,
    -6858,
    -6845,
    -6833,
    -6820,
    -6807,
    -6794,
    -6782,
    -6769,
    -6756,
    -6743,
    -6730,
    -6717,
    -6704,
    -6691,
    -6678,
    -6665,
    -6652,
    -6639,
    -6626,
    -6613,
    -6600,
    -6587,
    -6574,
    -6561,
    -6547,
    -6534,
    -6521,
    -6508,
    -6494,
    -6481,
    -6468,
    -6455,
    -6441,
    -6428,
    -6414,
    -6401,
    -6388,
    -6374,
    -6361,
    -6347,
    -6334,
    -6320,
    -6307,
    -6293,
    -6280,
    -6266,
    -6252,
    -6239,
    -6225,
    -6211,
    -6198,
    -6184,
    -6170,
    -6157,
    -6143,
    -6129,
    -6115,
    -6101,
    -6088,
    -6074,
    -6060,
    -6046,
    -6032,
    -6018,
    -6004,
    -5990,
    -5976,
    -5962,
    -5948,
    -5934,
    -5920,
    -5906,
    -5892,
    -5878,
    -5864,
    -5850,
    -5835,
    -5821,
    -5807,
    -5793,
    -5779,
    -5764,
    -5750,
    -5736,
    -5721,
    -5707,
    -5693,
    -5678,
    -5664,
    -5650,
    -5635,
    -5621,
    -5606,
    -5592,
    -5577,
    -5563,
    -5548,
    -5534,
    -5519,
    -5505,
    -5490,
    -5476,
    -5461,
    -5446,
    -5432,
    -5417,
    -5402,
    -5388,
    -5373,
    -5358,
    -5344,
    -5329,
    -5314,
    -5299,
    -5284,
    -5270,
    -5255,
    -5240,
    -5225,
    -5210,
    -5195,
    -5180,
    -5165,
    -5150,
    -5135,
    -5120,
    -5105,
    -5090,
    -5075,
    -5060,
    -5045,
    -5030,
    -5015,
    -5000,
    -4985,
    -4970,
    -4955,
    -4939,
    -4924,
    -4909,
    -4894,
    -4879,
    -4863,
    -4848,
    -4833,
    -4818,
    -4802,
    -4787,
    -4772,
    -4756,
    -4741,
    -4726,
    -4710,
    -4695,
    -4679,
    -4664,
    -4648,
    -4633,
    -4617,
    -4602,
    -4586,
    -4571,
    -4555,
    -4540,
    -4524,
    -4509,
    -4493,
    -4478,
    -4462,
    -4446,
    -4431,
    -4415,
    -4399,
    -4384,
    -4368,
    -4352,
    -4337,
    -4321,
    -4305,
    -4289,
    -4274,
    -4258,
    -4242,
    -4226,
    -4210,
    -4195,
    -4179,
    -4163,
    -4147,
    -4131,
    -4115,
    -4099,
    -4083,
    -4067,
    -4051,
    -4035,
    -4019,
    -4003,
    -3987,
    -3971,
    -3955,
    -3939,
    -3923,
    -3907,
    -3891,
    -3875,
    -3859,
    -3843,
    -3827,
    -3811,
    -3795,
    -3778,
    -3762,
    -3746,
    -3730,
    -3714,
    -3697,
    -3681,
    -3665,
    -3649,
    -3633,
    -3616,
    -3600,
    -3584,
    -3567,
    -3551,
    -3535,
    -3518,
    -3502,
    -3486,
    -3469,
    -3453,
    -3437,
    -3420,
    -3404,
    -3387,
    -3371,
    -3355,
    -3338,
    -3322,
    -3305,
    -3289,
    -3272,
    -3256,
    -3239,
    -3223,
    -3206,
    -3190,
    -3173,
    -3156,
    -3140,
    -3123,
    -3107,
    -3090,
    -3074,
    -3057,
    -3040,
    -3024,
    -3007,
    -2990,
    -2974,
    -2957,
    -2940,
    -2924,
    -2907,
    -2890,
    -2874,
    -2857,
    -2840,
    -2823,
    -2807,
    -2790,
    -2773,
    -2756,
    -2740,
    -2723,
    -2706,
    -2689,
    -2672,
    -2656,
    -2639,
    -2622,
    -2605,
    -2588,
    -2571,
    -2554,
    -2538,
    -2521,
    -2504,
    -2487,
    -2470,
    -2453,
    -2436,
    -2419,
    -2402,
    -2385,
    -2368,
    -2351,
    -2334,
    -2317,
    -2300,
    -2284,
    -2267,
    -2250,
    -2233,
    -2215,
    -2198,
    -2181,
    -2164,
    -2147,
    -2130,
    -2113,
    -2096,
    -2079,
    -2062,
    -2045,
    -2028,
    -2011,
    -1994,
    -1977,
    -1959,
    -1942,
    -1925,
    -1908,
    -1891,
    -1874,
    -1857,
    -1840,
    -1822,
    -1805,
    -1788,
    -1771,
    -1754,
    -1736,
    -1719,
    -1702,
    -1685,
    -1668,
    -1650,
    -1633,
    -1616,
    -1599,
    -1582,
    -1564,
    -1547,
    -1530,
    -1513,
    -1495,
    -1478,
    -1461,
    -1444,
    -1426,
    -1409,
    -1392,
    -1374,
    -1357,
    -1340,
    -1323,
    -1305,
    -1288,
    -1271,
    -1253,
    -1236,
    -1219,
    -1201,
    -1184,
    -1167,
    -1149,
    -1132,
    -1115,
    -1097,
    -1080,
    -1063,
    -1045,
    -1028,
    -1011,
    -993,
    -976,
    -958,
    -941,
    -924,
    -906,
    -889,
    -872,
    -854,
    -837,
    -819,
    -802,
    -785,
    -767,
    -750,
    -732,
    -715,
    -698,
    -680,
    -663,
    -645,
    -628,
    -610,
    -593,
    -576,
    -558,
    -541,
    -523,
    -506,
    -488,
    -471,
    -454,
    -436,
    -419,
    -401,
    -384,
    -366,
    -349,
    -332,
    -314,
    -297,
    -279,
    -262,
    -244,
    -227,
    -209,
    -192,
    -175,
    -157,
    -140,
    -122,
    -105,
    -87,
    -70,
    -52,
    -35,
    -17,
    0,
    17,
    35,
    52,
    70,
    87,
    105,
    122,
    140,
    157,
    175,
    192,
    209,
    227,
    244,
    262,
    279,
    297,
    314,
    332,
    349,
    366,
    384,
    401,
    419,
    436,
    454,
    471,
    488,
    506,
    523,
    541,
    558,
    576,
    593,
    610,
    628,
    645,
    663,
    680,
    698,
    715,
    732,
    750,
    767,
    785,
    802,
    819,
    837,
    854,
    872,
    889,
    906,
    924,
    941,
    958,
    976,
    993,
    1011,
    1028,
    1045,
    1063,
    1080,
    1097,
    1115,
    1132,
    1149,
    1167,
    1184,
    1201,
    1219,
    1236,
    1253,
    1271,
    1288,
    1305,
    1323,
    1340,
    1357,
    1374,
    1392,
    1409,
    1426,
    1444,
    1461,
    1478,
    1495,
    1513,
    1530,
    1547,
    1564,
    1582,
    1599,
    1616,
    1633,
    1650,
    1668,
    1685,
    1702,
    1719,
    1736,
    1754,
    1771,
    1788,
    1805,
    1822,
    1840,
    1857,
    1874,
    1891,
    1908,
    1925,
    1942,
    1959,
    1977,
    1994,
    2011,
    2028,
    2045,
    2062,
    2079,
    2096,
    2113,
    2130,
    2147,
    2164,
    2181,
    2198,
    2215,
    2233,
    2250,
    2267,
    2284,
    2300,
    2317,
    2334,
    2351,
    2368,
    2385,
    2402,
    2419,
    2436,
    2453,
    2470,
    2487,
    2504,
    2521,
    2538,
    2554,
    2571,
    2588,
    2605,
    2622,
    2639,
    2656,
    2672,
    2689,
    2706,
    2723,
    2740,
    2756,
    2773,
    2790,
    2807,
    2823,
    2840,
    2857,
    2874,
    2890,
    2907,
    2924,
    2940,
    2957,
    2974,
    2990,
    3007,
    3024,
    3040,
    3057,
    3074,
    3090,
    3107,
    3123,
    3140,
    3156,
    3173,
    3190,
    3206,
    3223,
    3239,
    3256,
    3272,
    3289,
    3305,
    3322,
    3338,
    3355,
    3371,
    3387,
    3404,
    3420,
    3437,
    3453,
    3469,
    3486,
    3502,
    3518,
    3535,
    3551,
    3567,
    3584,
    3600,
    3616,
    3633,
    3649,
    3665,
    3681,
    3697,
    3714,
    3730,
    3746,
    3762,
    3778,
    3795,
    3811,
    3827,
    3843,
    3859,
    3875,
    3891,
    3907,
    3923,
    3939,
    3955,
    3971,
    3987,
    4003,
    4019,
    4035,
    4051,
    4067,
    4083,
    4099,
    4115,
    4131,
    4147,
    4163,
    4179,
    4195,
    4210,
    4226,
    4242,
    4258,
    4274,
    4289,
    4305,
    4321,
    4337,
    4352,
    4368,
    4384,
    4399,
    4415,
    4431,
    4446,
    4462,
    4478,
    4493,
    4509,
    4524,
    4540,
    4555,
    4571,
    4586,
    4602,
    4617,
    4633,
    4648,
    4664,
    4679,
    4695,
    4710,
    4726,
    4741,
    4756,
    4772,
    4787,
    4802,
    4818,
    4833,
    4848,
    4863,
    4879,
    4894,
    4909,
    4924,
    4939,
    4955,
    4970,
    4985,
    5000,
    5015,
    5030,
    5045,
    5060,
    5075,
    5090,
    5105,
    5120,
    5135,
    5150,
    5165,
    5180,
    5195,
    5210,
    5225,
    5240,
    5255,
    5270,
    5284,
    5299,
    5314,
    5329,
    5344,
    5358,
    5373,
    5388,
    5402,
    5417,
    5432,
    5446,
    5461,
    5476,
    5490,
    5505,
    5519,
    5534,
    5548,
    5563,
    5577,
    5592,
    5606,
    5621,
    5635,
    5650,
    5664,
    5678,
    5693,
    5707,
    5721,
    5736,
    5750,
    5764,
    5779,
    5793,
    5807,
    5821,
    5835,
    5850,
    5864,
    5878,
    5892,
    5906,
    5920,
    5934,
    5948,
    5962,
    5976,
    5990,
    6004,
    6018,
    6032,
    6046,
    6060,
    6074,
    6088,
    6101,
    6115,
    6129,
    6143,
    6157,
    6170,
    6184,
    6198,
    6211,
    6225,
    6239,
    6252,
    6266,
    6280,
    6293,
    6307,
    6320,
    6334,
    6347,
    6361,
    6374,
    6388,
    6401,
    6414,
    6428,
    6441,
    6455,
    6468,
    6481,
    6494,
    6508,
    6521,
    6534,
    6547,
    6561,
    6574,
    6587,
    6600,
    6613,
    6626,
    6639,
    6652,
    6665,
    6678,
    6691,
    6704,
    6717,
    6730,
    6743,
    6756,
    6769,
    6782,
    6794,
    6807,
    6820,
    6833,
    6845,
    6858,
    6871,
    6884,
    6896,
    6909,
    6921,
    6934,
    6947,
    6959,
    6972,
    6984,
    6997,
    7009,
    7022,
    7034,
    7046,
    7059,
    7071,
    7083,
    7096,
    7108,
    7120,
    7133,
    7145,
    7157,
    7169,
    7181,
    7193,
    7206,
    7218,
    7230,
    7242,
    7254,
    7266,
    7278,
    7290,
    7302,
    7314,
    7325,
    7337,
    7349,
    7361,
    7373,
    7385,
    7396,
    7408,
    7420,
    7431,
    7443,
    7455,
    7466,
    7478,
    7490,
    7501,
    7513,
    7524,
    7536,
    7547,
    7559,
    7570,
    7581,
    7593,
    7604,
    7615,
    7627,
    7638,
    7649,
    7660,
    7672,
    7683,
    7694,
    7705,
    7716,
    7727,
    7738,
    7749,
    7760,
    7771,
    7782,
    7793,
    7804,
    7815,
    7826,
    7837,
    7848,
    7859,
    7869,
    7880,
    7891,
    7902,
    7912,
    7923,
    7934,
    7944,
    7955,
    7965,
    7976,
    7986,
    7997,
    8007,
    8018,
    8028,
    8039,
    8049,
    8059,
    8070,
    8080,
    8090,
    8100,
    8111,
    8121,
    8131,
    8141,
    8151,
    8161,
    8171,
    8181,
    8192,
    8202,
    8211,
    8221,
    8231,
    8241,
    8251,
    8261,
    8271,
    8281,
    8290,
    8300,
    8310,
    8320,
    8329,
    8339,
    8348,
    8358,
    8368,
    8377,
    8387,
    8396,
    8406,
    8415,
    8425,
    8434,
    8443,
    8453,
    8462,
    8471,
    8480,
    8490,
    8499,
    8508,
    8517,
    8526,
    8536,
    8545,
    8554,
    8563,
    8572,
    8581,
    8590,
    8599,
    8607,
    8616,
    8625,
    8634,
    8643,
    8652,
    8660,
    8669,
    8678,
    8686,
    8695,
    8704,
    8712,
    8721,
    8729,
    8738,
    8746,
    8755,
    8763,
    8771,
    8780,
    8788,
    8796,
    8805,
    8813,
    8821,
    8829,
    8838,
    8846,
    8854,
    8862,
    8870,
    8878,
    8886,
    8894,
    8902,
    8910,
    8918,
    8926,
    8934,
    8942,
    8949,
    8957,
    8965,
    8973,
    8980,
    8988,
    8996,
    9003,
    9011,
    9018,
    9026,
    9033,
    9041,
    9048,
    9056,
    9063,
    9070,
    9078,
    9085,
    9092,
    9100,
    9107,
    9114,
    9121,
    9128,
    9135,
    9143,
    9150,
    9157,
    9164,
    9171,
    9178,
    9184,
    9191,
    9198,
    9205,
    9212,
    9219,
    9225,
    9232,
    9239,
    9245,
    9252,
    9259,
    9265,
    9272,
    9278,
    9285,
    9291,
    9298,
    9304,
    9311,
    9317,
    9323,
    9330,
    9336,
    9342,
    9348,
    9354,
    9361,
    9367,
    9373,
    9379,
    9385,
    9391,
    9397,
    9403,
    9409,
    9415,
    9421,
    9426,
    9432,
    9438,
    9444,
    9449,
    9455,
    9461,
    9466,
    9472,
    9478,
    9483,
    9489,
    9494,
    9500,
    9505,
    9511,
    9516,
    9521,
    9527,
    9532,
    9537,
    9542,
    9548,
    9553,
    9558,
    9563,
    9568,
    9573,
    9578,
    9583,
    9588,
    9593,
    9598,
    9603,
    9608,
    9613,
    9617,
    9622,
    9627,
    9632,
    9636,
    9641,
    9646,
    9650,
    9655,
    9659,
    9664,
    9668,
    9673,
    9677,
    9681,
    9686,
    9690,
    9694,
    9699,
    9703,
    9707,
    9711,
    9715,
    9720,
    9724,
    9728,
    9732,
    9736,
    9740,
    9744,
    9748,
    9751,
    9755,
    9759,
    9763,
    9767,
    9770,
    9774,
    9778,
    9781,
    9785,
    9789,
    9792,
    9796,
    9799,
    9803,
    9806,
    9810,
    9813,
    9816,
    9820,
    9823,
    9826,
    9829,
    9833,
    9836,
    9839,
    9842,
    9845,
    9848,
    9851,
    9854,
    9857,
    9860,
    9863,
    9866,
    9869,
    9871,
    9874,
    9877,
    9880,
    9882,
    9885,
    9888,
    9890,
    9893,
    9895,
    9898,
    9900,
    9903,
    9905,
    9907,
    9910,
    9912,
    9914,
    9917,
    9919,
    9921,
    9923,
    9925,
    9928,
    9930,
    9932,
    9934,
    9936,
    9938,
    9940,
    9942,
    9943,
    9945,
    9947,
    9949,
    9951,
    9952,
    9954,
    9956,
    9957,
    9959,
    9960,
    9962,
    9963,
    9965,
    9966,
    9968,
    9969,
    9971,
    9972,
    9973,
    9974,
    9976,
    9977,
    9978,
    9979,
    9980,
    9981,
    9982,
    9983,
    9984,
    9985,
    9986,
    9987,
    9988,
    9989,
    9990,
    9990,
    9991,
    9992,
    9993,
    9993,
    9994,
    9995,
    9995,
    9996,
    9996,
    9997,
    9997,
    9997,
    9998,
    9998,
    9998,
    9999,
    9999,
    9999,
    9999,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000
]
const sinTable: number[] = [
    0,
    17,
    35,
    52,
    70,
    87,
    105,
    122,
    140,
    157,
    175,
    192,
    209,
    227,
    244,
    262,
    279,
    297,
    314,
    332,
    349,
    366,
    384,
    401,
    419,
    436,
    454,
    471,
    488,
    506,
    523,
    541,
    558,
    576,
    593,
    610,
    628,
    645,
    663,
    680,
    698,
    715,
    732,
    750,
    767,
    785,
    802,
    819,
    837,
    854,
    872,
    889,
    906,
    924,
    941,
    958,
    976,
    993,
    1011,
    1028,
    1045,
    1063,
    1080,
    1097,
    1115,
    1132,
    1149,
    1167,
    1184,
    1201,
    1219,
    1236,
    1253,
    1271,
    1288,
    1305,
    1323,
    1340,
    1357,
    1374,
    1392,
    1409,
    1426,
    1444,
    1461,
    1478,
    1495,
    1513,
    1530,
    1547,
    1564,
    1582,
    1599,
    1616,
    1633,
    1650,
    1668,
    1685,
    1702,
    1719,
    1736,
    1754,
    1771,
    1788,
    1805,
    1822,
    1840,
    1857,
    1874,
    1891,
    1908,
    1925,
    1942,
    1959,
    1977,
    1994,
    2011,
    2028,
    2045,
    2062,
    2079,
    2096,
    2113,
    2130,
    2147,
    2164,
    2181,
    2198,
    2215,
    2233,
    2250,
    2267,
    2284,
    2300,
    2317,
    2334,
    2351,
    2368,
    2385,
    2402,
    2419,
    2436,
    2453,
    2470,
    2487,
    2504,
    2521,
    2538,
    2554,
    2571,
    2588,
    2605,
    2622,
    2639,
    2656,
    2672,
    2689,
    2706,
    2723,
    2740,
    2756,
    2773,
    2790,
    2807,
    2823,
    2840,
    2857,
    2874,
    2890,
    2907,
    2924,
    2940,
    2957,
    2974,
    2990,
    3007,
    3024,
    3040,
    3057,
    3074,
    3090,
    3107,
    3123,
    3140,
    3156,
    3173,
    3190,
    3206,
    3223,
    3239,
    3256,
    3272,
    3289,
    3305,
    3322,
    3338,
    3355,
    3371,
    3387,
    3404,
    3420,
    3437,
    3453,
    3469,
    3486,
    3502,
    3518,
    3535,
    3551,
    3567,
    3584,
    3600,
    3616,
    3633,
    3649,
    3665,
    3681,
    3697,
    3714,
    3730,
    3746,
    3762,
    3778,
    3795,
    3811,
    3827,
    3843,
    3859,
    3875,
    3891,
    3907,
    3923,
    3939,
    3955,
    3971,
    3987,
    4003,
    4019,
    4035,
    4051,
    4067,
    4083,
    4099,
    4115,
    4131,
    4147,
    4163,
    4179,
    4195,
    4210,
    4226,
    4242,
    4258,
    4274,
    4289,
    4305,
    4321,
    4337,
    4352,
    4368,
    4384,
    4399,
    4415,
    4431,
    4446,
    4462,
    4478,
    4493,
    4509,
    4524,
    4540,
    4555,
    4571,
    4586,
    4602,
    4617,
    4633,
    4648,
    4664,
    4679,
    4695,
    4710,
    4726,
    4741,
    4756,
    4772,
    4787,
    4802,
    4818,
    4833,
    4848,
    4863,
    4879,
    4894,
    4909,
    4924,
    4939,
    4955,
    4970,
    4985,
    5000,
    5015,
    5030,
    5045,
    5060,
    5075,
    5090,
    5105,
    5120,
    5135,
    5150,
    5165,
    5180,
    5195,
    5210,
    5225,
    5240,
    5255,
    5270,
    5284,
    5299,
    5314,
    5329,
    5344,
    5358,
    5373,
    5388,
    5402,
    5417,
    5432,
    5446,
    5461,
    5476,
    5490,
    5505,
    5519,
    5534,
    5548,
    5563,
    5577,
    5592,
    5606,
    5621,
    5635,
    5650,
    5664,
    5678,
    5693,
    5707,
    5721,
    5736,
    5750,
    5764,
    5779,
    5793,
    5807,
    5821,
    5835,
    5850,
    5864,
    5878,
    5892,
    5906,
    5920,
    5934,
    5948,
    5962,
    5976,
    5990,
    6004,
    6018,
    6032,
    6046,
    6060,
    6074,
    6088,
    6101,
    6115,
    6129,
    6143,
    6157,
    6170,
    6184,
    6198,
    6211,
    6225,
    6239,
    6252,
    6266,
    6280,
    6293,
    6307,
    6320,
    6334,
    6347,
    6361,
    6374,
    6388,
    6401,
    6414,
    6428,
    6441,
    6455,
    6468,
    6481,
    6494,
    6508,
    6521,
    6534,
    6547,
    6561,
    6574,
    6587,
    6600,
    6613,
    6626,
    6639,
    6652,
    6665,
    6678,
    6691,
    6704,
    6717,
    6730,
    6743,
    6756,
    6769,
    6782,
    6794,
    6807,
    6820,
    6833,
    6845,
    6858,
    6871,
    6884,
    6896,
    6909,
    6921,
    6934,
    6947,
    6959,
    6972,
    6984,
    6997,
    7009,
    7022,
    7034,
    7046,
    7059,
    7071,
    7083,
    7096,
    7108,
    7120,
    7133,
    7145,
    7157,
    7169,
    7181,
    7193,
    7206,
    7218,
    7230,
    7242,
    7254,
    7266,
    7278,
    7290,
    7302,
    7314,
    7325,
    7337,
    7349,
    7361,
    7373,
    7385,
    7396,
    7408,
    7420,
    7431,
    7443,
    7455,
    7466,
    7478,
    7490,
    7501,
    7513,
    7524,
    7536,
    7547,
    7559,
    7570,
    7581,
    7593,
    7604,
    7615,
    7627,
    7638,
    7649,
    7660,
    7672,
    7683,
    7694,
    7705,
    7716,
    7727,
    7738,
    7749,
    7760,
    7771,
    7782,
    7793,
    7804,
    7815,
    7826,
    7837,
    7848,
    7859,
    7869,
    7880,
    7891,
    7902,
    7912,
    7923,
    7934,
    7944,
    7955,
    7965,
    7976,
    7986,
    7997,
    8007,
    8018,
    8028,
    8039,
    8049,
    8059,
    8070,
    8080,
    8090,
    8100,
    8111,
    8121,
    8131,
    8141,
    8151,
    8161,
    8171,
    8181,
    8192,
    8202,
    8211,
    8221,
    8231,
    8241,
    8251,
    8261,
    8271,
    8281,
    8290,
    8300,
    8310,
    8320,
    8329,
    8339,
    8348,
    8358,
    8368,
    8377,
    8387,
    8396,
    8406,
    8415,
    8425,
    8434,
    8443,
    8453,
    8462,
    8471,
    8480,
    8490,
    8499,
    8508,
    8517,
    8526,
    8536,
    8545,
    8554,
    8563,
    8572,
    8581,
    8590,
    8599,
    8607,
    8616,
    8625,
    8634,
    8643,
    8652,
    8660,
    8669,
    8678,
    8686,
    8695,
    8704,
    8712,
    8721,
    8729,
    8738,
    8746,
    8755,
    8763,
    8771,
    8780,
    8788,
    8796,
    8805,
    8813,
    8821,
    8829,
    8838,
    8846,
    8854,
    8862,
    8870,
    8878,
    8886,
    8894,
    8902,
    8910,
    8918,
    8926,
    8934,
    8942,
    8949,
    8957,
    8965,
    8973,
    8980,
    8988,
    8996,
    9003,
    9011,
    9018,
    9026,
    9033,
    9041,
    9048,
    9056,
    9063,
    9070,
    9078,
    9085,
    9092,
    9100,
    9107,
    9114,
    9121,
    9128,
    9135,
    9143,
    9150,
    9157,
    9164,
    9171,
    9178,
    9184,
    9191,
    9198,
    9205,
    9212,
    9219,
    9225,
    9232,
    9239,
    9245,
    9252,
    9259,
    9265,
    9272,
    9278,
    9285,
    9291,
    9298,
    9304,
    9311,
    9317,
    9323,
    9330,
    9336,
    9342,
    9348,
    9354,
    9361,
    9367,
    9373,
    9379,
    9385,
    9391,
    9397,
    9403,
    9409,
    9415,
    9421,
    9426,
    9432,
    9438,
    9444,
    9449,
    9455,
    9461,
    9466,
    9472,
    9478,
    9483,
    9489,
    9494,
    9500,
    9505,
    9511,
    9516,
    9521,
    9527,
    9532,
    9537,
    9542,
    9548,
    9553,
    9558,
    9563,
    9568,
    9573,
    9578,
    9583,
    9588,
    9593,
    9598,
    9603,
    9608,
    9613,
    9617,
    9622,
    9627,
    9632,
    9636,
    9641,
    9646,
    9650,
    9655,
    9659,
    9664,
    9668,
    9673,
    9677,
    9681,
    9686,
    9690,
    9694,
    9699,
    9703,
    9707,
    9711,
    9715,
    9720,
    9724,
    9728,
    9732,
    9736,
    9740,
    9744,
    9748,
    9751,
    9755,
    9759,
    9763,
    9767,
    9770,
    9774,
    9778,
    9781,
    9785,
    9789,
    9792,
    9796,
    9799,
    9803,
    9806,
    9810,
    9813,
    9816,
    9820,
    9823,
    9826,
    9829,
    9833,
    9836,
    9839,
    9842,
    9845,
    9848,
    9851,
    9854,
    9857,
    9860,
    9863,
    9866,
    9869,
    9871,
    9874,
    9877,
    9880,
    9882,
    9885,
    9888,
    9890,
    9893,
    9895,
    9898,
    9900,
    9903,
    9905,
    9907,
    9910,
    9912,
    9914,
    9917,
    9919,
    9921,
    9923,
    9925,
    9928,
    9930,
    9932,
    9934,
    9936,
    9938,
    9940,
    9942,
    9943,
    9945,
    9947,
    9949,
    9951,
    9952,
    9954,
    9956,
    9957,
    9959,
    9960,
    9962,
    9963,
    9965,
    9966,
    9968,
    9969,
    9971,
    9972,
    9973,
    9974,
    9976,
    9977,
    9978,
    9979,
    9980,
    9981,
    9982,
    9983,
    9984,
    9985,
    9986,
    9987,
    9988,
    9989,
    9990,
    9990,
    9991,
    9992,
    9993,
    9993,
    9994,
    9995,
    9995,
    9996,
    9996,
    9997,
    9997,
    9997,
    9998,
    9998,
    9998,
    9999,
    9999,
    9999,
    9999,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    9999,
    9999,
    9999,
    9999,
    9998,
    9998,
    9998,
    9997,
    9997,
    9997,
    9996,
    9996,
    9995,
    9995,
    9994,
    9993,
    9993,
    9992,
    9991,
    9990,
    9990,
    9989,
    9988,
    9987,
    9986,
    9985,
    9984,
    9983,
    9982,
    9981,
    9980,
    9979,
    9978,
    9977,
    9976,
    9974,
    9973,
    9972,
    9971,
    9969,
    9968,
    9966,
    9965,
    9963,
    9962,
    9960,
    9959,
    9957,
    9956,
    9954,
    9952,
    9951,
    9949,
    9947,
    9945,
    9943,
    9942,
    9940,
    9938,
    9936,
    9934,
    9932,
    9930,
    9928,
    9925,
    9923,
    9921,
    9919,
    9917,
    9914,
    9912,
    9910,
    9907,
    9905,
    9903,
    9900,
    9898,
    9895,
    9893,
    9890,
    9888,
    9885,
    9882,
    9880,
    9877,
    9874,
    9871,
    9869,
    9866,
    9863,
    9860,
    9857,
    9854,
    9851,
    9848,
    9845,
    9842,
    9839,
    9836,
    9833,
    9829,
    9826,
    9823,
    9820,
    9816,
    9813,
    9810,
    9806,
    9803,
    9799,
    9796,
    9792,
    9789,
    9785,
    9781,
    9778,
    9774,
    9770,
    9767,
    9763,
    9759,
    9755,
    9751,
    9748,
    9744,
    9740,
    9736,
    9732,
    9728,
    9724,
    9720,
    9715,
    9711,
    9707,
    9703,
    9699,
    9694,
    9690,
    9686,
    9681,
    9677,
    9673,
    9668,
    9664,
    9659,
    9655,
    9650,
    9646,
    9641,
    9636,
    9632,
    9627,
    9622,
    9617,
    9613,
    9608,
    9603,
    9598,
    9593,
    9588,
    9583,
    9578,
    9573,
    9568,
    9563,
    9558,
    9553,
    9548,
    9542,
    9537,
    9532,
    9527,
    9521,
    9516,
    9511,
    9505,
    9500,
    9494,
    9489,
    9483,
    9478,
    9472,
    9466,
    9461,
    9455,
    9449,
    9444,
    9438,
    9432,
    9426,
    9421,
    9415,
    9409,
    9403,
    9397,
    9391,
    9385,
    9379,
    9373,
    9367,
    9361,
    9354,
    9348,
    9342,
    9336,
    9330,
    9323,
    9317,
    9311,
    9304,
    9298,
    9291,
    9285,
    9278,
    9272,
    9265,
    9259,
    9252,
    9245,
    9239,
    9232,
    9225,
    9219,
    9212,
    9205,
    9198,
    9191,
    9184,
    9178,
    9171,
    9164,
    9157,
    9150,
    9143,
    9135,
    9128,
    9121,
    9114,
    9107,
    9100,
    9092,
    9085,
    9078,
    9070,
    9063,
    9056,
    9048,
    9041,
    9033,
    9026,
    9018,
    9011,
    9003,
    8996,
    8988,
    8980,
    8973,
    8965,
    8957,
    8949,
    8942,
    8934,
    8926,
    8918,
    8910,
    8902,
    8894,
    8886,
    8878,
    8870,
    8862,
    8854,
    8846,
    8838,
    8829,
    8821,
    8813,
    8805,
    8796,
    8788,
    8780,
    8771,
    8763,
    8755,
    8746,
    8738,
    8729,
    8721,
    8712,
    8704,
    8695,
    8686,
    8678,
    8669,
    8660,
    8652,
    8643,
    8634,
    8625,
    8616,
    8607,
    8599,
    8590,
    8581,
    8572,
    8563,
    8554,
    8545,
    8536,
    8526,
    8517,
    8508,
    8499,
    8490,
    8480,
    8471,
    8462,
    8453,
    8443,
    8434,
    8425,
    8415,
    8406,
    8396,
    8387,
    8377,
    8368,
    8358,
    8348,
    8339,
    8329,
    8320,
    8310,
    8300,
    8290,
    8281,
    8271,
    8261,
    8251,
    8241,
    8231,
    8221,
    8211,
    8202,
    8192,
    8181,
    8171,
    8161,
    8151,
    8141,
    8131,
    8121,
    8111,
    8100,
    8090,
    8080,
    8070,
    8059,
    8049,
    8039,
    8028,
    8018,
    8007,
    7997,
    7986,
    7976,
    7965,
    7955,
    7944,
    7934,
    7923,
    7912,
    7902,
    7891,
    7880,
    7869,
    7859,
    7848,
    7837,
    7826,
    7815,
    7804,
    7793,
    7782,
    7771,
    7760,
    7749,
    7738,
    7727,
    7716,
    7705,
    7694,
    7683,
    7672,
    7660,
    7649,
    7638,
    7627,
    7615,
    7604,
    7593,
    7581,
    7570,
    7559,
    7547,
    7536,
    7524,
    7513,
    7501,
    7490,
    7478,
    7466,
    7455,
    7443,
    7431,
    7420,
    7408,
    7396,
    7385,
    7373,
    7361,
    7349,
    7337,
    7325,
    7314,
    7302,
    7290,
    7278,
    7266,
    7254,
    7242,
    7230,
    7218,
    7206,
    7193,
    7181,
    7169,
    7157,
    7145,
    7133,
    7120,
    7108,
    7096,
    7083,
    7071,
    7059,
    7046,
    7034,
    7022,
    7009,
    6997,
    6984,
    6972,
    6959,
    6947,
    6934,
    6921,
    6909,
    6896,
    6884,
    6871,
    6858,
    6845,
    6833,
    6820,
    6807,
    6794,
    6782,
    6769,
    6756,
    6743,
    6730,
    6717,
    6704,
    6691,
    6678,
    6665,
    6652,
    6639,
    6626,
    6613,
    6600,
    6587,
    6574,
    6561,
    6547,
    6534,
    6521,
    6508,
    6494,
    6481,
    6468,
    6455,
    6441,
    6428,
    6414,
    6401,
    6388,
    6374,
    6361,
    6347,
    6334,
    6320,
    6307,
    6293,
    6280,
    6266,
    6252,
    6239,
    6225,
    6211,
    6198,
    6184,
    6170,
    6157,
    6143,
    6129,
    6115,
    6101,
    6088,
    6074,
    6060,
    6046,
    6032,
    6018,
    6004,
    5990,
    5976,
    5962,
    5948,
    5934,
    5920,
    5906,
    5892,
    5878,
    5864,
    5850,
    5835,
    5821,
    5807,
    5793,
    5779,
    5764,
    5750,
    5736,
    5721,
    5707,
    5693,
    5678,
    5664,
    5650,
    5635,
    5621,
    5606,
    5592,
    5577,
    5563,
    5548,
    5534,
    5519,
    5505,
    5490,
    5476,
    5461,
    5446,
    5432,
    5417,
    5402,
    5388,
    5373,
    5358,
    5344,
    5329,
    5314,
    5299,
    5284,
    5270,
    5255,
    5240,
    5225,
    5210,
    5195,
    5180,
    5165,
    5150,
    5135,
    5120,
    5105,
    5090,
    5075,
    5060,
    5045,
    5030,
    5015,
    5000,
    4985,
    4970,
    4955,
    4939,
    4924,
    4909,
    4894,
    4879,
    4863,
    4848,
    4833,
    4818,
    4802,
    4787,
    4772,
    4756,
    4741,
    4726,
    4710,
    4695,
    4679,
    4664,
    4648,
    4633,
    4617,
    4602,
    4586,
    4571,
    4555,
    4540,
    4524,
    4509,
    4493,
    4478,
    4462,
    4446,
    4431,
    4415,
    4399,
    4384,
    4368,
    4352,
    4337,
    4321,
    4305,
    4289,
    4274,
    4258,
    4242,
    4226,
    4210,
    4195,
    4179,
    4163,
    4147,
    4131,
    4115,
    4099,
    4083,
    4067,
    4051,
    4035,
    4019,
    4003,
    3987,
    3971,
    3955,
    3939,
    3923,
    3907,
    3891,
    3875,
    3859,
    3843,
    3827,
    3811,
    3795,
    3778,
    3762,
    3746,
    3730,
    3714,
    3697,
    3681,
    3665,
    3649,
    3633,
    3616,
    3600,
    3584,
    3567,
    3551,
    3535,
    3518,
    3502,
    3486,
    3469,
    3453,
    3437,
    3420,
    3404,
    3387,
    3371,
    3355,
    3338,
    3322,
    3305,
    3289,
    3272,
    3256,
    3239,
    3223,
    3206,
    3190,
    3173,
    3156,
    3140,
    3123,
    3107,
    3090,
    3074,
    3057,
    3040,
    3024,
    3007,
    2990,
    2974,
    2957,
    2940,
    2924,
    2907,
    2890,
    2874,
    2857,
    2840,
    2823,
    2807,
    2790,
    2773,
    2756,
    2740,
    2723,
    2706,
    2689,
    2672,
    2656,
    2639,
    2622,
    2605,
    2588,
    2571,
    2554,
    2538,
    2521,
    2504,
    2487,
    2470,
    2453,
    2436,
    2419,
    2402,
    2385,
    2368,
    2351,
    2334,
    2317,
    2300,
    2284,
    2267,
    2250,
    2233,
    2215,
    2198,
    2181,
    2164,
    2147,
    2130,
    2113,
    2096,
    2079,
    2062,
    2045,
    2028,
    2011,
    1994,
    1977,
    1959,
    1942,
    1925,
    1908,
    1891,
    1874,
    1857,
    1840,
    1822,
    1805,
    1788,
    1771,
    1754,
    1736,
    1719,
    1702,
    1685,
    1668,
    1650,
    1633,
    1616,
    1599,
    1582,
    1564,
    1547,
    1530,
    1513,
    1495,
    1478,
    1461,
    1444,
    1426,
    1409,
    1392,
    1374,
    1357,
    1340,
    1323,
    1305,
    1288,
    1271,
    1253,
    1236,
    1219,
    1201,
    1184,
    1167,
    1149,
    1132,
    1115,
    1097,
    1080,
    1063,
    1045,
    1028,
    1011,
    993,
    976,
    958,
    941,
    924,
    906,
    889,
    872,
    854,
    837,
    819,
    802,
    785,
    767,
    750,
    732,
    715,
    698,
    680,
    663,
    645,
    628,
    610,
    593,
    576,
    558,
    541,
    523,
    506,
    488,
    471,
    454,
    436,
    419,
    401,
    384,
    366,
    349,
    332,
    314,
    297,
    279,
    262,
    244,
    227,
    209,
    192,
    175,
    157,
    140,
    122,
    105,
    87,
    70,
    52,
    35,
    17,
    0
]