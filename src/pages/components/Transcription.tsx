import React, {useEffect, useState} from "react";
import { NodeViewWrapper } from '@tiptap/react'
import {Typography, Card} from "@mui/material";
import classes from "../../styles/Transcription.module.css";
export default function Transcription(Text: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined) {
        // Make sure text is a string
    if (Text?.node?.attrs.text) {
        Text = Text.node.attrs.text
    }
    else {
        Text = ' An error occurred loading the transcription. '
    }



        const [thisWidth, setThisWidth] = React.useState(true);
        const [open, setOpen] = React.useState(false);



    return (
            <NodeViewWrapper className={"react-component"}>
                    <Card contentEditable={false}
                            onMouseEnter={() => setOpen(true)}
                            onMouseLeave={() => setOpen(false)}
                          className={classes.width}
                          sx={
                        {
                            width: 'max-content',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            paddingTop: '0.5rem',
                            paddingLeft: '0.5rem',
                            paddingRight: '0.5rem',
                            backgroundColor: '#262626',
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