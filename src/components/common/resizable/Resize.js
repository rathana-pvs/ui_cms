import React, { useState, useRef } from "react";
import styles from "@/layout/layout.module.css"
export default function VerticalResizeLayout({onChangeHeight}) {
    const [topHeight, setTopHeight] = useState(200); // initial top height
    const containerRef = useRef(null);
    const isDraggingRef = useRef(false);

    const handleMouseDown = (e) => {
        e.preventDefault();
        isDraggingRef.current = true;

        const startY = e.clientY;
        const startHeight = topHeight;

        const handleMouseMove = (moveEvent) => {
            if (!isDraggingRef.current) return;
            const delta = moveEvent.clientY - startY;
            const newHeight = Math.max(0, startHeight + delta); // min height 100px
            setTopHeight(newHeight);
            onChangeHeight(newHeight);
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    return (
            <div
                className={styles.resize__line}
                onMouseDown={handleMouseDown}
                onMouseEnter={(e) => (e.target.style.background = "#999")}
                onMouseLeave={(e) => (e.target.style.background = "#ccc")}
            />


    );
}
