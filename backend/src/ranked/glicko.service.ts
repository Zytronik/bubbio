import { Injectable } from "@nestjs/common";

@Injectable()
export class GlickoService {
    private glicko2 = require('glicko2');
    public glicko = new this.glicko2.Glicko2({
        // tau : "Reasonable choices are between 0.3 and 1.2, though the system should
        //      be tested to decide which value results in greatest predictive accuracy."
        tau: 0.5,
        // rating : default rating
        rating: 1500,
        //rd : Default rating deviation 
        //     small number = good confidence on the rating accuracy
        rd: 350,
        //vol : Default volatility (expected fluctation on the player rating)
        vol: 0.06
    });
}