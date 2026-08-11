import Button from "./Button";

function IconButton({ children, label, ...props }) {
    return (
        <Button size="icon" aria-label={label} {...props}>
            {children}
        </Button>
    );
}

export default IconButton;