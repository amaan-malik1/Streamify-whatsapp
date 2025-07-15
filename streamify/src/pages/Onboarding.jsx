import React, { useState } from 'react';
import useAuthUser from '../hooks/useAuthUser.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { LoaderIcon, ShuffleIcon, CameraIcon, MapPinIcon, ShipWheelIcon } from 'lucide-react';
import { completeOnboarding } from '../lib/api';
import { LANGUAGES } from '../constants';

const Onboarding = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || '',
    bio: authUser?.bio || '',
    nativeLanguage: authUser?.nativeLanguage || '',
    learningLanguage: authUser?.learningLanguage || '',
    location: authUser?.location || '',
    profilePic: authUser?.profilePic || '',
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success('Profile onboarded successfully');
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmitOnboarding = (e) => {
    e.preventDefault();

    // Example checks
    if (!formState.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!formState.bio.trim()) {
      toast.error("Bio is required");
      return;
    }

    if (!formState.nativeLanguage) {
      toast.error("Native language is required");
      return;
    }

    if (!formState.learningLanguage) {
      toast.error("Learning language is required");
      return;
    }

    if (!formState.location.trim()) {
      toast.error("Location is required");
      return;
    }

    if (!formState.profilePic) {
      toast.error("Profile picture is required");
      return;
    }

    // ✅ If all validations pass, call API
    onboardingMutation(formState);
  };


  const handleRandomAvatar = () => {
    const avatarIndex = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${avatarIndex}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success('Random profile picture generated!');
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

          {/* form onboarding */}
          <form onSubmit={handleSubmitOnboarding} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col justify-center items-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden flex items-center justify-center">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="profile pic"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CameraIcon className="size-12 text-base-content opacity-40" />
                )}
              </div>


              {/* Generate random avatar button */}
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn bg-primary rounded-md text-white flex items-center px-4 py-2 disabled:opacity-50"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label htmlFor="fullName" className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                value={formState.fullName}
                name="fullName"
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full Name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered w-full"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label" htmlFor="nativeLanguages">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  className="select select-bordered w-full"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label" htmlFor="learningLanguages">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  className="select select-bordered w-full"
                  value={formState.learningLanguage}
                  onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                >
                  <option value="">Select your learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label" htmlFor="location">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                  name="location"
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  value={formState.location}
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button className="btn bg-primary w-full" disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              ) : (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
