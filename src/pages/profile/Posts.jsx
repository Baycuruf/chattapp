
import React from 'react'
import Icon from '../../components/Icon'
import Post from '../posts/Post'

function ProfilePosts() {
  return (
    <div className='flex justify-center flex-col items-center gap-4 pt-10'>
      <div className='h-[62px] w-[62px] border-2 rounded-full border-black flex items-center justify-center'>
        <Icon name="posts" size={32}/>
      </div>
      <h6 className='text-md font-bold'><Post/></h6>
      
      
    </div>
  )
}

export default ProfilePosts
