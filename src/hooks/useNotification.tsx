import { useRef, useState } from "react";

const BASE_NOTIFICATION_CLASS = "notification";
const HIDDEN_NOTIFICATION_CLASS = "notification--hide";
const CORRECT_NOTIFICATION_CLASS = "notification--correct";
const NOTIFICATION_DURATION = 2000;

export const useNotification = () => {
    const [notificationMessage, setNotificationMessage] = useState<string>("");
    const [notificationClasses, setNotificationClasses] = useState<string[]>([
        BASE_NOTIFICATION_CLASS,
        HIDDEN_NOTIFICATION_CLASS
    ]);

    const notificationTimeout = useRef<number | null>(null);
    const showNotification = (message: string, isCorrect: boolean = false) => {
        setNotificationMessage(message);

        const classes = [BASE_NOTIFICATION_CLASS];
        if (isCorrect) {
            classes.push(CORRECT_NOTIFICATION_CLASS);
        }

        setNotificationClasses(classes);

        if (notificationTimeout.current) {
            clearTimeout(notificationTimeout.current);
        }

        notificationTimeout.current = setTimeout(() => {
            setNotificationClasses((classes: string[]) => [
                ...classes,
                HIDDEN_NOTIFICATION_CLASS
            ]);
        }, NOTIFICATION_DURATION);
    };

    return {
        notificationOptions: {
            message: notificationMessage,
            classes: notificationClasses
        },
        showNotification
    };
};
