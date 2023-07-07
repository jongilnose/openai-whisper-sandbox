import PropTypes from 'prop-types'
import React from 'react'

import PauseIcon from './pause'
import PlayIcon from './play'
import PlayOffIcon from './playoff'

import classes from './audiomodal.module.css'

export default function AudioModal({ file, onClose }) {

    const audioDomRef = React.useRef()

    const [error, setError] = React.useState(false)
    const [playState, setPlayState] = React.useState(0)

    const [isReady, setReady] = React.useState(false)
    
    React.useEffect(() => {
        const {mimeType} = handleMimeType()
        audioDomRef.current = new Audio()
        audioDomRef.current.type = `audio/${mimeType}`

        audioDomRef.current.addEventListener('loadedmetadata', handleLoad)
        //audioDomRef.current.addEventListener('canplay', () => console.log("[can play]"))
        //audioDomRef.current.addEventListener('canplaythrough', () => console.log("[can playthru]"))
        audioDomRef.current.addEventListener('ended', handleEnded)
        audioDomRef.current.addEventListener('error', handleError)
        audioDomRef.current.src = `/uploads/${file}`

        return () => {

            try {
                audioDomRef.current.remove()
            } catch(error) {
                console.log(error)
            }

        }
            
    }, [])


    const handleMimeType = () => {
        let mimeType = ''
        let audioCodec = ''
        if (/Android/i.test(navigator.userAgent)) {
            mimeType = 'webm'
            audioCodec = ';codecs=opus'
        }
        else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            mimeType = 'wav'
            audioCodec = ''
        }
        else if (navigator.userAgent.indexOf("Chrome") > -1) {
            mimeType = 'webm'
            audioCodec = ';codecs=opus'
        }
        else if (navigator.userAgent.indexOf("Safari") > -1) {
            mimeType = 'wav'
            audioCodec = ''
        }else{
            mimeType = 'webm'
            audioCodec = ';codecs=opus'
        }
  
        return {
            mimeType : mimeType,
            audioCodec : audioCodec
        }
    }

    const handleEnded = React.useCallback(() => {

        setPlayState(0)

    })

    const handleError = React.useCallback((e) => {
        setError(true)
    }, [])

    const getDuration = () => {

        audioDomRef.current.currentTime = 0
        audioDomRef.current.removeEventListener('timeupdate', getDuration)

        if(audioDomRef.current.duration === Infinity) {
            setError(true)
            return
        }

        setReady(true)

    }

    const handleLoad = React.useCallback(async () => {

        if(audioDomRef.current.duration === Infinity) {

            //setError(true)

            audioDomRef.current.currentTime = 1e101
            audioDomRef.current.addEventListener('timeupdate', getDuration)

        } else {

            setReady(true)

        }

    }, [])
    
    const handleClick = async (e) => {

        e.stopPropagation()
        e.preventDefault()

        if(error || !isReady) {
            return
        }

        if(playState === 1) {

            setPlayState(2)

            try {
                await audioDomRef.current.pause()
            } catch(error) {
                console.log(error)
            }

        } else if(playState === 2) {

            setPlayState(1)

            try {
                await audioDomRef.current.play()
            } catch(error) {
                console.log(error)
            }

        } else {

            setPlayState(1)

            try {
                await audioDomRef.current.play()
            } catch(error) {
                console.log(error)
            }

        }
    }
    
    return (
        <div className={classes.container} onClick={onClose}>
            <div className={classes.center} onClick={handleClick}>
                {
                    error &&
                    <PlayOffIcon color="#FFFE" />
                }
                {
                    (!error && playState !== 1) &&
                    <PlayIcon color="#FFFE" />
                }
                {
                    (!error && playState === 1) &&
                    <PauseIcon color="#FFFE" />
                }
            </div>
        </div>
    )
}

AudioModal.propTypes = {
    /**
     * Audio data file
     */
    file: PropTypes.string,
    /**
     * Close event handler
     */
    onClose: PropTypes.func,
}