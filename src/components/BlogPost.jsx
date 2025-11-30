import { useParams, Link } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Clock, Tag } from "lucide-react"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"

import { blogPosts } from "./Blog"

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    const found = blogPosts.find((p) => p.slug === slug)
    setPost(found || null)
  }, [slug])

  if (!post) {
    return (
      <>
        <Navbar />
        <section className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
          <p className="text-xl">Post not found.</p>
        </section>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gray-950 text-gray-100 py-20 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header Image */}
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[380px] object-cover rounded-2xl shadow-2xl mb-10"
          />

          {/* Post Title & Meta */}
          <div className="flex flex-col gap-4 mb-10">
            <p className="text-sm text-indigo-400 flex items-center gap-2">
              <Tag size={18} /> {post.category}
            </p>

            <h1 className="text-5xl font-extrabold leading-tight text-white">
              {post.title}
            </h1>

            <p className="text-gray-400 flex items-center gap-2">
              <Clock size={16} /> {post.date}
            </p>
          </div>

          {/* Post Content */}
          <div className="
            text-gray-200 text-[18px] 
            leading-[1.9] 
            tracking-wide 
            space-y-6 
            bg-gray-900/40 
            p-8 
            rounded-2xl 
            shadow-lg
          ">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Back Button */}
          <Link
            to="/blog"
            className="text-indigo-400 font-medium hover:underline mt-10 inline-block text-lg"
          >
            ← Back to Blog
          </Link>
        </div>
      </section>
      <Footer />
    </>
  )
}
