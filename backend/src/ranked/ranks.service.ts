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
                nextRank: {},
                prevRank: {
                    name: ranks.p_minus.name,
                    ascii: ranks.p_minus.ascii,
                    percentile: ranks.p_minus.percentile
                }
            };
        }
        if (percentile < ranks.p_minus.percentile) {
            return {
                name: ranks.p_minus.name,
                ascii: ranks.p_minus.ascii,
                percentile: ranks.p_minus.percentile,
                nextRank: {
                    name: ranks.p_plus.name,
                    ascii: ranks.p_plus.ascii,
                    percentile: ranks.p_plus.percentile
                },
                prevRank: {
                    name: ranks.w_plus.name,
                    ascii: ranks.w_plus.ascii,
                    percentile: ranks.w_plus.percentile
                }
            };
        }
        if (percentile < ranks.w_plus.percentile) {
            return {
                name: ranks.w_plus.name,
                ascii: ranks.w_plus.ascii,
                percentile: ranks.w_plus.percentile,
                nextRank: {
                    name: ranks.p_minus.name,
                    ascii: ranks.p_minus.ascii,
                    percentile: ranks.p_minus.percentile
                },
                prevRank: {
                    name: ranks.w_minus.name,
                    ascii: ranks.w_minus.ascii,
                    percentile: ranks.w_minus.percentile
                }
            };
        }
        if (percentile < ranks.w_minus.percentile) {
            return {
                name: ranks.w_minus.name,
                ascii: ranks.w_minus.ascii,
                percentile: ranks.w_minus.percentile,
                nextRank: {
                    name: ranks.w_plus.name,
                    ascii: ranks.w_plus.ascii,
                    percentile: ranks.w_plus.percentile
                },
                prevRank: {
                    name: ranks.s_plus.name,
                    ascii: ranks.s_plus.ascii,
                    percentile: ranks.s_plus.percentile
                }
            };
        }
        if (percentile < ranks.s_plus.percentile) {
            return {
                name: ranks.s_plus.name,
                ascii: ranks.s_plus.ascii,
                percentile: ranks.s_plus.percentile,
                nextRank: {
                    name: ranks.w_minus.name,
                    ascii: ranks.w_minus.ascii,
                    percentile: ranks.w_minus.percentile
                },
                prevRank: {
                    name: ranks.s_minus.name,
                    ascii: ranks.s_minus.ascii,
                    percentile: ranks.s_minus.percentile
                }
            };
        }
        if (percentile < ranks.s_minus.percentile) {
            return {
                name: ranks.s_minus.name,
                ascii: ranks.s_minus.ascii,
                percentile: ranks.s_minus.percentile,
                nextRank: {
                    name: ranks.s_plus.name,
                    ascii: ranks.s_plus.ascii,
                    percentile: ranks.s_plus.percentile
                },
                prevRank: {
                    name: ranks.a_plus.name,
                    ascii: ranks.a_plus.ascii,
                    percentile: ranks.a_plus.percentile
                }
            };
        }
        if (percentile < ranks.a_plus.percentile) {
            return {
                name: ranks.a_plus.name,
                ascii: ranks.a_plus.ascii,
                percentile: ranks.a_plus.percentile,
                nextRank: {
                    name: ranks.s_minus.name,
                    ascii: ranks.s_minus.ascii,
                    percentile: ranks.s_minus.percentile
                },
                prevRank: {
                    name: ranks.a_minus.name,
                    ascii: ranks.a_minus.ascii,
                    percentile: ranks.a_minus.percentile
                }
            };
        }
        if (percentile < ranks.a_minus.percentile) {
            return {
                name: ranks.a_minus.name,
                ascii: ranks.a_minus.ascii,
                percentile: ranks.a_minus.percentile,
                nextRank: {
                    name: ranks.a_plus.name,
                    ascii: ranks.a_plus.ascii,
                    percentile: ranks.a_plus.percentile
                },
                prevRank: {
                    name: ranks.b_plus.name,
                    ascii: ranks.b_plus.ascii,
                    percentile: ranks.b_plus.percentile
                }
            };
        }
        if (percentile < ranks.b_plus.percentile) {
            return {
                name: ranks.b_plus.name,
                ascii: ranks.b_plus.ascii,
                percentile: ranks.b_plus.percentile,
                nextRank: {
                    name: ranks.a_minus.name,
                    ascii: ranks.a_minus.ascii,
                    percentile: ranks.a_minus.percentile
                },
                prevRank: {
                    name: ranks.b_minus.name,
                    ascii: ranks.b_minus.ascii,
                    percentile: ranks.b_minus.percentile
                }
            };
        }
        if (percentile < ranks.b_minus.percentile) {
            return {
                name: ranks.b_minus.name,
                ascii: ranks.b_minus.ascii,
                percentile: ranks.b_minus.percentile,
                nextRank: {
                    name: ranks.b_plus.name,
                    ascii: ranks.b_plus.ascii,
                    percentile: ranks.b_plus.percentile
                },
                prevRank: {
                    name: ranks.c_plus.name,
                    ascii: ranks.c_plus.ascii,
                    percentile: ranks.c_plus.percentile
                }
            };
        }
        if (percentile < ranks.c_plus.percentile) {
            return {
                name: ranks.c_plus.name,
                ascii: ranks.c_plus.ascii,
                percentile: ranks.c_plus.percentile,
                nextRank: {
                    name: ranks.b_minus.name,
                    ascii: ranks.b_minus.ascii,
                    percentile: ranks.b_minus.percentile
                },
                prevRank: {
                    name: ranks.c_minus.name,
                    ascii: ranks.c_minus.ascii,
                    percentile: ranks.c_minus.percentile
                }
            };
        }
        if (percentile < ranks.c_minus.percentile) {
            return {
                name: ranks.c_minus.name,
                ascii: ranks.c_minus.ascii,
                percentile: ranks.c_minus.percentile,
                nextRank: {
                    name: ranks.c_plus.name,
                    ascii: ranks.c_plus.ascii,
                    percentile: ranks.c_plus.percentile
                },
                prevRank: {
                    name: ranks.d_plus.name,
                    ascii: ranks.d_plus.ascii,
                    percentile: ranks.d_plus.percentile
                }
            };
        }
        if (percentile < ranks.d_plus.percentile) {
            return {
                name: ranks.d_plus.name,
                ascii: ranks.d_plus.ascii,
                percentile: ranks.d_plus.percentile,
                nextRank: {
                    name: ranks.c_minus.name,
                    ascii: ranks.c_minus.ascii,
                    percentile: ranks.c_minus.percentile
                },
                prevRank: {
                    name: ranks.d_minus.name,
                    ascii: ranks.d_minus.ascii,
                    percentile: ranks.d_minus.percentile
                }
            };
        }
        if (percentile < ranks.d_minus.percentile) {
            return {
                name: ranks.d_minus.name,
                ascii: ranks.d_minus.ascii,
                percentile: ranks.d_minus.percentile,
                nextRank: {
                    name: ranks.d_plus.name,
                    ascii: ranks.d_plus.ascii,
                    percentile: ranks.d_plus.percentile
                },
                prevRank: {
                    name: ranks.e_plus.name,
                    ascii: ranks.e_plus.ascii,
                    percentile: ranks.e_plus.percentile
                }
            };
        }
        if (percentile < ranks.e_plus.percentile) {
            return {
                name: ranks.e_plus.name,
                ascii: ranks.e_plus.ascii,
                percentile: ranks.e_plus.percentile,
                nextRank: {
                    name: ranks.d_minus.name,
                    ascii: ranks.d_minus.ascii,
                    percentile: ranks.d_minus.percentile
                },
                prevRank: {
                    name: ranks.e_minus.name,
                    ascii: ranks.e_minus.ascii,
                    percentile: ranks.e_minus.percentile
                }
            };
        }
        return {
            name: ranks.e_minus.name,
            ascii: ranks.e_minus.ascii,
            percentile: ranks.e_minus.percentile,
            nextRank: {
                name: ranks.e_plus.name,
                ascii: ranks.e_plus.ascii,
                percentile: ranks.e_plus.percentile
            },
            prevRank: {}
        };
    }
}