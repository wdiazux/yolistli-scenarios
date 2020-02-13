const createFragment = (htmlStr: string): DocumentFragment => {
    htmlStr = htmlStr
        .replace(/^\s+|\s+$/gm, '')
        .split('\n')
        .join('')
    const frag = document.createDocumentFragment()
    const panel = document.createElement('div')

    panel.id = 'panel'
    panel.innerHTML = htmlStr
    frag.appendChild(panel)
    return frag
}

export default createFragment
