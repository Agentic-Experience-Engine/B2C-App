'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HiOutlineSearch } from 'react-icons/hi'
import { MdOutlineClose } from 'react-icons/md'

const SearchInput = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim() === '') {
      return
    }

    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex-1 h-10 mx-4 hidden md:inline-flex items-center justify-between relative"
    >
      <input
        className="w-full h-full rounded-md px-2 placeholder:text-sm text-base text-black border-[3px] border-transparent outline-none focus-visible:border-amazonOrange"
        type="text"
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
        placeholder="Search amazon"
      />
      {searchQuery && (
        <MdOutlineClose
          onClick={() => setSearchQuery('')}
          className="text-xl text-amazonLight hover:text-red-600 absolute right-14 duration-200 cursor-pointer"
        />
      )}
      <button
        type="submit"
        className="w-12 h-full bg-amazonOrange hover:bg-amazonOrangeDark duration-200 cursor-pointer text-black text-2xl flex items-center justify-center absolute right-0 rounded-tr-md rounded-br-md"
      >
        <HiOutlineSearch />
      </button>
    </form>
  )
}

export default SearchInput
