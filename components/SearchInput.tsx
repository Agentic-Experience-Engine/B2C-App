'use client'
import React, { useEffect, useRef, useState } from 'react'

import { HiOutlineSearch } from 'react-icons/hi'
import { MdOutlineClose } from 'react-icons/md'
import { CiSearch } from 'react-icons/ci'
import { Product } from '@/type'
import Link from 'next/link'
import { IoEyeOffOutline } from 'react-icons/io5'

const SearchInput = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isInputFocused, setIsInputFocused] = useState(false) // New state to manage input focus
  const searchContainerRef = useRef(null) // Ref to detect clicks outside
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  const fetchSearchResults = async (query: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/search', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setFilteredProducts(data.results || []) //ensuring we have an array even if results are null
    } catch (error) {
      console.error('Failed to fetch search results:', error)
      setFilteredProducts([]) // clear results on error
    }
  }

  //useEffect for debouncing the search input
  useEffect(() => {
    //if seach query is empty, clear the results and do nothing further.
    if (searchQuery.trim() === '') {
      setFilteredProducts([])
      return
    }

    //Set a timer to run the search after 300ms of inactivity
    const timerId = setTimeout(() => {
      fetchSearchResults(searchQuery)
    }, 300)

    // Cleanup function: this will run every time the effect is re-triggered
    // i.e every time the user types a new character
    // it cancels the previously scheduled API call
    return () => {
      clearTimeout(timerId)
    }
  }, [searchQuery])
  // The dependency array ensures this effect runs when searchQuery changes.

  // Effet to detect click outside the close the search results.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        //@ts-ignore
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsInputFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      ref={searchContainerRef}
      className="flex-1 h-10 mx-4 hidden md:inline-flex items-center justify-between relative"
    >
      <input
        className="w-full h-full rounded-md px-2 placeholder:text-sm text-base text-black border-[3px] border-transparent outline-none focus-visible:border-amazonOrange"
        type="text"
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
        placeholder="Search amazon"
        onFocus={() => setIsInputFocused(true)}
      />
      {searchQuery && (
        <MdOutlineClose
          onClick={() => setSearchQuery('')}
          className="text-xl text-amazonLight hover:text-red-600 absolute right-14 duration-200 cursor-pointer"
        />
      )}
      <span className="w-12 h-full bg-amazonOrange hover:bg-amazonOrangeDark duration-200 cursor-pointer text-black text-2xl flex items-center justify-center absolute right-0 rounded-tr-md rounded-br-md">
        <HiOutlineSearch />
      </span>
      {/* Search results dropdown */}
      {isInputFocused && searchQuery && (
        <div className="absolute left-0 top-12 w-full mx-auto h-auto max-h-96 bg-white rounded-md overflow-y-scroll cursor-pointer text-black">
          {filteredProducts.length > 0 ? (
            <div className="flex flex-col">
              {filteredProducts.map((item: Product) => (
                <Link
                  key={item?.id}
                  href={`/product/${item?.id}`}
                  onClick={() => {
                    setIsInputFocused(false)
                    setSearchQuery(item.title) // Optional: fill input with selection
                  }}
                  className="flex items-center gap-x-2 text-base font-medium hover:bg-lightText/30 px-3 py-1.5"
                >
                  <CiSearch className="text-lg" /> {item?.title}
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-10 px-5">
              <p className="text-base">
                Searching for results for{' '}
                <span className="font-semibold underline underline-offset-2 decoration-[1px]">{searchQuery}</span>
                ...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchInput
