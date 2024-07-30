"use client" 
import Link from "next/link"
import { useEffect } from 'react';
import { useRouter } from "next/navigation"

export default function IndexPage() {

  if (typeof window !== 'undefined') {
       window.location.href = "/login";
  }
  
}
