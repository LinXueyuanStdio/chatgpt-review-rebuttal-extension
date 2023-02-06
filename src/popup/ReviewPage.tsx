import { useEffect, useState } from 'preact/hooks'
import { memo } from 'react'
import { Button } from '../content-script/Interface'
import { promptSettings } from '../content-script/prompt-configs'
import { submit_and_add_question } from '../content-script/index'
import { reviewTemplate } from '../content-script/promptTemplates'
import { XIcon } from '@primer/octicons-react'

interface Props {
  onClickClose: () => void,
}
const key = "review"
const prompt = promptSettings[key]

function ReviewPage(props: Props) {
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const element = <div id="result" className="result-container"></div>
  return (
    <div className="container">
     <div style="display: flex; justify-content: space-around">
        <h6>Generate Review</h6>
        <span
          onClick={() => { props.onClickClose() }}
          style={{ marginLeft: '10px', marginRight: '10px' }}
        >
          <XIcon size={24} />
        </span>
      </div>
      <h5>Title</h5>
      <div className="row">
        <input type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} />
      </div>
      <h5>Abstract</h5>
      <div className="row">
        <textarea rows="3" cols="100" onChange={(e) => { setAbstract(e.target.value) }} >{abstract}</textarea>
      </div>
      {element}
      <Button
        name={prompt.buttonLabel}
        onClick={() => {
          const query = reviewTemplate(title, abstract)
          console.log(query)
          const resultElement = document.getElementById("result")
          if (!resultElement) return
          submit_and_add_question(query, key, resultElement)
        }}
        icon={prompt.buttonIcon}
      />
    </div>
  )
}

export default memo(ReviewPage)