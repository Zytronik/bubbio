import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async getFriends(userId: number) {
        return this.prismaService.user.findUnique({
            where: { id: userId },
            select: {
                friendsAsUser: {
                    select: {
                        friend: {
                            select: {
                                id: true,
                                username: true,
                            }
                        },
                    },
                },
            },
        }).then(result => {
            return result.friendsAsUser.map(f => f.friend);
        });
    }

    async addFriend(userId: number, friendId: number): Promise<void> {
        if (userId === friendId) {
            throw new Error('Cant friend yourself.');
        }
    
        const existingFriendship = await this.prismaService.userFriendship.findUnique({
            where: {
                userId_friendId: {
                    userId,
                    friendId,
                },
            },
        });
    
        if (!existingFriendship) {
            await this.prismaService.userFriendship.create({
                data: {
                    userId,
                    friendId,
                },
            });
        }
    }
    

    async removeFriend(userId: number, friendId: number): Promise<void> {
        await this.prismaService.userFriendship.delete({
            where: {
                userId_friendId: {
                    userId,
                    friendId,
                },
            },
        }).catch(err => {
            throw new Error('Friendship could not be deleted.');
        });
    }

}