import { useMemo } from 'react'
import { Gallery } from './components/Gallery'
import { Header } from './components/Header'
import images from './images.json'
import { shuffleArray } from './utils'

interface ImageData {
  src: string
  width: number
  height: number
}

function App() {
  const shuffledImages = useMemo(() => shuffleArray(images as ImageData[]), [])

  return (
    <div className="w-full px-5 bg-background text-text min-h-screen">
      <Header />
      <Gallery photos={shuffledImages} />
    </div>
  )
}

export default App
