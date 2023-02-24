import React from "react";
import { NodeViewWrapper } from '@tiptap/react'
import {
    Container,
    Button,
    Modal,
    Card,

} from "@mantine/core";
import {Typography} from "@mui/material";
export default function Transcription(Text: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined) {
        // Make sure text is a string
        // @ts-ignore
         Text = Text.node.attrs.text


        const [open, setOpen] = React.useState(false);
        const ref = React.useRef(null);



        return (
            <NodeViewWrapper className={"react-component"}>
                    <Card contentEditable={false}
                            onClick={() => setOpen(!open)}
                            onMouseEnter={() => setOpen(true)}
                            onMouseLeave={() => setOpen(false)}
                          sx={
                        {
                            // If the max-centent with is larger than 15 rem then set the width to max-content
                            maxWidth: open ? 'max-content' : '15rem',
                            overflow: 'hidden',
                            cursor: 'pointer',
                        }
                    } >
                        <Typography
                            sx={{
                            whiteSpace: open ? 'normal' : 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                        }}>
                            {Text}
                        </Typography>
                    </Card>
            </NodeViewWrapper>
        );
}