import 'github-markdown-css'
import { render } from 'preact'
import ChatGPTQuery from './ChatGPTQuery'
import { buildReviewQuery, buildRebuttalQuery, queryReviewElements } from './ChatGPTQueryBuilder'
import { Button } from './Interface'
import { config, ElementInterface } from './interface-configs.js'
import './styles.scss'
import { promptSettings } from './prompt-configs.js'
import { CopilotIcon } from '@primer/octicons-react'

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

async function identify_inject_type(config: Record<string, ElementInterface>) {
    const maxTries = 30
    let tries = 0
    let parent = null
    while (tries < maxTries) {
        for (const [key, value] of Object.entries(config)) {
            parent = document.querySelector<HTMLElement>(value.reviewButtonParent)
            if (parent && parent.offsetParent !== null) {
                console.log("ChatGPT - Review & Rebuttal: Identified site: " + key)
                return key
            }
            parent = document.querySelector<HTMLElement>(value.rebuttalButtonParent)
            if (parent && parent.offsetParent !== null) {
                console.log("ChatGPT - Review & Rebuttal: Identified site: " + key)
                return key
            }
        }
        tries += 1
        await new Promise(resolve => setTimeout(resolve, 500))
    }

    return null
}


function onClickClose(container: HTMLDivElement) {
    container.style.display = 'none'
}

export async function submit_and_add_question(
    query: string | null,
    queryType: string,
    resultContainer: Element
) {
    console.log("ChatGPT - Review & Rebuttal: Button clicked for: " + queryType)
    console.log("ChatGPT - Review & Rebuttal: query: " + query)
    if (!query || query === "") {
        return
    }
    const container = document.createElement('div')
    container.className = 'chatgpt-container'
    container.style.margin = "10px"

    // Remove any existing items in resultContainer that match the selectors in ['pre', '.chatgpt-container']
    for (const selector of ['.chatgpt-container', 'pre']) {
        const elements = resultContainer.querySelectorAll(selector)
        for (const element of elements) {
            element.remove()
        }
    }
    resultContainer.append(container)
    render(
        <ChatGPTQuery question={query} type={queryType} onClickClose={() => { onClickClose(container) }} />,
        container,
    )
}

function create_review_button(siteConfig: ElementInterface, siteName: string) {
    const key = "review"
    const prompt = promptSettings[key]
    const resultContainerElement = document.querySelector(siteConfig.resultContainer)
    if (!resultContainerElement) {
        console.error("no container found to append results: " + siteConfig.resultContainer)
        return
    }

    const toolbar = document.querySelector(siteConfig.reviewButtonParent)
    const controls_container = document.createElement('span')
    controls_container.className = 'chatgpt-review-controls'
    toolbar!.append(controls_container)
    var buttons = [
        // <Button
        //     name="ChatGPT"
        //     onClick={() => null}
        //     icon={CopilotIcon}
        //     disabled={true}
        //     siteName={siteName}
        // />,
        <Button
            name={prompt.buttonLabel}
            onClick={() => {
                const query = buildReviewQuery(siteName, siteConfig)
                submit_and_add_question(query, key, resultContainerElement)
            }}
            icon={prompt.buttonIcon}
        />
    ];
    render(
        buttons,
        controls_container
    )
}

function create_rebuttal_button(siteConfig: ElementInterface, siteName: string) {
    const key = "rebuttal"
    const prompt = promptSettings[key]

    const reviewElements = queryReviewElements(siteName)
    for (const element of reviewElements) {
        const toolbar = element.querySelector(siteConfig.rebuttalButtonParent)
        const controls_container = document.createElement('span')
        controls_container.className = 'chatgpt-rebuttal-controls'
        toolbar!.append(controls_container)

        var buttons = [
            // <Button
            //     name="ChatGPT"
            //     onClick={() => null}
            //     icon={CopilotIcon}
            //     disabled={true}
            //     siteName={siteName}
            // />,
            <Button
                name={prompt.buttonLabel}
                onClick={() => {
                    const query = buildRebuttalQuery(siteName, element)
                    submit_and_add_question(query, key, element)
                }}
                icon={prompt.buttonIcon}
            />
        ];
        render(
            buttons,
            controls_container
        )
    }
}

async function create_interface_awaiting_loading(siteConfig: ElementInterface, siteName: string) {
    const maxTries = 30
    let tries = 0

    while (tries < maxTries) {
        const loadingElement = document.querySelector(siteConfig.loadingElement)
        if (!loadingElement) {
            create_review_button(siteConfig, siteName)
            create_rebuttal_button(siteConfig, siteName)
            return
        }
        await new Promise(resolve => setTimeout(resolve, 500))
    }
}

async function create_interface(siteConfig: ElementInterface, siteName: string) {
    // create review and rebuttal button
    // Attach manual close to make sure the closing button still works in openreview
    if (siteName === "notebook") {
        await create_interface_awaiting_loading(siteConfig, siteName)
    } else if (siteName === "icml2023") {
        await create_interface_awaiting_loading(siteConfig, siteName)
    }
}

/* -------------------------------------------------------------------------- */
/*                           Execute extension logic                          */
/* -------------------------------------------------------------------------- */

async function main() {

    const siteName = await identify_inject_type(config)
    if (siteName) {
        // Get the config for the current site
        const siteConfig = config[siteName]
        await create_interface(siteConfig, siteName)

        console.log("ChatGPT - Review & Rebuttal: active and ready!")
    } else {
        console.warn("ChatGPT - Review & Rebuttal: not support this site!")
    }
}

main()

