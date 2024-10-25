import React, { useRef, useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
// import { resendOtp, verifyOtp } from '../../api/user';
import { useLocation, useNavigate } from 'react-router-dom';
import otpData from '../interfaces/otpInterface';
import { verifyOtp } from '../api/user';
import toast from 'react-hot-toast';
// import { useDispatch } from 'react-redux';
// import { unVerified } from '../../redux/slices/otpSlice';
// import { visible } from '../../redux/slices/forgotslice';
// import { Delete } from '../../redux/slices/forgotEmailSlice';


interface OtpProps extends otpData {
  onSuccess: (data: any) => void; // Add the callback prop type
}
const Otp: React.FC<OtpProps> = ({ email,onSuccess }) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  // const location = useLocation();
  // const dispatch = useDispatch();
  const [otp, setOtp] = useState<string>('');
  const [otpErr, setOtpError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(5 * 60);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  // const { email, purpose } = location.state as LocationState; // Casting location state

  // Format time from seconds to minutes:seconds format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Handle OTP input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number): void => {
    const { value } = e.target;
    const newOtp = otp.split('');
    newOtp[index] = value;
    setOtp(newOtp.join(''));

    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace key for moving focus back
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP resend
  const handleResendOtp = (): void => {
    setOtpError(null);
    setTimeLeft(5 * 60);
    setIsButtonDisabled(true);
    // resendOtp(email);
    // Logic for resending OTP goes here
  };

  // Handle OTP verification
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const response = await verifyOtp(email, otp);
      if (response.data.status === "success") {
        toast.success('successsss')
        onSuccess('managerLogin')
      }
    } catch (error: any) {
      if (error.response?.data?.message === "Invalid otp") {
        setOtpError("Invalid OTP");
      } else if (error.response?.data?.message === "OTP expired") {
        setOtpError("OTP expired");
      }
    }
  };

  // Timer for resending OTP
  useEffect(() => {
    // dispatch(Delete());

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          setIsButtonDisabled(false); // Enable the button when timer finishes
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft,]); //dispatch

  return (
    <div className="min-h-fit flex items-center justify-center bg-gray-100  ">
      <div className="bg-card dark:bg-card-foreground p-8 rounded-lg shadow-md w-full max-w-md border border-primary dark:border-primary-foreground">
        <h2 className="text-center text-lg font-semibold mb-4 text-primary dark:text-primary-foreground">We sent an OTP to your email</h2>

        <p className="text-center text-sm text-secondary mb-4 dark:text-secondary-foreground">
          Time remaining: {formatTime(timeLeft)}
        </p>

        <form className="space-y-6" onSubmit={handleSubmit} >
          <div>
            {otpErr && <p className='text-rose-500'>{otpErr}</p>}
            <label htmlFor="otp" className="block text-sm font-medium text-secondary mb-2 dark:text-secondary-foreground">Enter the OTP</label>
            <div className="flex space-x-2 justify-center">
              {[0, 1, 2, 3].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 border rounded-md text-center text-lg text-primary dark:text-primary-foreground"
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-blue-400 text-accent-foreground py-2 px-4 rounded-md hover:bg-accent/80">
              Verify OTP
            </button>
          </div>
        </form>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isButtonDisabled}
            className={`mt-4 py-2 px-4 rounded-md ${isButtonDisabled ? 'bg-gray-400 text-accent-foreground hidden' : 'bg-black hover:bg-black-500 text-white'}`}
          >
            Resend OTP
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-secondary dark:text-secondary-foreground">Have an account? <a href="#" className="text-primary dark:text-primary-foreground hover:underline">Log in</a></p>
        </div>
      </div>
    </div>
  );
};

export default Otp;
