import "./Notification.css";

type NotificationProps = {
    message: string;
    classes: string[];
};

export const Notification = ({
    message = "",
    classes = []
}: NotificationProps) => {
    return (
        <div className="notification-wrapper">
            <div className={classes.join(" ")}>{message}</div>
        </div>
    );
};
