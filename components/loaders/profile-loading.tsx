import React from 'react'
import { Skeleton } from '../ui/skeleton'

const ProfileLoading = () => {
  return (
    <div className='py-3.5 w-[195px] flex justify-start gap-3 fixed bottom-[7%]'>
      <Skeleton className='h-9 w-9 ml-3 rounded-full' />
      <div className='flex flex-col items-start justify-center'>
        <Skeleton className='w-24 h-3 mb-1' />
        <Skeleton className='w-16 h-3' />
      </div>
    </div>
  )
}

export default ProfileLoading