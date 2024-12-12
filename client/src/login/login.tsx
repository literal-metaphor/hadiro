import { useState } from 'react';
import assets from '../assets/assets.ts';
import apiClient from '../api/axios';

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors('');
    let valid = true;
    if (!email) {
      valid = false;
      setErrors('Masukan Email!');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      valid = false;
      setErrors('Masukan Email yang valid!');
    }
    if (!password) {
      valid = false;
      setErrors('Masukan Password!');
    }
    if (!email && !password) {
      valid = false;
      setErrors('Masukan Email dan Password!');
    }
    if (valid) {
      //server
      // const response = await apiClient.post('/user/auth/login', {
      //   email: email,
      //   password: password
      // }, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })
      // if (response.data) {
      //   localStorage.setItem('token', response.data.otp);
      //   localStorage.setItem('email', email);
      //   localStorage.setItem('username', "Revo");
      //   localStorage.setItem('level', "3");//IMPORTANT (123)
      //   window.location.href = '/';
      // } else {
      //   console.error('Unexpected response structure:', response.data);
      //   throw new Error('Unexpected response structure');
      // }
      //client
      localStorage.setItem('token', "token123");
      localStorage.setItem('email', email);
      localStorage.setItem('username', "Revo");
      localStorage.setItem('level', "3");//IMPORTANT (123)
      window.location.href = '/';
    }
  }
  return (
    <>
      <div className='flex items-center justify-center h-screen'>
        <div className='w-full mx-5 sm:w-3/4 md:w-1/2 flex flex-col justify-center text-center bg-white border border-[#C5C5C5] rounded-lg p-8 pt-0'>
          <img src={assets.hadiro} className='w-1/2 self-center' />
          <p className='text-[1.5rem] sm:text-[2rem] mb-5 font-bold'>Admin Login</p>
          <p className='text-[1rem] sm:text-[1.5rem] mb-5 opacity-50'>Ojo Bolos, Hadiro Wae Rek!</p>
          <form onSubmit={handleSubmit}>
            <div className='border border-[2px] border-[#E5E5E5] rounded-lg p-4 flex items-center mb-5'>
              <img src={assets.email} className='mr-3' />
              <input type="text" placeholder='Email' className='w-full border-none outline-none' onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='border border-[2px] border-[#E5E5E5] rounded-lg p-4 flex items-center mb-5'>
              <img src={assets.password} className='mr-3' />
              <input type={passwordVisible ? 'text' : 'password'} placeholder='Sandi' className='w-full border-none outline-none' onChange={(e) => setPassword(e.target.value)} />
              <img src={passwordVisible ? assets.show : assets.hide} className='ml-3' onClick={togglePasswordVisibility} />
            </div>
            <div className='w-full text-right mb-5'>
              <a href="" className='text-black opacity-75'>Lupa Sandi?</a>
            </div>
            <button type='submit' className='bg-[#1A73E8] text-white w-full shadow-md shadow-gray-500 focus:outline-none'>Login</button>
          </form>
          {errors && <div className="bg-[#FF2400] text-white mt-5 rounded-lg p-4 flex items-center justify-center">
            <img src={assets.error} className='mr-3 font-medium' /> {errors}
          </div>}
        </div>
      </div>
    </>
  )
}

export default Login
