"use client"

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'

const AnnouncementTab = () => {

  const {data} = useQuery({
    queryFn: async () => {
      const response = await axios.get("")
      return response.data.data
    },
    queryKey: ["annonucement-tab"]
  })

  return (
    <div>AnnouncementTab</div>
  )
}

export default AnnouncementTab