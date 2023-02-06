import '@picocss/pico'
import './styles.css'
import {
  ProjectRoadmapIcon,
  PaintbrushIcon,
} from '@primer/octicons-react'
import { Button } from '../content-script/Interface'
import ReviewPage from './ReviewPage'
import { useEffect, useState } from 'preact/hooks'
import RebuttalPage from './RebuttalPage'

function Popup() {
  const [showReviewPage, setShowReviewPage] = useState(false)
  const [showRebuttalPage, setShowRebuttalPage] = useState(false)
  if (showReviewPage) {
    return <ReviewPage
      onClickClose={() => { setShowReviewPage(false) }}
    />
  }
  if (showRebuttalPage) {
    return <RebuttalPage
      onClickClose={() => { setShowRebuttalPage(false) }}
    />
  }
  return (
    <div className="container">
      <Button
        name="Review"
        onClick={() => {
          console.log("review")
          setShowReviewPage(true)
        }}
        icon={PaintbrushIcon}
      />
      <Button
        name="Rebuttal"
        onClick={() => {
          console.log("rebuttal")
          setShowRebuttalPage(true)
        }}
        icon={ProjectRoadmapIcon}
      />
      <footer>
        <a href="https://github.com/LinXueyuanStdio/chatgpt-review-rebuttal-extension" target="_blank" rel="noreferrer">
          GitHub Repository
        </a>
      </footer>
    </div>
  )
}

export default Popup
