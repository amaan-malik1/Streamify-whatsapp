import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { getFriendUser, getOutgoingReq, getRecommendedFriends, sendFriendRequest } from '../lib/api';
import NoFriendsFound from '../components/NoFriendsFound';
import FriendCard from '../components/FriendCard';
import { getLanguageFlag } from '../lib/getLanguageFlag'
import { Link } from 'react-router-dom';
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import { capitialize } from '../lib/utils';
// import { useThemeStore } from '../store/useThemeStore'

const Home = () => {
    const queryClient = useQueryClient();
    const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

    // get myFriends
    const { data: myFriends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ['friends'],
        queryFn: getFriendUser,
    });


    // recommendedFriends now always an array
    const {
        data: recommendedFriends = [],
        isLoading: loadingRecommendedUsers,
    } = useQuery({
        queryKey: ['recommendedFriends'],
        queryFn: getRecommendedFriends,
    });

    // outgoing requests
    const { data: outgoingReq = [] } = useQuery({
        queryKey: ['outgoingReq'],
        queryFn: getOutgoingReq,
    });

    //testing checks
    // console.log("Friends", myFriends);
    // console.log("Recommended", recommendedFriends);
    // console.log("Outgoing", outgoingReq);


    // send request
    const { mutate: sendRequestMutation, isPending } = useMutation({
        mutationFn: sendFriendRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outgoingReq'] }),
    });

    // track outgoing IDs
    useEffect(() => {
        const ids = new Set(outgoingReq.map((req) => req.recipient._id));
        setOutgoingRequestsIds(ids);
    }, [outgoingReq]);


    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto space-y-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
                    <Link to="/notification" className="btn btn-outline btn-sm">
                        <UsersIcon className="mr-2 size-4" />
                        Friend Requests
                    </Link>
                </div>

                {/* loading friend */}
                {
                    loadingFriends ? (
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : myFriends.length === 0 ? (
                        <NoFriendsFound />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {myFriends.map((friend) => (
                                <FriendCard key={friend._id} friend={friend} />
                            ))}
                        </div>
                    )
                }

                {/* recommendedFriends */}
                <section>
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                                <p className="opacity-70">
                                    Discover perfect language exchange partners based on your profile
                                </p>
                            </div>
                        </div>
                    </div>

                    {loadingRecommendedUsers ? (
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : (
                        recommendedFriends.length === 0 ? (
                            <div className="card bg-base-200 p-6 text-center">
                                <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
                                <p className="text-base-content opacity-70">
                                    Check back later for new language partners!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {recommendedFriends.map((user) => {
                                    const hasBeeenSent = outgoingRequestsIds.has(user._id);
                                    return (
                                        <div
                                            key={user._id}
                                            className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="card-body p-5 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar size-16 rounded-full">
                                                        <img src={user.profilePic} alt={user.fullName} />
                                                    </div>

                                                    <div>
                                                        <h3 className="font-semibold text-lg">{user.fullName}</h3>
                                                        {user.location && (
                                                            <div className="flex items-center text-xs opacity-70 mt-1">
                                                                <MapPinIcon className="size-3 mr-1" />
                                                                {user.location}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Languages with flags */}
                                                <div className="flex flex-wrap gap-1.5">
                                                    <span className="badge badge-secondary">
                                                        {getLanguageFlag(user.nativeLanguage)}
                                                        Native: {capitialize(user.nativeLanguage)}
                                                    </span>
                                                    <span className="badge badge-outline">
                                                        {getLanguageFlag(user.learningLanguage)}
                                                        Learning: {capitialize(user.learningLanguage)}
                                                    </span>
                                                </div>

                                                {/* user bio */}
                                                {user.bio && <p className='text-sm opacity-70
                                                '>{user.bio}</p>}

                                                {/* action button */}
                                                <button className={`btn w-full mt-2 
                                                    ${hasBeeenSent ? "btn-disabled" : "btn-primary"
                                                    }`}
                                                    onClick={() => sendRequestMutation(user._id)}
                                                    disabled={hasBeeenSent || isPending}
                                                >
                                                    {hasBeeenSent ? (<>
                                                        <CheckCircleIcon className="size-4 mr-2" />
                                                        Request Sent
                                                    </>
                                                    ) : (
                                                        <>
                                                            <UserPlusIcon className="size-4 mr-2" />
                                                            Send Friend Request
                                                        </>
                                                    )}

                                                </button>
                                            </div>

                                        </div>
                                    )


                                })}
                            </div>
                        )
                    )}
                </section>
            </div>
        </div>
    )
}

export default Home
