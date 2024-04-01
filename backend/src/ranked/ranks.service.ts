import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { ranks } from "./ranks";

@Injectable()
export class RanksService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) { }
    async getRankInfo(userId: number) {
        const percentile = await this.userService.getPercentile(userId);
        if (percentile < ranks.p_plus.percentile) {
            return {
                name: ranks.p_plus.name,
                ascii: ranks.p_plus.ascii,
                percentile: ranks.p_plus.percentile,
                iconName: ranks.p_plus.iconName,
                nextRank: {},
                prevRank: ranks.p_minus
            };
        }
        if (percentile < ranks.p_minus.percentile) {
            return {
                name: ranks.p_minus.name,
                ascii: ranks.p_minus.ascii,
                percentile: ranks.p_minus.percentile,
                iconName: ranks.p_minus.iconName,
                nextRank: ranks.p_plus,
                prevRank: ranks.w_plus
            };
        }
        if (percentile < ranks.w_plus.percentile) {
            return {
                name: ranks.w_plus.name,
                ascii: ranks.w_plus.ascii,
                percentile: ranks.w_plus.percentile,
                iconName: ranks.w_plus.iconName,
                nextRank: ranks.p_minus,
                prevRank: ranks.w_minus
            };
        }
        if (percentile < ranks.w_minus.percentile) {
            return {
                name: ranks.w_minus.name,
                ascii: ranks.w_minus.ascii,
                percentile: ranks.w_minus.percentile,
                iconName: ranks.w_minus.iconName,
                nextRank: ranks.w_plus,
                prevRank: ranks.s_plus
            };
        }
        if (percentile < ranks.s_plus.percentile) {
            return {
                name: ranks.s_plus.name,
                ascii: ranks.s_plus.ascii,
                percentile: ranks.s_plus.percentile,
                iconName: ranks.s_plus.iconName,
                nextRank: ranks.w_minus,
                prevRank: ranks.s_minus
            };
        }
        if (percentile < ranks.s_minus.percentile) {
            return {
                name: ranks.s_minus.name,
                ascii: ranks.s_minus.ascii,
                percentile: ranks.s_minus.percentile,
                iconName: ranks.s_minus.iconName,
                nextRank: ranks.s_plus,
                prevRank: ranks.a_plus
            };
        }
        if (percentile < ranks.a_plus.percentile) {
            return {
                name: ranks.a_plus.name,
                ascii: ranks.a_plus.ascii,
                percentile: ranks.a_plus.percentile,
                iconName: ranks.a_plus.iconName,
                nextRank: ranks.s_minus,
                prevRank: ranks.a_minus
            };
        }
        if (percentile < ranks.a_minus.percentile) {
            return {
                name: ranks.a_minus.name,
                ascii: ranks.a_minus.ascii,
                percentile: ranks.a_minus.percentile,
                iconName: ranks.a_minus.iconName,
                nextRank: ranks.a_plus,
                prevRank: ranks.b_plus
            };
        }
        if (percentile < ranks.b_plus.percentile) {
            return {
                name: ranks.b_plus.name,
                ascii: ranks.b_plus.ascii,
                percentile: ranks.b_plus.percentile,
                iconName: ranks.b_plus.iconName,
                nextRank: ranks.a_minus,
                prevRank: ranks.b_minus
            };
        }
        if (percentile < ranks.b_minus.percentile) {
            return {
                name: ranks.b_minus.name,
                ascii: ranks.b_minus.ascii,
                percentile: ranks.b_minus.percentile,
                iconName: ranks.b_minus.iconName,
                nextRank: ranks.b_plus,
                prevRank: ranks.c_plus
            };
        }
        if (percentile < ranks.c_plus.percentile) {
            return {
                name: ranks.c_plus.name,
                ascii: ranks.c_plus.ascii,
                percentile: ranks.c_plus.percentile,
                iconName: ranks.c_plus.iconName,
                nextRank: ranks.b_minus,
                prevRank: ranks.c_minus
            };
        }
        if (percentile < ranks.c_minus.percentile) {
            return {
                name: ranks.c_minus.name,
                ascii: ranks.c_minus.ascii,
                percentile: ranks.c_minus.percentile,
                iconName: ranks.c_minus.iconName,
                nextRank: ranks.c_plus,
                prevRank: ranks.d_plus
            };
        }
        if (percentile < ranks.d_plus.percentile) {
            return {
                name: ranks.d_plus.name,
                ascii: ranks.d_plus.ascii,
                percentile: ranks.d_plus.percentile,
                iconName: ranks.d_plus.iconName,
                nextRank: ranks.c_minus,
                prevRank: ranks.d_minus
            };
        }
        if (percentile < ranks.d_minus.percentile) {
            return {
                name: ranks.d_minus.name,
                ascii: ranks.d_minus.ascii,
                percentile: ranks.d_minus.percentile,
                iconName: ranks.d_minus.iconName,
                nextRank: ranks.d_plus,
                prevRank: ranks.e_plus
            };
        }
        if (percentile < ranks.e_plus.percentile) {
            return {
                name: ranks.e_plus.name,
                ascii: ranks.e_plus.ascii,
                percentile: ranks.e_plus.percentile,
                iconName: ranks.e_plus.iconName,
                nextRank: ranks.d_minus,
                prevRank: ranks.e_minus
            };
        }
        return {
            name: ranks.e_minus.name,
            ascii: ranks.e_minus.ascii,
            percentile: ranks.e_minus.percentile,
            iconName: ranks.e_minus.iconName,
            nextRank: ranks.e_plus,
            prevRank: {}
        };
    }
}