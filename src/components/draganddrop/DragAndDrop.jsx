import React, { useCallback, useEffect, useRef } from 'react'
import './DragAndDrop.scss'

window.addEventListener("dragenter", function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'none';
    e.dataTransfer.dropEffect = 'none';
}, false);

window.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'none';
    e.dataTransfer.dropEffect = 'none';
});

window.addEventListener("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'none';
    e.dataTransfer.dropEffect = 'none';
});

function DragAndDrop({ children, onDrop }) {
    const ref = useRef();
    const ovRef = useRef();
    const counter = useRef(0);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, [])

    const handleDragIn = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        counter.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            if (ovRef.current) ovRef.current.classList.remove('hide');
        }
    }, [])

    const handleDragOut = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        counter.current--;
        if (counter.current > 0) return;
        if (ovRef.current) ovRef.current.classList.add('hide');
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const imageTypes = ['image/png', 'image/bmp', 'image/jpg', 'image/jpeg'];
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            if (imageTypes.includes(e.dataTransfer.files[0].type)) {
                onDrop(e.dataTransfer.files[0]);
            }
            e.dataTransfer.clearData();
            counter.current = 0;
            if (ovRef.current) ovRef.current.classList.add('hide');
        }
    }, [onDrop])

    useEffect(() => {
        counter.current = 0;
        let div = ref.current;
        div.addEventListener('dragenter', handleDragIn);
        div.addEventListener('dragleave', handleDragOut);
        div.addEventListener('dragover', handleDrag);
        div.addEventListener('drop', handleDrop);
        return () => {
            div.removeEventListener('dragenter', handleDragIn);
            div.removeEventListener('dragleave', handleDragOut);
            div.removeEventListener('dragover', handleDrag);
            div.removeEventListener('drop', handleDrop);
        }
    }, [handleDragIn, handleDragOut, handleDrag, handleDrop]);

    return (
        <div ref={ref} className='drag-and-drop' draggable='false' onDragStart={() => { return false; }}>
            {children}
            <div ref={ovRef} className='drag-and-drop-overlay hide' draggable='false' onDragStart={() => { return false; }}></div>
        </div>
    )
}

export default DragAndDrop
