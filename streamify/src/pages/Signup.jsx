import React, { useState } from 'react'
import { ShipWheelIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import videoCall from '../assets/videoCall.png'
import useSignup from '../hooks/useSignup'

const Signup = () => {
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  //this is wha we have done first
  // const queryClient = useQueryClient();
  // const { mutate, isPending, error } = useMutation({
  //   mutationFn: mutateSignup,
  //   onSuccess: () => {
  //     // ✅ Invalidate user query
  //     queryClient.invalidateQueries({ queryKey: ["authUser"] });
  //     toast.success("Signup successful");
  //   },
  // });
  const { signupMutaion, isPending, error } = useSignup();

  function handleSignup(e) {
    e.preventDefault();
    signupMutaion(signupData);
  }

  return (
    <div className="h-screen flex justify-center items-center p-4 sm:p-6 md:p-8" data-theme=" forest">

      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>

        {/* form left sidde  */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col ">
          {/* logo */}
          <div className="flex items-center justify-center mb-6 gap-2">
            <ShipWheelIcon className="size-9 text-green-500" />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600 tracking-wider'>Streamify</span>
          </div>

          {/* //error message */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>
                {error.response.data.message}
              </span>

            </div>
          )}

          <div className='w-full'>
            <form onSubmit={handleSignup}>
              <div className='space-y-4 '>
                <div >
                  <h2 className=" text-xl font-semibold ">
                    Create an account
                  </h2>
                  <p className="text-sm opacity-70">
                    Join stream and start your language learning advanture!
                  </p>
                </div>
                <div className="space-y-3">
                  {/* fullName  */}
                  <div className='form-control w-full'>
                    <label htmlFor="fullName" className="label-text">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      placeholder="Ahmad Alaa"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  {/* email */}
                  <div className='form-control w-full'>
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="input input-bordered w-full"
                      placeholder='ahmadalaa@gmail.com'
                      required
                    />
                  </div>
                  {/* password */}
                  <div className='form-control w-full'>
                    <label htmlFor="password" className="block text-sm font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="input input-bordered w-full"
                      placeholder='********'
                      required
                    />
                    <p className="text-xs opacity-70 mt-1">
                      password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.
                    </p>
                  </div>

                  {/* policiecs and privacy */}
                  <div className="form-control ">
                    <label className="label cursor-pointer justify-center gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="label-text text-sm">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">Terms of service</span>
                        {" "}and{" "}
                        <span className="text-primary hover:underline" >Privacy Policy</span>
                      </span>
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary w-full" type='submit'>
                  {isPending ? (
                    <>
                      <span className='loading loading-spinner loading-xs'></span>
                      Loading...
                    </>
                  ) : ("Create Account")}

                </button>
                <div>
                  <p>
                    Already have an account?{" "}
                    <Link to={'/login'} className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div >

        </div >

        {/* form right side */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-green-900/30 p-8 text-white justify-center items-center">
          <div className='max-w-md p-8'>
            {/* illustration or image can go here */}
            <div>
              <img src={videoCall} alt="videoCall img" />
            </div>

            <div>
            </div>
          </div>
        </div>
      </div >


    </div >
  )
}

export default Signup
