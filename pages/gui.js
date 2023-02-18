import Window from '@/components/window';
import Head from 'next/head';
import { } from 'react';
import styles from '../styles/gui.module.scss';

export default function Gui() {
    return (
        <>
            <Head>
                <title>Stephen Matheis | GUI</title>
                <meta name="description" content="Stephen Matheis" />
            </Head>
            <div id={styles['gui']}>
                {/* Menubar */}
                <div className={styles['menu-bar']}>
                    <div className={styles['menu-option']}>File</div>
                    <div className={styles['menu-option']}>Edit</div>
                    <div className={styles['menu-option']}>View</div>
                    <div className={styles['menu-option']}>Window</div>
                    <div className={styles['menu-option']}>Help</div>
                </div>
                {/* Windows */}
                <div className={styles['desktop']}>
                    <Window
                        name='1'
                        width={600}
                        height={300}
                        x={80}
                        y={80}
                    >
                        Test 1
                    </Window>
                    <Window
                        name='2'
                        width={600}
                        height={300}
                        x={60}
                        y={60}
                    >
                        Test 2
                    </Window>
                </div>
            </div>
        </>
    )
}