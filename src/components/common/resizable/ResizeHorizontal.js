import React, {useState, useRef, useEffect} from "react";
import styles from "./ResizeHorizontal.module.css";

export default function HorizontalResizeLayout({ defaultWidth, onChangeWidth }) {
    const [width, setWidth] = useState(defaultWidth);
    const containerRef = useRef(null);
    const isDraggingRef = useRef(false);

    const handleMouseDown = (e) => {
        e.preventDefault();
        isDraggingRef.current = true;

        const startX = e.clientX;
        const startWidth = width;

        const handleMouseMove = (moveEvent) => {
            if (!isDraggingRef.current) return;

            const delta = moveEvent.clientX - startX;   // ⬅ correct axis
            const newWidth = Math.max(100, startWidth + delta);

            setWidth(newWidth);
            onChangeWidth?.(newWidth);
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    useEffect(() => {
        onChangeWidth(defaultWidth)
    },[])

    return (
        <div
            className={styles.resize__horizontal__line}
            onMouseDown={handleMouseDown}
            onMouseEnter={(e) => (e.target.style.background = "#999")}
            onMouseLeave={(e) => (e.target.style.background = "#ccc")}
        />
    );
}
