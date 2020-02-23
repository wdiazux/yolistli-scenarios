interface Props {
    id?: string
    classElm?: string
    element: string
    htmlStr: string
}

const createFragment = (props: Props): DocumentFragment => {
    const { id, classElm, element, htmlStr } = props
    const elements = htmlStr
        .replace(/^\s+|\s+$/gm, '')
        .split('\n')
        .join('')
    const frag = document.createDocumentFragment()
    const docElm: HTMLElement = document.createElement(element)

    if (id) docElm.id = id
    if (classElm) docElm.className = classElm

    docElm.innerHTML = elements
    frag.appendChild(docElm)
    return frag
}

export default createFragment
