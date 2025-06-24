import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';

function Search() {
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate()

    const onSubmit = (data) => {
        navigate(`/search/${data?.query}`)
        reset()
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex items-center w-full max-w-2xl'>
            <div className='flex items-center flex-1 bg-[#121212] border border-[#303030] rounded-l-full focus-within:border-[#1c62b9] transition-all duration-200'>
                <input 
                    type="search"
                    className='w-full bg-[#121212] text-white placeholder-[#aaaaaa] px-4 py-2 rounded-l-full focus:outline-none text-base'
                    placeholder='Search'
                    {...register("query", { required: true })}
                />
            </div>
            <button 
                type='submit' 
                className='bg-[#222222] hover:bg-[#3c3c3c] border border-l-0 border-[#303030] text-white px-6 py-2 rounded-r-full transition-all duration-200 flex items-center justify-center min-w-[65px]'
            >
                <SearchIcon className='cursor-pointer' size={24} />
            </button>
        </form>
    )
}

export default Search