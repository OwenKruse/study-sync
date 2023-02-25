import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import Component from '../components/Transcription'

export default Node.create({
    name: 'reactComponent',

    group: 'block',

    content: 'inline*',


    addAttributes() {
        return {
            text: {
                default: '',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'react-component',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['react-component', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(Component)
    },
})
