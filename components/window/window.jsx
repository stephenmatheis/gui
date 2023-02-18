import { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { useWindowContext } from '../window-context/window-context';
import styles from './window.module.scss';

export default function Window({ name, height, width, x, y, children }) {
    const { order, setOrder } = useWindowContext();
    const isForeground = getForeground();
    const zIndex = order.find(x => x.name === name)?.order || 1;
    const [isDragging, setIsDragging] = useState(false);
    const dragParent = useRef();

    let clientX = useRef(0);
    let clientY = useRef(0);

    function getForeground() {
        const nums = order.map(({ order }) => order);
        const max = Math.max(...nums);
        const foregroundWindow = order.find(({ order }) => order === max);

        if (!foregroundWindow) {
            return false;
        }

        return foregroundWindow.name === name ? true : false;
    }

    function onFocus() {
        setOrder(prev => {
            const nums = prev.map(({ order }) => order);
            const max = Math.max(...nums);
            const min = Math.min(...nums);
            const foregroundWindow = prev.find(({ order }) => order === max);

            if (foregroundWindow.name === name) {
                return prev;
            }

            return prev.map(({ name: n, order }) => {
                return {
                    name: n,
                    order: n === name ? max : order === min ? min : order - 1
                }
            });
        });
    }

    function onStart(event) {
        setIsDragging(true);

        if (event.touches && event.touches[0]) {
            // Cache the client X/Y coordinates
            clientX.current = event.touches[0].clientX;
            clientY.current = event.touches[0].clientY;
        }
    }

    const onEnd = useCallback(() => {
        setIsDragging(false);

        // // Set local storage
        // const { top, left } = dragParent.current.getBoundingClientRect();

        // localStorage.setItem('top', top);
        // localStorage.setItem('left', left);
    }, []);

    const onMove = useCallback(event => {
        if (!dragParent.current) {
            return;
        }
        // Mouse
        if (event.movementX !== undefined) {
            const { left, top, height, width } = dragParent.current.getBoundingClientRect();
            const x = left + event.movementX;
            const y = top + event.movementY;
            // const bottomX = window.innerHeight - (left + event.movementX) - width;
            // const bottomY = window.innerHeight - (top + event.movementY) - height;

            if (
                y < 44
            ) {
                return;
            }

            dragParent.current.style.top = `${y}px`;
            dragParent.current.style.left = `${x}px`;
        }

        // Touch
        if (!event.touches) {
            return;
        }

        if (!event.touches[0]) {
            return;
        }

        let deltaX;
        let deltaY;

        deltaX = event.changedTouches[0].clientX - clientX.current;
        deltaY = event.changedTouches[0].clientY - clientY.current;

        const { left, top } = dragParent.current.getBoundingClientRect();
        const x = left + deltaX;
        const y = top + deltaY;

        console.log(left, top, deltaX, deltaY);


        dragParent.current.style.top = `${y}px`;
        dragParent.current.style.left = `${x}px`;

        // Cache the client X/Y coordinates
        clientX.current = event.touches[0].clientX;
        clientY.current = event.touches[0].clientY;
    }, []);

    // Drag
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onEnd);

            window.addEventListener('touchmove', onMove);
            window.addEventListener('touchend', onEnd);
        } else {
            reset();
        }

        function reset() {
            document.body.classList.remove(styles['grabbing']);

            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onEnd);

            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onEnd);
        }

        return () => reset();
    }, [isDragging, name, onMove, onEnd, setOrder]);

    // Add window on top of stack
    useEffect(() => {
        setOrder(prev => {
            const nums = prev.map(({ order }) => order);
            const lastOrder = Math.max(...(nums.length ? nums : [0]));

            return [
                ...prev,
                { name, order: lastOrder + 1 }
            ]
        })
    }, [name, setOrder]);

    // Disable body scrolling
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => document.body.removeAttribute('style');
    }, []);

    return (
        <div
            className={classNames(styles['window'], { [styles['foreground']]: isForeground })}
            style={{
                zIndex,
                width: `${width}px`,
                height: `${height}px`,
                top: `${x}px`,
                left: `${y}px`,
            }}
            ref={dragParent}
            onMouseDown={onFocus}
        >
            {/* Title bar */}
            <div
                className={styles['title-bar']}
                onMouseDown={onStart}
                onTouchStart={onStart}
            >
                <div className={styles['button-ctr']}>
                    <button className={classNames(styles['button'], styles['close'])}
                        onClick={() => {

                        }}
                    />
                    <button className={classNames(styles['button'], styles['minimize'])}
                        onClick={() => {

                        }}
                    />
                    <button className={classNames(styles['button'], styles['maximize'])}
                        onClick={() => {

                        }}
                    />
                </div>
                <div className={styles['title']}>
                    {name}
                </div>
            </div>
            {/* Main */}
            <div className={styles['main']}>
                {children}
            </div>
        </div>
    );
}