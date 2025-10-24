import { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'
import MeImage from '../../assets/images/me.jpg'

const About = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

  useEffect(() => {
    return setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)
  }, [])

  return (
    <>
      <div className="container about-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={['A', 'b', 'o', 'u', 't', ' ', 'm', 'e']}
              idx={15}
            />
          </h1>
          <p>
            I'm an engineering student @UWaterloo currently in my 1A term. Find me at PAC gym, E5 bay or gear lab, or doomscrolling on my living room couch.
          </p>
          <p align="LEFT">
            I'm passionate about many things. When I'm not studying, I enjoy working on personal projects, exploring new technologies, and pushing my limits on the pull up bar and treadmill.
          </p>
          <p>
            Currently seeking Winter 2026 Internships.
          </p>
        </div>

        <div className="stage-cube-cont">
          <img src={MeImage} alt="Me" className="about-me-image" />
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default About
