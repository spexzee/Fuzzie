import React, { useEffect, useRef } from 'react';
import * as LR from '@uploadcare/blocks';
import { useRouter } from 'next/navigation';

type Props = {
    onUpload:(e:string)=> any
}

LR.registerBlocks(LR)

const UploadCareButton = ({ onUpload }: Props) => {
    const router = useRouter();

    const ctxProviderRef = useRef<
        typeof LR.UploadCtxProvider.prototype & LR.UploadCtxProvider
    >(null)

    useEffect(() => {
        const handleUpload = async (e: any) => {
            const file = await onUpload(e.detail.cdnUrl);
            if (file) router.refresh();
        };
    
        // Add the event listener only if ctxProviderRef.current is not null
        if (ctxProviderRef.current) {
            ctxProviderRef.current.addEventListener('file-upload-success', handleUpload);
        }
    
        // Cleanup function to remove the event listener when component unmounts
        return () => {
            if (ctxProviderRef.current) {
                ctxProviderRef.current.removeEventListener('file-upload-success', handleUpload);
            }
        };
    }, []); // Empty dependency array to ensure this effect runs only once
    

    return (
        <div>
            <lr-config
                ctx-name="my-uploader"
                pubkey="044bc607404a956625aa"
            />

            <lr-file-uploader-regular
                ctx-name="my-uploader"
                css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.35.2/web/lr-file-uploader-regular.min.css`}
            />

            <lr-upload-ctx-provider
                ctx-name="my-uploader"
                ref={ctxProviderRef}
            />
        </div>
    )
}

export default UploadCareButton