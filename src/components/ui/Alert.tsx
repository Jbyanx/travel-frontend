// src/ui/alert.tsx
import * as React from "react";
import { cn } from "../lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  // Puedes agregar más props si lo necesitas
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "p-4 mb-4 border rounded-md shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn("font-semibold text-lg", className)}
      {...props}
    >
      {children}
    </h4>
  )
);

AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  )
);

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
