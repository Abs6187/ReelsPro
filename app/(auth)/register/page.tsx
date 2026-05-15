'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { Mail, Lock, UserPlus, AlertCircle, User, EyeOff, Eye } from 'lucide-react';
import VideoBackground from '@/app/components/VideoBackground';
import AnimatedInput from '@/app/components/AnimatedInput';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';


const schema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter()
   const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
        const response = await axios.post('/api/auth/register', data);
        if (response.status === 201) {
          // Registration successful, redirect to login page
          router.push('/login');
          toast({
            title: "Registration Successful",
            description: "You have successfully registered. Please log in to continue.",
            variant: "success",
          });
        } else {
          setAuthError("Registration failed");
        }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        setAuthError(error.response?.data.message || "An error occurred");
      } else {
        setAuthError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Animation/Video */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <VideoBackground 
          videoUrl="https://videos.pexels.com/video-files/6128683/6128683-uhd_2560_1440_25fps.mp4"
          overlayClassName="bg-gradient-to-r from-black/90 via-black/80 to-transparent"
        />
        
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white ml-16">
          <h1 className="text-5xl font-bold mb-6 animate-fadeIn">
            Join the <span className="text-reelspro-purple">Creator</span> Community
          </h1>
          
          <div className="space-y-6">
            <p className="text-2xl text-gray-300 animate-slideUp animation-delay-200">
              Start your creative journey today
            </p>
            
            <ul className="space-y-4 max-w-md animate-slideUp animation-delay-400">
              {[
                "Upload unlimited HD videos",
                "Connect with other creators worldwide",
                "Get discovered by our recommendation system",
                "Analytics to grow your audience"
              ].map((benefit, index) => (
                <li 
                  key={index} 
                  className="flex items-center"
                  style={{
                    animationDelay: `${(index * 200) + 600}ms`
                  }}
                >
                  <svg className="h-5 w-5 text-reelspro-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex items-center space-x-2 mt-8">
            {[
              'men/32.jpg',
              'women/44.jpg',
              'men/54.jpg',
              'women/65.jpg'
            ].map((img, idx) => (
              <Image
                width={40}
                height={40}
                key={idx}
                src={`https://randomuser.me/api/portraits/${img}`}
                alt="Creator"
                unoptimized
                className="w-10 h-10 rounded-full object-cover border-2 border-white transform hover:scale-110 transition-transform duration-300 shadow-md"
              />
            ))}

            <span className="ml-2 text-sm text-gray-300">and many more</span>
          </div>
          </div>
        </div>
        
        {/* Animated gradient circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-reelspro-purple opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 right-0 w-60 h-60 bg-reelspro-blue opacity-20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>
      
      {/* Right side - Registration form */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative bg-black">
        <div className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className='flex flex-col md:hidden items-center justify-center mb-6 mt-6'>
              <h1 className="text-5xl font-bold mb-6 animate-fadeIn">
                Join the <span className="text-reelspro-purple">Creator</span> Community
              </h1>
              <p className="text-2xl text-gray-300 animate-slideUp animation-delay-200">
                Start your creative journey today
              </p>
            </div>
            <h2 className="hidden md:block text-4xl font-bold mb-2 bg-gradient-to-r from-reelspro-blue to-reelspro-purple bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-300">Create an account to get started</p>
          </div>
          
          {authError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-red-500 text-sm">{authError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatedInput
              id="username"
              label="Username"
              icon={User}
              type="text"
              error={errors.username?.message}
              {...register("username")}
            />
            
            <AnimatedInput
              id="email"
              label="Email"
              icon={Mail}
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <div className='relative'>
              <AnimatedInput
              id="password"
              label="Password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              error={errors.password?.message}
              {...register("password")}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-mystery-500 rounded"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            </div>

            <div className='relative'>
            <AnimatedInput
              id="confirmPassword"
              label="Confirm Password"
              icon={Lock}
              type={showConfirmPassword ? "text" : "password"}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
              className="mb-6"
            />
            <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-mystery-500 rounded"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            </div>
            
            <label className="flex items-start mb-6">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-white/20 bg-transparent focus:ring-reelspro-blue text-reelspro-blue"
              />
              <span className="ml-3 text-sm text-gray-300">
                I agree to the{" "}
                <Link href="/terms" className="text-reelspro-blue hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-reelspro-blue hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-reelspro-blue to-reelspro-purple rounded-md flex items-center justify-center text-white font-medium transition-all duration-300 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-reelspro-blue/30'
              }`}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <UserPlus className="h-5 w-5 mr-2" />
              )}
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          
          {/* <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-400">Or sign up with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
                Google
              </button>
              
              <button
                type="button"
                className="flex items-center justify-center py-2 px-4 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 rounded-md transition-colors"
              >
                <svg className="h-5 w-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.14634 24V13.0614H5.83302V8.84553H9.14634V5.7422C9.14634 2.55307 11.0991 0 15.2338 0C16.765 0 17.7676 0.12738 18.1165 0.184903V3.91493L16.016 3.91583C14.3652 3.91583 13.7605 4.73036 13.7605 6.07246V8.84553H18.7519L17.4205 13.0614H13.7605V24"></path>
                </svg>
                Facebook
              </button>
            </div>
          </div> */}
          
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-reelspro-blue hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
        
        {/* Mobile background */}
        <div className="absolute -z-10 inset-0 md:hidden overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-reelspro-purple opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-reelspro-blue opacity-20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;