import React from 'react';
import { motion } from 'framer-motion';
import styles from '@/components/common/modal/Loading.module.css';
import {useSelector} from "react-redux";


const LoadingScreen = () => {
    const loading = useSelector(state => state.dialog.loading);
    return (
        <div className={styles.container} style={!loading ? {display: "none"} : null}>
            <div style={{ display: 'flex' }}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className={styles.dot}
                        animate={{
                            y: [0, -12, 0],
                            opacity: [1, 0.6, 1],
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            repeatDelay: 0.1,
                            delay: i * 0.2,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default LoadingScreen;
