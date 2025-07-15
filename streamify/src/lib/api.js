import { axiosInstance } from "./axios";

export const mutateSignup = async (signupData) => {
  const res = await axiosInstance.post('/auth/signup', signupData, {
    withCredentials: true
  });
  return res.data;
};
export const mutateLogin = async (loginData) => {
  const res = await axiosInstance.post('/auth/login', loginData, {
    withCredentials: true
  });
  return res.data;
};
export const mutateLogout = async () => {
  const res = await axiosInstance.post('/auth/logout', {
    withCredentials: true
  });
  return res.data;
};


export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get('/auth/me', { withCredentials: true });
    return res.data;
  } catch (error) {
    console.log("error in getAuthUser: ", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post('/auth/onboarding', userData, {
    withCredentials: true
  });
  return response.data;
};

export const getRecommendedFriends = async () => {
  const response = await axiosInstance.get('/user', {
    withCredentials: true
  });
  return response.data?.recommandedUser ?? [];
};

export const getFriendUser = async () => {
  const response = await axiosInstance.get('/user/friends', {
    withCredentials: true
  });
  return response.data;
};
export const getOutgoingReq = async () => {
  const response = await axiosInstance.get('/user/outgoingFriendReqs', {
    withCredentials: true
  });
  return response.data;
};

export const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/user/sendFriendRequest/${userId}`, {
    withCredentials: true
  });
  return response.data;
};


export const getFriendRequest = async () => {
  const response = await axiosInstance.get(`/user/allFriendRequest`, {
    withCredentials: true
  });
  return response.data;
}

export const acceptFriendReqMutation = async (requestedId) => {
  const response = await axiosInstance.put(
    `/user/acceptFriendRequest/${requestedId}/accept`,
    {}, 
    { withCredentials: true }
  );
  return response.data;
};
