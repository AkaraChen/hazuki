import { useMemo } from 'react'
import { Gallery } from './components/Gallery'
import { Header } from './components/Header'
import images from './images.json'
import { shuffleArray } from './utils'

interface ImageData {
  src: string
  width: number
  height: number
  title?: string
}

function App() {
  const shuffledImages = useMemo(() => shuffleArray(images as ImageData[]), [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-0 pb-8">
        <Gallery photos={shuffledImages} />
      </div>
    </div>
  )
}

export default App
