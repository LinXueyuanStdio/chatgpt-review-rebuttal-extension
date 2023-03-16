import { useEffect, useState } from 'preact/hooks'
import { memo } from 'react'
import { Button } from '../content-script/Interface'
import { promptSettings } from '../content-script/prompt-configs'
import { submit_and_add_question } from '../content-script/index'
import { rebuttalTemplate } from '../content-script/promptTemplates'
import { XIcon } from '@primer/octicons-react'

interface Props {
  onClickClose: () => void,
}
const key = "rebuttal"
const prompt = promptSettings[key]

function RebuttalPage(props: Props) {
  const [summary, setSummary] = useState('')
  const [summaryOfStrengths, setSummaryOfStrengths] = useState('')
  const [summaryOfWeaknesses, setSummaryOfWeaknesses] = useState('')
  const [suggestions, setSuggestions] = useState('')
  const element = <div id="rebuttal-result" className="result-container"></div>
  return (
    <div className="container">
      <div style="display: flex; justify-content: space-around">
        <h6>Generate Rebuttal</h6>
        <span
          onClick={() => { props.onClickClose() }}
          style={{ marginLeft: '10px', marginRight: '10px' }}
        >
          <XIcon size={24} />
        </span>
      </div>
      <div className="row review-page-title">
        <h6>Summary</h6>
      </div>
      <div className="row">
        <textarea rows="3" cols="100" onChange={(e) => { setSummary(e.target.value) }} >{summary}</textarea>
      </div>
      <div className="row review-page-title">
        <h6>Summary Of Strengths</h6>
      </div>
      <div className="row">
        <textarea rows="3" cols="100" onChange={(e) => { setSummaryOfStrengths(e.target.value) }} >{summaryOfStrengths}</textarea>
      </div>
      <div className="row review-page-title">
        <h6>Summary Of Weaknesses</h6>
      </div>
      <div className="row">
        <textarea rows="3" cols="100" onChange={(e) => { setSummaryOfWeaknesses(e.target.value) }} >{summaryOfWeaknesses}</textarea>
      </div>
      <div className="row review-page-title">
        <h6>Suggestions</h6>
      </div>
      <div className="row">
        <textarea rows="3" cols="100" onChange={(e) => { setSuggestions(e.target.value) }} >{suggestions}</textarea>
      </div>
      {element}
      <Button
        name={prompt.buttonLabel}
        onClick={() => {
          const query = rebuttalTemplate(summary, summaryOfStrengths, summaryOfWeaknesses, suggestions)
          console.log(query)
          const resultElement = document.getElementById("rebuttal-result")
          if (!resultElement) return
          submit_and_add_question(query, key, resultElement)
        }}
        icon={prompt.buttonIcon}
      />
    </div>
  )
}

export default memo(RebuttalPage)