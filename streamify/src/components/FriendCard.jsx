import React from 'react'
import { getLanguageFlag } from '../lib/getLanguageFlag.jsx';
import { Link } from 'react-router-dom';

const FriendCard = ({ friend }) => {
    return (
        <div className="card bg-base-200 hover:shadow-md transition-shadow">
            <div className="card-body p-4">
                {/* USER INFO */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="avatar size-12">
                        <img src={friend.profilePic} alt={friend.fullName} />
                    </div>
                    <h3 className="font-semibold truncate">{friend.fullName}</h3>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                    {/* NATIVE LANGUAGE */}
                    <span className='badge badge-secondary text-xs'>
                        {getLanguageFlag(friend.nativeLanguage)}
                        Native: {friend.nativeLanguage}
                    </span>

                    {/* LEARNING LANGUAGE */}
                    <span className='badge badge-secondary text-xs'>
                        {getLanguageFlag(friend.learningLanguage)}
                        Learning: {friend.learningLanguage}
                    </span>
                </div>

                {/* chat page link */}
                <Link
                    to={`/chat/${friend._id}`}
                    className='btn btn-outline w-full'
                >
                    Message
                </Link>
            </div>
        </div >
    )
}

export default FriendCard

