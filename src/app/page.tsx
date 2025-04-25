// // // page.tsx
// // 'use client';
// // import { useState } from 'react';
// // import ProductTable from '@/app/(main)/(pages)/productTable/page';
// // import { Search } from 'lucide-react';
// // import ProductDropdown from '@/app/(main)/(pages)/productDropdown/page'; // Import the dropdown

// // export default function Home() {
// //     const [searchQuery, setSearchQuery] = useState('');
// //     const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

// //     const handleProductsSelect = (productIds: string[]) => {
// //         setSelectedProductIds(productIds);
// //     };

// //     return (
// //         <main className="min-h-screen bg-white">
// //             <div className="max-w-8xl mx-auto">
// //                 <header className="flex justify-between items-center p-4 border-b">
// //                     <div className="flex items-center gap-2">
// //                         <div className="p-2 bg-gray-100 rounded-md">
// //                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //                                 <rect x="3" y="3" width="18" height="18" rx="2" />
// //                             </svg>
// //                         </div>
// //                         <ProductDropdown onProductSelect={handleProductsSelect} /> {/* Use the dropdown */}
// //                     </div>

// //                     <div className="flex items-center gap-4">
// //                         <div className="relative">
// //                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                                 <Search size={18} className="text-gray-400" />
// //                             </div>
// //                             <input
// //                                 type="text"
// //                                 placeholder="Search..."
// //                                 value={searchQuery}
// //                                 onChange={(e) => setSearchQuery(e.target.value)}
// //                                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
// //                             />
// //                         </div>

// //                         <button className="p-2">
// //                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //                                 <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
// //                             </svg>
// //                         </button>
// //                     </div>
// //                 </header>

// //                 <div className="flex items-center p-4 border-b">
// //                     <div className="flex items-center gap-3">
// //                         <button className="flex items-center gap-1 px-3 py-1.5">
// //                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //                                 <line x1="4" y1="6" x2="20" y2="6" />
// //                                 <line x1="4" y1="12" x2="20" y2="12" />
// //                                 <line x1="4" y1="18" x2="20" y2="18" />
// //                             </svg>
// //                             Board controls
// //                         </button>

// //                         <button className="flex items-center gap-1 px-3 py-1.5">
// //                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //                                 <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
// //                             </svg>
// //                             Filter
// //                         </button>
// //                     </div>
// //                 </div>

// //                 <div className="p-4">
// //                     <ProductTable selectedProductIds={selectedProductIds} /> {/* Pass selectedProductIds to ProductTable */}
// //                 </div>
// //             </div>
// //         </main>
// //     );
// // }



// // src/app/page.tsx
// 'use client'; // This is a client component

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation'; // Changed from 'next/router'
// import { signInUser } from './firebase'; // Adjust the path carefully

// import Link from 'next/link'; // Import Link

// export default function LoginPage() { // Changed to a default export for the page
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleLogin = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setError('');

//     try {
//       await signInUser(email, password);
//       console.log('Login successful!');
//       router.push('/product'); // Replace '/dashboard' with your desired route
//     } catch (err) {
//       const error = err as { code: string; message: string };
//       console.error('Login failed:', error.code, error.message);
//       if (error.code === 'auth/user-not-found') {
//         setError('No user found with this email.');
//       } else if (error.code === 'auth/wrong-password') {
//         setError('Incorrect password.');
//       } else if (error.code === 'auth/invalid-email') {
//         setError('Please enter a valid email address.');
//       } else {
//         setError('An error occurred during login.');
//       }
//     }
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleLogin}>
//         <div>
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Log In</button>
//       </form>
//       <p>
//         Don't have an account? <Link href="/register">Register</Link>
//       </p>
//       <p>
//         <Link href="/forgot-password">Forgot Password?</Link>
//       </p>
//     </div>
//   );
// }
'use client'; // This is a client component

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signInUser } from './firebase';
// import Link from 'next/link';
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [focusedInput, setFocusedInput] = useState<string | null>(null);
//   const router = useRouter();

//   const handleLogin = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setError('');

//     try {
//       await signInUser(email, password);
//       console.log('Login successful!');
//       router.push('/product');
//     } catch (err) {
//       const error = err as { code: string; message: string };
//       console.error('Login failed:', error.code, error.message);
//       if (error.code === 'auth/user-not-found') {
//         setError('No user found with this email.');
//       } else if (error.code === 'auth/wrong-password') {
//         setError('Incorrect password.');
//       } else if (error.code === 'auth/invalid-email') {
//         setError('Please enter a valid email address.');
//       } else {
//         setError('An error occurred during login.');
//       }
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleFocus = (inputName: string) => {
//     setFocusedInput(inputName);
//   };

//   const handleBlur = () => {
//     setFocusedInput(null);
//   };

//   const getInputClassName = (inputName: string) => {
//     return `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//       focusedInput === inputName ? 'border-blue-500 shadow-md' : 'border-gray-300'
//     }`;
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="w-full max-w-sm">
//         <div className="flex items-center justify-center mb-6">
//           <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M6.736 16.003L16.003 6.736L25.27 16.003L16.003 25.27L6.736 16.003Z" fill="#3182CE"/>
//             <path d="M6.736 16.003L16.003 25.27L6.736 16.003L16.003 6.736L25.27 16.003L16.003 6.736L6.736 16.003Z" fill="url(#paint0_linear_1_10)"/>
//             <defs>
//             <linearGradient id="paint0_linear_1_10" x1="16.003" y1="6.736" x2="16.003" y2="25.27" gradientUnits="userSpaceOnUse">
//             <stop stopColor="#4299E1"/>
//             <stop offset="1" stopColor="#3182CE"/>
//             </linearGradient>
//             </defs>
//           </svg>
//           <span className="ml-2 text-xl font-semibold">productboard</span>
//         </div>
//         <h2 className="text-xl font-semibold mb-4 text-center">Sign in to your workspace</h2>

//         <div className="flex items-center justify-center my-4">
//           <div className="border-t border-gray-300 flex-grow"></div>
//           <span className="mx-4 text-gray-500 text-sm bg-gray-100 px-2">OR USE EMAIL</span>
//           <div className="border-t border-gray-300 flex-grow"></div>
//         </div>

//         {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
//         <form className="mb-4" onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//               Email
//             </label>
//             <input
//               className={getInputClassName('email')}
//               id="email"
//               type="email"
//               placeholder="name@company.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               onFocus={() => handleFocus('email')}
//               onBlur={handleBlur}
//               required
//             />
//           </div>
//           <div className="mb-6 relative">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 className={getInputClassName('password')}
//                 id="password"
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 onFocus={() => handleFocus('password')}
//                 onBlur={handleBlur}
//                 required
//               />
//               <div className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center cursor-pointer" onClick={togglePasswordVisibility}>
//                 {showPassword ? (
//                   <EyeIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
//                 ) : (
//                   <EyeSlashIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center justify-between">
//             <label className="flex items-center text-sm text-gray-700">
//               <input type="checkbox" className="mr-2 leading-tight" />
//               Remember me
//             </label>
//             <Link href="/forgot-password" className="inline-block align-baseline font-semibold text-sm text-blue-500 hover:text-blue-800">
//               Forgot password
//             </Link>
//           </div>
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
//             type="submit"
//           >
//             Log me in
//           </button>
//         </form>
//         <p className="text-center text-gray-500 text-xs">
//           Don't have an account? <Link href="/register" className="font-semibold text-blue-500 hover:text-blue-800">Sign up</Link>
//         </p>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInUser } from './firebase';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      await signInUser(email, password);
      console.log('Login successful!');
      router.push('/product');
    } catch (err) {
      const error = err as { code: string; message: string };
      console.error('Login failed:', error.code, error.message);
      if (error.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('An error occurred during login.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = (inputName: string) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const getInputClassName = (inputName: string) => {
    return `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
      focusedInput === inputName ? 'border-blue-500 shadow-md' : 'border-gray-300'
    }`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.736 16.003L16.003 6.736L25.27 16.003L16.003 25.27L6.736 16.003Z" fill="#3182CE"/>
            <path d="M6.736 16.003L16.003 25.27L6.736 16.003L16.003 6.736L25.27 16.003L16.003 6.736L6.736 16.003Z" fill="url(#paint0_linear_1_10)"/>
            <defs>
            <linearGradient id="paint0_linear_1_10" x1="16.003" y1="6.736" x2="16.003" y2="25.27" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4299E1"/>
            <stop offset="1" stopColor="#3182CE"/>
            </linearGradient>
            </defs>
          </svg>
          <span className="ml-2 text-xl font-semibold">productboard</span>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-center">Sign in to your workspace</h2>

        <div className="flex items-center justify-center my-4">
          <div className="border-t border-gray-300 flex-grow"></div>
          <span className="mx-4 text-gray-500 text-sm bg-gray-100 px-2">OR USE EMAIL</span>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>

        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <form className="mb-4" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className={getInputClassName('email')}
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              required
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className={getInputClassName('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => handleFocus('password')}
                onBlur={handleBlur}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center cursor-pointer" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <EyeIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4"> {/* Added mb-4 here */}
            <label className="flex items-center text-sm text-gray-700">
              <input type="checkbox" className="mr-2 leading-tight" />
              Remember me
            </label>
            <Link href="/forgot-password" className="inline-block align-baseline font-semibold text-sm text-blue-500 hover:text-blue-800">
              Forgot password
            </Link>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Log me in
          </button>
        </form>
        <p className="text-center text-gray-500 text-xs">
          Don't have an account? <Link href="/register" className="font-semibold text-blue-500 hover:text-blue-800">Sign up</Link>
        </p>
      </div>
    </div>
  );
}